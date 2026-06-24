import { relatedNotesRegex } from "./utils.mjs";

export function validate(content) {
  const errors = [];
  const warnings = [];
  const required = [
    { name: "## TL;DR", regex: /^##\s+(?:💡\s+)?TL;DR/m },
    { name: "Related Notes section", regex: relatedNotesRegex },
  ];
  for (const req of required) {
    if (!req.regex.test(content)) {
      errors.push(`Audit Note is missing '${req.name}'`);
    }
  }
  return { errors, warnings };
}
