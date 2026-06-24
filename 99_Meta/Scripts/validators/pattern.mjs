import { relatedNotesRegex } from "./utils.mjs";

export function validate(content) {
  const errors = [];
  const warnings = [];
  const required = [
    { name: "## TL;DR", regex: /^##\s+(?:💡\s+)?TL;DR/m },
    {
      name: "## The Logic (Backend)",
      regex: /^##\s+(?:🧠\s+)?The Logic(?: \(Backend\))?/m,
    },
    {
      name: "## Dataset (The Inventory)",
      regex: /^##\s+(?:🗃️\s+)?Dataset(?: \(The Inventory\))?/m,
    },
    { name: "Related Notes section", regex: relatedNotesRegex },
  ];
  for (const req of required) {
    if (!req.regex.test(content)) {
      errors.push(`Pattern Note is missing '${req.name}'`);
    }
  }
  return { errors, warnings };
}
