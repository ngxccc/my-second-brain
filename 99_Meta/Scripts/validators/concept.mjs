import { relatedNotesRegex } from "./utils.mjs";

export function validate(content, { tags, relativePath }) {
  const errors = [];
  const warnings = [];
  const isTech = tags.includes("topic/tech") || relativePath.includes("/Tech/");
  const required = [
    { name: "## TL;DR", regex: /^##\s+(?:💡\s+)?TL;DR/m, isError: true },
    { name: "Related Notes section", regex: relatedNotesRegex, isError: true },
  ];
  if (isTech) {
    required.push(
      {
        name: "## Core Concept",
        regex:
          /^##\s+(?:[^\n\r#]*\s+)?(?:Core\s+Concept|Core\s+Principles|Core\s+Concepts|Analogy|Comparison|Classifications|Rules)/im,
        isError: false,
      },
      {
        name: "## Practical Implementation",
        regex:
          /^##\s+(?:[^\n\r#]*\s+)?(?:Practical\s+Implementation|Workflow\s*&\s*Code\s*Example|Detailed\s+Findings|Code\s+Snippet|Implementation\s+Phases|How\s+to\s+use|Step-by-Step)/im,
        isError: false,
      },
    );
  }
  for (const req of required) {
    if (!req.regex.test(content)) {
      if (req.isError) {
        errors.push(`Concept Note is missing '${req.name}'`);
      } else {
        warnings.push(
          `Concept Note is missing '${req.name}' (optional template structure)`,
        );
      }
    }
  }
  return { errors, warnings };
}
