import { relatedNotesRegex } from "./utils.mjs";

export function validate(content) {
  const errors = [];
  const warnings = [];
  const hasMethodHeadings =
    /^##\s+(?:[^\n\r#]*\s+)?Context:\s*When to\s+(?:use|apply)\??/im.test(
      content,
    ) &&
    /^##\s+(?:[^\n\r#]*\s+)?(?:Step-by-Step|Actionable\s+Script)/im.test(
      content,
    );
  const hasConceptHeadings =
    /^##\s+(?:[^\n\r#]*\s+)?(?:Core\s+Concept|Core\s+Principles)/im.test(
      content,
    ) &&
    /^##\s+(?:[^\n\r#]*\s+)?(?:Practical\s+Implementation|Workflow\s*&\s*Code\s*Example|Detailed\s+Findings|Code\s+Snippet)/im.test(
      content,
    );

  if (!hasMethodHeadings && !hasConceptHeadings) {
    errors.push(
      "Method Note must have either ('Context' and 'Step-by-Step' sections) or ('Core Concept' and 'Practical Implementation' sections)",
    );
  }

  const hasTldr = /^##\s+(?:💡\s+)?TL;DR/m.test(content);
  if (!hasTldr) {
    errors.push("Method Note is missing '## TL;DR' section");
  }

  if (!relatedNotesRegex.test(content)) {
    errors.push("Method/SOP Note is missing Related Notes section");
  }
  return { errors, warnings };
}
