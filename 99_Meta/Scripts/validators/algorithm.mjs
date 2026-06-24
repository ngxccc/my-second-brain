import { relatedNotesRegex } from "./utils.mjs";

export function validate(content) {
  const errors = [];
  const warnings = [];
  const required = [
    { name: "## TL;DR", regex: /^##\s+(?:💡\s+)?TL;DR/m },
    {
      name: "## Core Concept",
      regex: /^##\s+(?:[^\n\r#]*\s+)?(?:Core\s+Concept|Core\s+Principles)/im,
    },
    {
      name: "## Practical Implementation",
      regex:
        /^##\s+(?:[^\n\r#]*\s+)?(?:Practical\s+Implementation|Workflow\s*&\s*Code\s*Example|Detailed\s+Findings|Code\s+Snippet)/im,
    },
    { name: "Related Notes section", regex: relatedNotesRegex },
  ];
  for (const req of required) {
    if (!req.regex.test(content)) {
      errors.push(`Algorithm Note is missing '${req.name}'`);
    }
  }
  return { errors, warnings };
}
