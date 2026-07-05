# GitHub Stars Cleanup Script

A lightweight JavaScript tool to manage and organize your GitHub starred repositories using GitHub's Star Lists feature.

The script allows you to:

- Automatically rename lists (remove emojis)
- Create, delete, and reorganize Star Lists
- Move repositories between lists
- Unstar repositories in bulk
- Generate a human-readable Markdown checklist for easy editing

## Prerequisites

- [GitHub CLI](https://cli.github.com/) installed and authenticated
- Node.js (v18+ recommended)

Make sure you are logged in:

```bash
gh auth status
```

## Usage

### 1. Generate Checklist

This command fetches all your starred repositories and current Star Lists from GitHub, then generates (or updates) a Markdown checklist:

```bash
node 99_Meta/Scripts/cleanup_github_stars.mjs generate
```

The checklist will be saved to:

```
00_Inbox/github-stars-cleanup.md
```

### 2. Edit the Checklist

Open the generated Markdown file and make changes:

- **Unstar a repo**: Change `[x]` to `[ ]`
- **Move a repo to another list**: Cut and paste the line under a different `## List Name` heading
- **Create a new list**: Add a new heading (e.g. `## New-Category`)
- **Delete a list**: Remove the entire heading and its items

### 3. Apply Changes

After editing, run the apply command. Use `--dry-run` first to preview changes:

```bash
# Preview changes without modifying anything
node 99_Meta/Scripts/cleanup_github_stars.mjs apply --dry-run

# Apply changes to GitHub
node 99_Meta/Scripts/cleanup_github_stars.mjs apply
```

The script will:

- Delete lists that no longer exist in the checklist
- Create new lists if needed
- Update repository memberships across lists
- Unstar repositories that were unchecked
- Regenerate the checklist to reflect the latest state

## How It Works

- Uses GitHub GraphQL API via the `gh` CLI
- Supports all major list operations: `createUserList`, `deleteUserList`, `updateUserList`, `updateUserListsForItem`, `removeStar`
- Works with Node.js (no TypeScript compilation required)
- Fully idempotent and safe to re-run

## Notes

- The script respects the exact heading names in the Markdown file. Do not add emojis to headings.
- Always run with `--dry-run` before applying if you're unsure.
- The checklist is designed to be edited manually in Obsidian or any Markdown editor.

## License

This script is part of a personal second brain system and is provided as-is.
