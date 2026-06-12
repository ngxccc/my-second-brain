import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();

// Colors for console
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m"
};

async function getMarkdownFiles(dir) {
  let results = [];
  const list = await fs.readdir(dir, { withFileTypes: true });
  for (const file of list) {
    const res = path.resolve(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(await getMarkdownFiles(res));
    } else if (file.isFile() && file.name.endsWith('.md') && !file.name.includes('MOC') && !file.name.includes('Template')) {
      results.push(res);
    }
  }
  return results;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const lines = match[1].split('\n');
  const yaml = {};
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();
      yaml[key] = val;
    }
  }
  return yaml;
}

async function validateFile(filePath) {
  const relativePath = path.relative(rootDir, filePath);
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const errors = [];
    const warnings = [];

    // 1. YAML frontmatter check
    const frontmatter = parseFrontmatter(content);
    if (!frontmatter) {
      errors.push("Missing or invalid YAML frontmatter (must start and end with '---')");
      return { path: relativePath, errors, warnings, isPlaceholder: false };
    }

    // Check tags
    if (!frontmatter.tags) {
      errors.push("Missing 'tags' in frontmatter");
    } else if (frontmatter.tags === '[]' || frontmatter.tags.trim() === '') {
      errors.push("'tags' is empty");
    }

    const tags = frontmatter.tags || '';
    const isPlaceholder = tags.includes('status/todo') || content.includes('TODO:') || content.includes('Placeholder');

    // 2. Heading 1 check
    const hasH1 = /^#\s+.+/m.test(content);
    if (!hasH1) {
      errors.push("Missing top-level heading (# Title)");
    }

    // Check for raw template instruction markers
    if (content.includes('[BẮT BUỘC]') || content.includes('[TÙY CHỌN]')) {
      errors.push("Note still contains raw template instruction markers ('[BẮT BUỘC]' or '[TÙY CHỌN]')");
    }

    if (!isPlaceholder) {
      // Check for Daily Logs path
      if (relativePath.startsWith('20_Areas/Daily_Logs')) {
        const hasWhatNext = /^##\s+What next\??/mi.test(content);
        if (!hasWhatNext) {
          errors.push("Daily Log is missing '## What next?' section");
        }
      } else {
        // Enforce template-specific headers based on tags
        if (tags.includes('type/concept')) {
          const required = [
            { name: "## TL;DR", regex: /^##\s+(?:💡\s+)?TL;DR/m },
            { name: "## Core Concept", regex: /^##\s+Core Concept/m },
            { name: "## Practical Implementation", regex: /^##\s+Practical Implementation/m },
            { name: "## Related Notes or **Related Notes:**", regex: /^##\s+Related Notes|^##\s+🔗\s+Related Notes|^\*\*Related Notes:\*\*/m }
          ];
          for (const req of required) {
            if (!req.regex.test(content)) {
              errors.push(`Concept Note is missing '${req.name}' section`);
            }
          }
        } else if (tags.includes('type/pattern')) {
          const required = [
            { name: "## TL;DR", regex: /^##\s+(?:💡\s+)?TL;DR/m },
            { name: "## The Logic (Backend)", regex: /^##\s+(?:🧠\s+)?The Logic(?: \(Backend\))?/m },
            { name: "## Dataset (The Inventory)", regex: /^##\s+(?:🗃️\s+)?Dataset(?: \(The Inventory\))?/m },
            { name: "## Connections", regex: /^##\s+(?:🔗\s+)?Connections/m }
          ];
          for (const req of required) {
            if (!req.regex.test(content)) {
              errors.push(`Pattern Note is missing '${req.name}' section`);
            }
          }
        } else if (tags.includes('type/mental-model')) {
          const required = [
            { name: "## TL;DR", regex: /^##\s+(?:💡\s+)?TL;DR/m },
            { name: "## Context: When to apply?", regex: /^##\s+(?:🎯\s+)?Context:\s*When to apply\??/m },
            { name: "## Actionable Script / How-to", regex: /^##\s+(?:💬\s+)?Actionable Script/m },
            { name: "## Connections", regex: /^##\s+(?:🔗\s+)?Connections/m }
          ];
          for (const req of required) {
            if (!req.regex.test(content)) {
              errors.push(`Mental Model Note is missing '${req.name}' section`);
            }
          }
        } else if (tags.includes('type/vocab')) {
          const required = [
            { name: "## Definition", regex: /^##\s+(?:📖\s+)?Definition/m },
            { name: "## Context / Examples", regex: /^##\s+(?:🧩\s+)?Context \/ Examples/m }
          ];
          for (const req of required) {
            if (!req.regex.test(content)) {
              errors.push(`Vocab Note is missing '${req.name}' section`);
            }
          }
        } else if (tags.includes('type/project')) {
          const required = [
            { name: "## Objective (SMART Goal)", regex: /^##\s+(?:🎯\s+)?Objective \(SMART Goal\)/m },
            { name: "## Roadmap / Milestones", regex: /^##\s+(?:🗺️\s+)?Roadmap \/ Milestones/m },
            { name: "## Work Log / Decisions", regex: /^##\s+(?:📝\s+)?Work Log \/ Decisions/m }
          ];
          for (const req of required) {
            if (!req.regex.test(content)) {
              errors.push(`Project Note is missing '${req.name}' section`);
            }
          }
        } else if (tags.includes('type/meeting')) {
          const required = [
            { name: "## Agenda", regex: /^##\s+(?:🎯\s+)?Agenda/m },
            { name: "## Action Items", regex: /^##\s+(?:✅\s+)?Action Items/m }
          ];
          for (const req of required) {
            if (!req.regex.test(content)) {
              errors.push(`Meeting Note is missing '${req.name}' section`);
            }
          }
        } else if (tags.includes('type/method')) {
          const required = [
            { name: "## TL;DR", regex: /^##\s+(?:💡\s+)?TL;DR/m },
            { name: "## Context: When to use?", regex: /^##\s+(?:🎯\s+)?Context:\s*When to use\??/m },
            { name: "## Step-by-Step Guideline", regex: /^##\s+Step-by-Step Guideline/m },
            { name: "## Related Notes or **Related Notes:**", regex: /^##\s+Related Notes|^##\s+🔗\s+Related Notes|^\*\*Related Notes:\*\*/m }
          ];
          for (const req of required) {
            if (!req.regex.test(content)) {
              errors.push(`Method/SOP Note is missing '${req.name}' section`);
            }
          }
        } else {
          // Fallback to standard generic checks if it has no type tag
          const hasTldr = /^##\s+TL;DR/m.test(content);
          if (!hasTldr) {
            errors.push("Missing '## TL;DR' section");
          }
        }

        // Standard check for secondary headings in general
        const hasH2 = /^##\s+.+/m.test(content);
        if (!hasH2) {
          warnings.push("No secondary headings (##) found");
        }
      }
    } else {
      // For placeholders
      if (!content.includes('TODO') && !content.includes('placeholder') && !content.includes('Placeholder')) {
        warnings.push("Note has placeholder status but no TODO tag or explanation in content");
      }
    }

    return { path: relativePath, errors, warnings, isPlaceholder };
  } catch (err) {
    return { path: relativePath, errors: [`Error reading file: ${err.message}`], warnings: [], isPlaceholder: false };
  }
}

async function main() {
  console.log(`${colors.cyan}=== Obsidian Atomic Note Validator ===${colors.reset}`);
  
  let allFiles = [];
  const args = process.argv.slice(2);

  if (args.length > 0) {
    for (const arg of args) {
      allFiles.push(path.resolve(rootDir, arg));
    }
  } else {
    const foldersToScan = [
      path.join(rootDir, '30_Resources/Concepts'),
      path.join(rootDir, '30_Resources/Tech'),
      path.join(rootDir, '30_Resources/Methods')
    ];

    for (const folder of foldersToScan) {
      try {
        const files = await getMarkdownFiles(folder);
        allFiles = allFiles.concat(files);
      } catch (e) {
        // Folder might not exist yet or error reading
      }
    }
  }
  let failedCount = 0;
  let passedCount = 0;
  let placeholderCount = 0;

  for (const file of allFiles) {
    const result = await validateFile(file);
    if (result.errors.length > 0) {
      failedCount++;
      console.log(`${colors.red}✗ FAILED: ${result.path}${colors.reset}`);
      for (const err of result.errors) {
        console.log(`  - ERROR: ${err}`);
      }
      for (const warn of result.warnings) {
        console.log(`  - WARNING: ${warn}`);
      }
    } else {
      passedCount++;
      if (result.isPlaceholder) {
        placeholderCount++;
        console.log(`${colors.yellow}⚠ PASSED (Placeholder): ${result.path}${colors.reset}`);
      } else {
        console.log(`${colors.green}✓ PASSED: ${result.path}${colors.reset}`);
      }
      if (result.warnings.length > 0) {
        for (const warn of result.warnings) {
          console.log(`    - WARNING: ${warn}`);
        }
      }
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Total scanned: ${allFiles.length}`);
  console.log(`Passed:        ${colors.green}${passedCount}${colors.reset} (including ${placeholderCount} placeholders)`);
  console.log(`Failed:        ${colors.red}${failedCount}${colors.reset}`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(err => {
  console.error("Validator crashed:", err);
  process.exit(1);
});
