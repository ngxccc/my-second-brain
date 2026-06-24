export function validate(content) {
  const errors = [];
  const warnings = [];
  const required = [
    {
      name: "## Objective (SMART Goal)",
      regex: /^##\s+(?:🎯\s+)?Objective \(SMART Goal\)/m,
    },
    {
      name: "## Roadmap / Milestones",
      regex: /^##\s+(?:🗺️\s+)?Roadmap \/ Milestones/m,
    },
    {
      name: "## Work Log / Decisions",
      regex: /^##\s+(?:📝\s+)?Work Log \/ Decisions/m,
    },
  ];
  for (const req of required) {
    if (!req.regex.test(content)) {
      errors.push(`Project Note is missing '${req.name}'`);
    }
  }
  return { errors, warnings };
}
