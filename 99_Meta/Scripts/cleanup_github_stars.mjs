import { spawnSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const MD_PATH = join(process.cwd(), "00_Inbox/github-stars-cleanup.md");

// --- GraphQL API Helper ---

function queryGraphQL(query, variables = {}) {
  const payload = JSON.stringify({ query, variables });
  const result = spawnSync("gh", ["api", "graphql", "--input", "-"], {
    input: payload,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(
      `GraphQL API error (exit code ${result.status}): ${result.stderr || result.stdout}`,
    );
  }

  const parsed = JSON.parse(result.stdout);
  if (parsed.errors && parsed.errors.length > 0) {
    throw new Error(
      `GraphQL API returned errors: ${parsed.errors.map((e) => e.message).join("; ")}`,
    );
  }

  return parsed.data;
}

// --- Emoji Cleaner ---

function removeEmojis(str) {
  return str
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
    .replace(/[\uFE0E\uFE0F]/g, "") // remove variation selectors
    .trim();
}

// --- GitHub Functions ---

async function fetchAllStarredRepos() {
  console.log("Fetching all starred repositories from GitHub...");
  const query = `
    query($cursor: String) {
      viewer {
        starredRepositories(first: 100, after: $cursor) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            nameWithOwner
            id
            url
            description
            stargazerCount
            primaryLanguage {
              name
            }
          }
        }
      }
    }
  `;

  const repos = [];
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const res = await queryGraphQL(query, cursor ? { cursor } : {});
    if (res && res.viewer && res.viewer.starredRepositories) {
      const conn = res.viewer.starredRepositories;
      repos.push(...conn.nodes);
      hasNextPage = conn.pageInfo.hasNextPage;
      cursor = conn.pageInfo.endCursor;
    } else {
      throw new Error("Invalid response format for starred repositories");
    }
  }

  return repos;
}

async function fetchLists() {
  console.log("Fetching Star Lists from GitHub...");
  const query = `
    query {
      viewer {
        lists(first: 100) {
          nodes {
            id
            name
            items(first: 100) {
              nodes {
                ... on Repository {
                  id
                  nameWithOwner
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await queryGraphQL(query);
  if (res && res.viewer && res.viewer.lists) {
    return res.viewer.lists.nodes;
  }
  throw new Error("Invalid response format for lists");
}

// --- Main CLI Commands ---

async function generate() {
  const allStarredRepos = await fetchAllStarredRepos();
  const lists = await fetchLists();

  // 1. Rename any lists that have emojis in their name
  for (const list of lists) {
    const cleanName = removeEmojis(list.name);
    if (cleanName !== list.name) {
      console.log(
        `Renaming list "${list.name}" to "${cleanName}" to remove emojis...`,
      );
      await queryGraphQL(
        `
        mutation($listId: ID!, $name: String!) {
          updateUserList(input: {listId: $listId, name: $name}) { clientMutationId }
        }
      `,
        { listId: list.id, name: cleanName },
      );
      list.name = cleanName;
    }
  }

  // 2. Associate each repo with list groups
  const categorizedRepos = new Set();
  const listGroups = new Map();

  for (const list of lists) {
    const listRepos = [];
    for (const item of list.items.nodes) {
      const fullRepo = allStarredRepos.find(
        (r) => r.nameWithOwner === item.nameWithOwner,
      );
      if (fullRepo) {
        listRepos.push(fullRepo);
        categorizedRepos.add(item.nameWithOwner);
      }
    }
    listGroups.set(list.name, listRepos);
  }

  // Collect uncategorized repos
  const uncategorizedRepos = [];
  for (const repo of allStarredRepos) {
    if (!categorizedRepos.has(repo.nameWithOwner)) {
      uncategorizedRepos.push(repo);
    }
  }
  if (uncategorizedRepos.length > 0) {
    listGroups.set("Uncategorized", uncategorizedRepos);
  }

  // 3. Write Markdown checklist
  let md = `# GitHub Stars Cleanup\n\n`;
  md += `Below is the list of your starred repositories grouped by their Star List.\n`;
  md += `To sort a repository into a different list, simply cut and paste its line under that list's heading.\n`;
  md += `To unstar a repository, change \`[x]\` to \`[ ]\` (uncheck it).\n`;
  md += `Once you are done, let me know, and I will run the script to apply all changes (rename lists, sort repositories into lists, and unstar unchecked ones).\n\n`;
  md += `Total starred repositories: **${allStarredRepos.length}**\n\n`;

  // Sort list names so Uncategorized is at the end, others alphabetically
  const listNames = Array.from(listGroups.keys()).sort((a, b) => {
    if (a === "Uncategorized") return 1;
    if (b === "Uncategorized") return -1;
    return a.localeCompare(b);
  });

  for (const listName of listNames) {
    const repos = listGroups.get(listName) || [];
    md += `## ${listName} (${repos.length})\n\n`;
    const sortedRepos = repos.sort((a, b) =>
      a.nameWithOwner.localeCompare(b.nameWithOwner),
    );
    for (const repo of sortedRepos) {
      const stars =
        repo.stargazerCount >= 1000
          ? `${(repo.stargazerCount / 1000).toFixed(1)}k`
          : `${repo.stargazerCount}`;
      const desc = repo.description
        ? ` - *${repo.description.replace(/\n/g, " ").trim()}*`
        : "";
      md += `- [x] [${repo.nameWithOwner}](${repo.url}) (${stars} stars)${desc}\n`;
    }
    md += `\n`;
  }

  writeFileSync(MD_PATH, md, "utf8");
  console.log(`Generated star checklist at: ${MD_PATH}`);
  console.log(
    `Processed ${allStarredRepos.length} stars across ${lists.length} lists.`,
  );
}

async function apply(dryRun = false) {
  if (!existsSync(MD_PATH)) {
    console.error(`Markdown file not found at ${MD_PATH}. Run generate first.`);
    return;
  }

  console.log(`Reading star checklist from ${MD_PATH}...`);
  const content = readFileSync(MD_PATH, "utf8");
  const lines = content.split("\n");

  const repoToDesiredLists = new Map();
  const unstarredRepos = new Set();
  const desiredLists = new Set();

  const categoryRegex = /^##\s+([^(]+?)(?:\s+\(\d+\))?$/;
  const checklistRegex =
    /^-\s*\[\s*([ xX]?)\s*\]\s*\[([^\]]+)\]\((https:\/\/github\.com\/[^)]+)\)/;

  let currentCategory = null;

  for (const line of lines) {
    const catMatch = line.match(categoryRegex);
    if (catMatch) {
      currentCategory = removeEmojis(catMatch[1]);
      if (
        currentCategory !== "Uncategorized" &&
        !currentCategory.startsWith("Total starred")
      ) {
        desiredLists.add(currentCategory);
      }
      continue;
    }

    const itemMatch = line.match(checklistRegex);
    if (itemMatch) {
      const isChecked = itemMatch[1].toLowerCase() === "x";
      const repoFullName = itemMatch[2];
      if (!isChecked) {
        unstarredRepos.add(repoFullName);
      } else if (
        currentCategory &&
        currentCategory !== "Uncategorized" &&
        !currentCategory.startsWith("Total starred")
      ) {
        if (!repoToDesiredLists.has(repoFullName)) {
          repoToDesiredLists.set(repoFullName, new Set());
        }
        repoToDesiredLists.get(repoFullName).add(currentCategory);
      }
    }
  }

  console.log("Fetching current state from GitHub for synchronization...");
  const allStarredRepos = await fetchAllStarredRepos();
  const currentListsFromGitHub = await fetchLists();

  const currentLists = new Map(); // list name -> list ID
  const currentListItems = new Map(); // list ID -> Set of repository nameWithOwner
  const repoNodeIds = new Map(); // nameWithOwner -> node_id

  for (const repo of allStarredRepos) {
    repoNodeIds.set(repo.nameWithOwner, repo.id);
  }

  for (const list of currentListsFromGitHub) {
    currentLists.set(list.name, list.id);
    const itemNames = new Set();
    for (const item of list.items.nodes) {
      itemNames.add(item.nameWithOwner);
    }
    currentListItems.set(list.id, itemNames);
  }

  if (dryRun) {
    console.log("=== DRY RUN (No changes made) ===");
  }

  // 1. Delete lists no longer in the markdown
  for (const [listName, listId] of currentLists.entries()) {
    if (!desiredLists.has(listName)) {
      console.log(
        `List "${listName}" is no longer in the checklist. Deleting...`,
      );
      if (!dryRun) {
        await queryGraphQL(
          `
          mutation($listId: ID!) {
            deleteUserList(input: {listId: $listId}) { clientMutationId }
          }
        `,
          { listId },
        );
      }
      currentLists.delete(listName);
      currentListItems.delete(listId);
    }
  }

  // 2. Create missing lists
  for (const listName of desiredLists) {
    if (!currentLists.has(listName)) {
      console.log(`List "${listName}" does not exist. Creating...`);
      if (!dryRun) {
        const createRes = await queryGraphQL(
          `
          mutation($name: String!) {
            createUserList(input: {name: $name, isPrivate: true}) {
              list { id name }
            }
          }
        `,
          { name: listName },
        );
        if (
          createRes &&
          createRes.createUserList &&
          createRes.createUserList.list
        ) {
          const newList = createRes.createUserList.list;
          currentLists.set(newList.name, newList.id);
          currentListItems.set(newList.id, new Set());
        }
      } else {
        currentLists.set(listName, `mock-id-${listName}`);
        currentListItems.set(`mock-id-${listName}`, new Set());
      }
    }
  }

  // 3. Unstar repos
  for (const repoName of unstarredRepos) {
    const id = repoNodeIds.get(repoName);
    if (id) {
      console.log(`Unstarring ${repoName}...`);
      if (!dryRun) {
        await queryGraphQL(
          `
          mutation($starrableId: ID!) {
            removeStar(input: {starrableId: $starrableId}) { clientMutationId }
          }
        `,
          { starrableId: id },
        );
      }
    } else {
      console.warn(
        `Warning: Node ID not found for repository to unstar: ${repoName}`,
      );
    }
  }

  // 4. Update list memberships for checked repos
  for (const repoName of allStarredRepos.map((r) => r.nameWithOwner)) {
    if (unstarredRepos.has(repoName)) continue;

    const id = repoNodeIds.get(repoName);
    if (!id) continue;

    const desiredListNames = repoToDesiredLists.get(repoName) || new Set();
    const desiredListIds = new Set();
    for (const name of desiredListNames) {
      const listId = currentLists.get(name);
      if (listId) {
        desiredListIds.add(listId);
      }
    }

    // Get current lists this repo belongs to
    const currentListIdsForRepo = new Set();
    for (const [listId, items] of currentListItems.entries()) {
      if (items.has(repoName)) {
        currentListIdsForRepo.add(listId);
      }
    }

    // Check if membership differs
    let needsUpdate = currentListIdsForRepo.size !== desiredListIds.size;
    if (!needsUpdate) {
      for (const listId of desiredListIds) {
        if (!currentListIdsForRepo.has(listId)) {
          needsUpdate = true;
          break;
        }
      }
    }

    if (needsUpdate) {
      console.log(
        `Updating list memberships for ${repoName} -> [${Array.from(desiredListNames).join(", ")}]`,
      );
      if (!dryRun) {
        await queryGraphQL(
          `
          mutation($itemId: ID!, $listIds: [ID!]!) {
            updateUserListsForItem(input: {itemId: $itemId, listIds: $listIds}) { clientMutationId }
          }
        `,
          { itemId: id, listIds: Array.from(desiredListIds) },
        );
      }
    }
  }

  console.log("Cleanup synchronization finished.");

  if (!dryRun) {
    console.log("Regenerating checklist to reflect updated state...");
    await generate();
  }
}

const command = process.argv[2] || "generate";
const dryRunFlag = process.argv.includes("--dry-run");

if (command === "generate") {
  generate().catch((err) => console.error("Error during generate:", err));
} else if (command === "apply") {
  apply(dryRunFlag).catch((err) => console.error("Error during apply:", err));
} else {
  console.error("Unknown command. Use 'generate' or 'apply'.");
}
