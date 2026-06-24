export function validate(content) {
  const errors = [];
  const warnings = [];
  const required = [
    { name: "## Agenda", regex: /^##\s+(?:🎯\s+)?Agenda/m },
    { name: "## Action Items", regex: /^##\s+(?:✅\s+)?Action Items/m },
  ];
  for (const req of required) {
    if (!req.regex.test(content)) {
      errors.push(`Meeting Note is missing '${req.name}'`);
    }
  }
  return { errors, warnings };
}
