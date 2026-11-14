import { relatedNotesRegex } from "./utils.mjs";

export function validate(content, { relativePath = "" } = {}) {
	const errors = [];
	const warnings = [];

	// Exclude roadmaps: roadmaps have their own dedicated validator
	const isRoadmap = /Roadmap\.md$/i.test(relativePath);
	if (isRoadmap) {
		return { errors, warnings };
	}

	const hasMethodHeadings =
		/^##\s+(?:[^\n\r#]*\s+)?Context:\s*When to\s+(?:use|apply)\??/im.test(
			content,
		) &&
		/^##\s+(?:[^\n\r#]*\s+)?(?:Step-by-Step|Actionable\s+Script)/im.test(
			content,
		);
	// Heading names are free (AGENTS.md §4: a section is named after the question
	// it answers), so the mechanics + procedure shape is matched by "a mechanics
	// section plus at least one further topic section", not by a fixed name.
	const topicHeadingCount = [...content.matchAll(/^##\s+(.+?)\s*$/gim)]
		.map((match) => match[1])
		.filter(
			(title) =>
				!/^(?:💡\s+)?TL;DR/i.test(title) && !/^Related\s+Notes/i.test(title),
		).length;
	const hasConceptHeadings =
		/^##\s+(?:[^\n\r#]*\s+)?(?:Core\s+Concept|Core\s+Principles)/im.test(
			content,
		) && topicHeadingCount >= 2;

	if (!hasMethodHeadings && !hasConceptHeadings) {
		errors.push(
			"Method Note must have either ('Context' and 'Step-by-Step' sections) or ('Core Concept' plus a further topic section that holds the procedure)",
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
