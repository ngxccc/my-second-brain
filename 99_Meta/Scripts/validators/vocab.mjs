import { relatedNotesRegex } from "./utils.mjs";

export function validate(content) {
  const errors = [];
  const warnings = [];
  const hasSingleWordHeadings =
    /^##\s+(?:📖\s+)?Definition/m.test(content) &&
    /^##\s+(?:🧩\s+)?Context \/ Examples/m.test(content);
  const hasListHeadings =
    /^##\s+(?:💡\s+)?TL;DR/m.test(content) && relatedNotesRegex.test(content);
  if (!hasSingleWordHeadings && !hasListHeadings) {
    errors.push(
      "Vocab Note must have either ('## Definition' and '## Context / Examples' sections) or ('## TL;DR' and a Related Notes section)",
    );
  }
  return { errors, warnings };
}
