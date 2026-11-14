#!/usr/bin/env bun
import fs from "node:fs";
import path from "node:path";

const colors = {
	reset: "\x1b[0m",
	bold: "\x1b[1m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	cyan: "\x1b[36m",
};

// Target directory can be passed as argument, defaults to local vault 50_Flashcards/Vocabulary and 50_Flashcards/Grammar
const targetArg = process.argv[2];

const searchDirs = [];
if (targetArg) {
	const resolved = path.resolve(targetArg);
	if (!fs.existsSync(resolved)) {
		console.error(
			`${colors.red}FAIL:${colors.reset} Target directory does not exist: '${resolved}'`,
		);
		process.exit(1);
	}
	searchDirs.push(resolved);
} else {
	const vocabDir = path.resolve("50_Flashcards/Vocabulary");
	const grammarDir = path.resolve("50_Flashcards/Grammar");
	if (!fs.existsSync(vocabDir)) {
		console.error(
			`${colors.red}FAIL:${colors.reset} Missing required directory: '${vocabDir}'`,
		);
		process.exit(1);
	}
	if (!fs.existsSync(grammarDir)) {
		console.error(
			`${colors.red}FAIL:${colors.reset} Missing required directory: '${grammarDir}'`,
		);
		process.exit(1);
	}
	searchDirs.push(vocabDir, grammarDir);
}

let totalScanned = 0;
let failures = 0;
let warnings = 0;

function logError(file, message) {
	console.error(`${colors.red}FAIL:${colors.reset} [${file}] ${message}`);
	failures++;
}

function logWarning(file, message) {
	console.warn(`${colors.yellow}WARN:${colors.reset} [${file}] ${message}`);
	warnings++;
}

function findMarkdownFiles(dir) {
	let results = [];
	if (!fs.existsSync(dir)) return results;
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
				results = results.concat(findMarkdownFiles(fullPath));
			}
		} else if (entry.isFile() && entry.name.endsWith(".md")) {
			results.push(fullPath);
		}
	}
	return results;
}

let files = [];
for (const d of searchDirs) {
	files = files.concat(findMarkdownFiles(d));
}

if (files.length === 0) {
	console.log(
		`${colors.yellow}No English flashcard markdown files found in search targets.${colors.reset}`,
	);
	process.exit(0);
}

console.log(
	`${colors.cyan}${colors.bold}Auditing ${files.length} English Flashcard(s) (Vocabulary & Grammar)...${colors.reset}\n`,
);

