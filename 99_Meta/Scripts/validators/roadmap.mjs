import { relatedNotesRegex } from "./utils.mjs";

export function validate(content, { relativePath = "" } = {}) {
	const errors = [];
	const warnings = [];

	// Required sections for an Ultralearning Roadmap
	const hasTldr = /^##\s+(?:💡\s+)?TL;DR/m.test(content);
	if (!hasTldr) {
		errors.push("Roadmap Note is missing '## TL;DR' section");
	}

	// Metalearning or Core Principles
	const hasMetalearning =
		/^##\s+(?:[0-9]+\.\s+)?(?:Metalearning|Core\s+Concept|Core\s+Principles)/im.test(
			content,
		);
	if (!hasMetalearning) {
		errors.push(
			"Roadmap Note is missing '## Metalearning Canvas' or '## Core Concepts' section",
		);
	}

	// Level or Milestone hierarchy or Practical Implementation
	const hasMilestones =
		/^##\s+(?:[0-9]+\.\s+)?(?:The\s+Milestone\s+Hierarchy|Milestones|Capability\s+Levels|Learning\s+Stages|Practical\s+Implementation|Step-by-Step)/im.test(
			content,
		);
	if (!hasMilestones) {
		errors.push(
			"Roadmap Note is missing '## The Milestone Hierarchy' or '## Capability Levels' section",
		);
	}

	// Verification Checklist or Self-Assessment or Capstone
	const hasVerification =
		/^##\s+(?:[0-9]+\.\s+)?(?:Verification\s+Checklist|Capstone\s+Project|Boss\s+Gate|Self-Assessment|Practice\s+Plan)/im.test(
			content,
		);
	if (!hasVerification) {
		errors.push(
			"Roadmap Note is missing '## Verification Checklist' or '## Capstone Project' section",
		);
	}

	if (!relatedNotesRegex.test(content)) {
		errors.push("Roadmap Note is missing Related Notes section");
	}

	return { errors, warnings };
}