for (const filePath of files) {
	const relPath = path.relative(process.cwd(), filePath);
	const content = fs.readFileSync(filePath, "utf-8");
	totalScanned++;

	const filename = path.basename(filePath);

	// 1. Invariant: Naming convention (Pascal_Snake_Case.md)
	const validNamePattern = /^[A-Z][a-zA-Z0-9]*(_[A-Za-z0-9]+)*\.md$/;
	if (!validNamePattern.test(filename)) {
		logError(
			relPath,
			`Filename must follow Pascal_Snake_Case.md (found: '${filename}')`,
		);
	}

	// 2. Strict Hierarchy Whitelist
	const validVocabDirs = [
		"1_Core_General",
		"2_Academic_Analytical",
		"3_Software_Engineering",
		"4_Professional_Workplace",
	];
	const validGrammarDirs = [
		"Parts_Of_Speech_And_Morphology",
		"Question_Patterns",
		"Sentence_Structures",
		"Technical_Phrasing",
		"Verb_Patterns_And_Prepositions",
	];
	const isVocab = relPath.includes("Vocabulary");
	const dirParts = relPath.split(path.sep);
	if (isVocab) {
		const sub = dirParts[dirParts.indexOf("Vocabulary") + 1];
		if (!validVocabDirs.includes(sub)) {
			logError(
				relPath,
				`Vocabulary card is in invalid subfolder '${sub}'. Allowed: ${validVocabDirs.join(", ")}`,
			);
		}
	} else if (relPath.includes("Grammar")) {
		const sub = dirParts[dirParts.indexOf("Grammar") + 1];
		if (!validGrammarDirs.includes(sub)) {
			logError(
				relPath,
				`Grammar card is in invalid subfolder '${sub}'. Allowed: ${validGrammarDirs.join(", ")}`,
			);
		}
	}

	// 3. Strict No-Truncation Guard (... or … at line ends)
	const lines = content.split(/\r?\n/);
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		if (
			(line.endsWith("...") || line.endsWith("…")) &&
			!line.startsWith("<!--") &&
			!line.startsWith("```") &&
			!line.startsWith("⎧") &&
			!line.startsWith("⎪") &&
			!line.startsWith("⎩") &&
			!line.includes("e.g.") &&
			!line.includes("ví dụ") &&
			!line.startsWith("...")
		) {
			logError(
				relPath,
				`Line ${i + 1} ends with invalid truncation '...': '${line.slice(0, 60)}'`,
			);
		}
	}

	// 4. Section Separator Check (---)
	const parts = content.split(/\n---\r?\n/);
	if (parts.length < 2) {
		logError(
			relPath,
			`Invalid card structure. Expected at least 2 sections separated by '---' (Frontmatter and Content). Found ${parts.length} sections.`,
		);
		continue;
	}

	const frontmatter = parts[0];

	// 5. Invariant: Strict Numeric noteId in YAML frontmatter
	if (!/^noteId:\s*\d{12,14}\s*$/m.test(frontmatter)) {
		logError(
			relPath,
			"Missing or invalid 'noteId:' in YAML frontmatter. Must be a numeric epoch timestamp (12-14 digits).",
		);
	}

	// 4. Cloze Card Handling vs Standard Q&A Handling
	const promptSection = parts[1] ? parts[1].trim() : "";
	const extraSection = parts[2] ? parts[2].trim() : "";
	// Yanki markdown standard: Cloze is inferred via GFM strikethrough ~~word~~
	const isCloze = /~~[^~]+~~/.test(promptSection);

	// Strict SLA Invariant: All vocabulary cards MUST be Atomic Cloze cards using ~~word~~
	if (isVocab && !isCloze) {
		logError(
			relPath,
			"Vocabulary card violates Atomic Cloze standard. Vocabulary cards MUST use ~~target~~ contextual sentences (Yanki GFM strikethrough). Banned legacy definition Q&A format or raw {{c1::}} syntax.",
		);
		continue;
	}
	if (isCloze) {
		// Strict Invariant: Cloze prompt must not contain Vietnamese (zero-slot translation rule)
		const vietnameseCharRegex =
			/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/i;
		if (vietnameseCharRegex.test(promptSection)) {
			logError(
				relPath,
				"Cloze prompt contains Vietnamese characters. The main retrieval sentence must be 100% natural English to prevent translation latency. Move definitions to 'Extra:'.",
			);
		}

		// Strict Invariant: Cloze prompt must not contain metadata keywords
		if (/(meaning|word family|phonetics|collocations?):/i.test(promptSection)) {
			logError(
				relPath,
				"Cloze prompt contains metadata keywords ('Meaning:', 'Word Family:', etc.). The prompt must be a clean contextual sentence. Move all reference matrices down to 'Extra:'.",
			);
		}

		// Cloze prompt length guard (250 chars for rapid 3-second retrieval)
		if (promptSection.length > 250) {
			logError(
				relPath,
				`Cloze prompt is too bloated (${promptSection.length} chars, limit is 250 chars). The cloze prompt must be an atomic 3-second rapid retrieval sentence.`,
			);
		}
		if (promptSection.length < 25) {
			logError(
				relPath,
				`Cloze prompt is too short (${promptSection.length} chars, min 25 chars). Must be a complete contextual sentence.`,
			);
		}

		// Check cloze deletion targets inside ~~target~~
		const clozeMatches = Array.from(promptSection.matchAll(/~~([^~]+)~~/g));
		for (const match of clozeMatches) {
			const deletionText = match[1].trim();

			// Strict Atomic Target: Cloze deletion must be ONLY the target word or short collocation chunk (limit 35 chars)
			if (deletionText.length > 35) {
				logError(
					relPath,
					`Cloze deletion '~~${deletionText}~~' is too lengthy (${deletionText.length} chars, limit is 35 chars). An atomic cloze card must only test the exact target word or 2-word collocation chunk, not a long phrase or clause.`,
				);
			}
		}

		// Single Concept Invariant: Card must have exactly 1 cloze deletion
		if (clozeMatches.length > 1) {
			logError(
				relPath,
				`Cloze card has ${clozeMatches.length} cloze deletions. An atomic card must test exactly 1 retrieval target. Split into separate atomic cards.`,
			);
		}

		// Extra section check for cloze cards
		if (!extraSection || !extraSection.startsWith("Extra:")) {
			logError(
				relPath,
				"Cloze card must contain an auxiliary 'Extra:' section starting with 'Extra:'.",
			);
		}

		continue;
	}

	// 5. Standard Q&A Card Handling
	if (parts.length < 3) {
		logError(
			relPath,
			`Invalid Q&A card structure. Expected at least 3 sections separated by '---' (Frontmatter, Question, Answer). Found ${parts.length} sections.`,
		);
		continue;
	}

	const question = parts[1].trim();
	const answer = parts[2].trim();
	const extra = parts[3] ? parts[3].trim() : "";

	// Anti-Pattern: Question contains double question marks
	const questionMarks = (question.match(/\?/g) || []).length;
	if (questionMarks > 1) {
		logError(
			relPath,
			`Question contains ${questionMarks} question marks. Split into separate atomic cards.`,
		);
	}

	// Anti-Pattern: Open-ended essay prompt
	if (
		/giải thích (toàn bộ|cơ chế bên dưới|chi tiết)/i.test(question) ||
		/explain in detail/i.test(question)
	) {
		logError(
			relPath,
			"Question uses vague essay phrasing ('giải thích chi tiết / explain in detail'). Pose a direct target question testing a specific collocation, formula, or distinction.",
		);
	}

	// Strict SLA Minimum Information Principle: Max 2 top-level bullet points in main Answer
	const topLevelBullets = (answer.match(/^[*-]\s+/gm) || []).length;
	if (topLevelBullets > 2) {
		logError(
			relPath,
			`Answer section has ${topLevelBullets} top-level bullet points. Violates Minimum Information Principle (Max 2 bullets for 3-second rapid retrieval). Move Word Family, Collocations, and Examples to 'Extra:'.`,
		);
	}

	// Strict Verbosity Guard: Core answer must not exceed 280 characters
	if (answer.length > 280) {
		logError(
			relPath,
			`Answer section is too bloated (${answer.length} chars, limit is 280 chars). The core Answer must be a 3-second binary test. Move reference details to 'Extra:'.`,
		);
	}

	// Word Family & Reference Bloat Guard in Answer
	if (/Word Family:/i.test(answer) || /Concrete Examples:/i.test(answer)) {
		logError(
			relPath,
			"Answer contains full 'Word Family' or 'Concrete Examples'. Move comprehensive reference matrices down to 'Extra:'.",
		);
	}

	// Extra section structure check:
	if (extra && !extra.startsWith("Extra:")) {
		logError(
			relPath,
			"Third section must start with 'Extra:' for auxiliary reference notes.",
		);
	}
}

console.log("\n" + "─".repeat(60));
console.log(`Audited: ${totalScanned} English card(s)`);
console.log(`Warnings: ${warnings}`);
console.log(`Failures: ${failures}`);

if (failures > 0 || warnings > 0) {
	console.error(
		`\n${colors.red}${colors.bold}English flashcard validation failed in STRICT MODE with ${failures} error(s) and ${warnings} warning(s).${colors.reset}`,
	);
	process.exit(1);
} else {
	console.log(
		`\n${colors.green}${colors.bold}All English flashcard validation checks passed cleanly in STRICT MODE!${colors.reset}`,
	);
	process.exit(0);
}
