import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const colors = {
	reset: "\x1b[0m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	cyan: "\x1b[36m",
	bold: "\x1b[1m",
};

// Ignore non-resource folders
const ignoredDirs = [
	"10_Projects",
	"40_Archives",
	"00_Inbox",
	"99_Meta",
	".git",
	"node_modules",
];

async function getMarkdownFiles(dir) {
	let files = [];
	const entries = await fs.readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name.startsWith(".") || ignoredDirs.includes(entry.name))
				continue;
			files = files.concat(await getMarkdownFiles(fullPath));
		} else if (entry.isFile() && entry.name.endsWith(".md")) {
			files.push(fullPath);
		}
	}
	return files;
}

export function validateRoadmapContent(content, relativePath) {
	const errors = [];
	const warnings = [];

	const fileName = path.basename(relativePath);

	// Strictly enforce clean naming standard: <Topic>_Roadmap.md
	if (!fileName.endsWith("_Roadmap.md")) {
		errors.push(
			`Filename "${fileName}" violates standardized pattern. Must end with "*_Roadmap.md"`,
		);
	}

	// Frontmatter check
	if (!content.startsWith("---")) {
		errors.push("Missing YAML frontmatter (must start with '---')");
	}

	// 1. TL;DR
	const hasTldr = /^##\s+(?:💡\s+)?TL;DR/m.test(content);
	if (!hasTldr) {
		errors.push("Missing '## TL;DR' section");
	}

	// Related Notes check
	const hasRelatedNotes = /^##\s+Related\s+Notes/im.test(content);
	if (!hasRelatedNotes) {
		errors.push("Missing '## Related Notes' section");
	}

	// No-Emoji policy check
	const emojiRegex =
		/[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/u;
	if (emojiRegex.test(content)) {
		warnings.push("Contains emojis/icons, violating vault No-Emoji policy.");
	}

	// Check if note follows Ultralearning Canvas (has Metalearning Canvas / The Milestone Hierarchy)
	const isUltralearning = /^##\s+(?:1\.\s+)?Metalearning\s+Canvas/im.test(
		content,
	);

	if (isUltralearning) {
		// Check no ampersands in H2 titles
		const h2Matches = content.match(/^##\s+[^\n\r]+/gm) || [];
		for (const h2 of h2Matches) {
			if (h2.includes("&") || h2.toLowerCase().includes(" and ")) {
				errors.push(
					`Heading 2 contains '&' or 'and': "${h2}". Heading titles must be clean single noun phrases.`,
				);
			}
		}

		const actualH2List = h2Matches.map((h) => h.replace(/^##\s+/, "").trim());
		const requiredH2Patterns = [
			{ name: "TL;DR", regex: /^(?:💡\s+)?TL;DR$/i },
			{
				name: "1. Metalearning Canvas",
				regex: /^(?:1\.\s+)?Metalearning\s+Canvas$/i,
			},
			{
				name: "2. The Milestone Hierarchy",
				regex: /^(?:2\.\s+)?The\s+Milestone\s+Hierarchy$/i,
			},
			{
				name: "3. Real-World Failure Modes",
				regex: /^(?:3\.\s+)?Real-World\s+Failure\s+Modes$/i,
			},
			{
				name: "4. Verification Checklist",
				regex: /^(?:4\.\s+)?Verification\s+Checklist$/i,
			},
			{
				name: "5. Primary Citations",
				regex: /^(?:5\.\s+)?Primary\s+Citations$/i,
			},
			{ name: "Related Notes", regex: /^Related\s+Notes$/i },
		];

		for (let i = 0; i < requiredH2Patterns.length; i++) {
			const expected = requiredH2Patterns[i];
			const foundIdx = actualH2List.findIndex((h) => expected.regex.test(h));
			if (foundIdx === -1) {
				errors.push(`Missing required heading: "## ${expected.name}"`);
			}
		}

		// Check exact order
		if (errors.length === 0) {
			let lastIdx = -1;
			for (const expected of requiredH2Patterns) {
				const currentIdx = actualH2List.findIndex((h) =>
					expected.regex.test(h),
				);
				if (currentIdx < lastIdx) {
					errors.push(
						`Headings out of order: "## ${expected.name}" appeared before its prerequisite heading.`,
					);
				}
				lastIdx = currentIdx;
			}
		}
	} else {
		// Standard 80/20 & Engineering Roadmaps
		const hasCoreConcept =
			/^##\s+(?:Core\s+Concept|Core\s+Principles|Phần\s+1|Context|Lộ\s+Trình\s+Học)/im.test(
				content,
			);
		if (!hasCoreConcept) {
			errors.push(
				"Standard Roadmap is missing '## Core Concept' or '## Core Principles' section",
			);
		}

		const hasImplementation =
			/^##\s+(?:Practical\s+Implementation|Step-by-Step|The\s+3-Tier|Implementation|Phần\s+2|Lộ\s+Trình\s+Học)/im.test(
				content,
			);
		if (!hasImplementation) {
			errors.push(
				"Standard Roadmap is missing '## Practical Implementation' section",
			);
		}
	}

	return { errors, warnings };
}

async function main() {
	console.log(
		`${colors.cyan}${colors.bold}=== Vault Roadmaps Standardized Validator (<Topic>_Roadmap.md) ===${colors.reset}`,
	);
	const args = process.argv.slice(2);
	let filesToScan = [];

	if (args.length > 0) {
		filesToScan = args.map((f) => path.resolve(rootDir, f));
	} else {
		// Scan all roadmap files in 30_Resources/ (both Methods and Tech)
		const allFiles = await getMarkdownFiles(path.join(rootDir, "30_Resources"));
		filesToScan = allFiles.filter((f) => /Roadmap\.md$/i.test(f));
	}

	let failedCount = 0;
	let passedCount = 0;
	let ultralearningCount = 0;
	let standardCount = 0;

	for (const filePath of filesToScan) {
		const relativePath = path.relative(rootDir, filePath);
		const content = await fs.readFile(filePath, "utf8");
		const { errors, warnings } = validateRoadmapContent(content, relativePath);

		const isUltra = /^##\s+(?:1\.\s+)?Metalearning\s+Canvas/im.test(content);
		if (isUltra) ultralearningCount++;
		else standardCount++;

		if (errors.length > 0) {
			failedCount++;
			console.log(`${colors.red}✗ FAILED: ${relativePath}${colors.reset}`);
			for (const err of errors) {
				console.log(`  - ERROR: ${err}`);
			}
			for (const warn of warnings) {
				console.log(`  - WARNING: ${warn}`);
			}
		} else {
			passedCount++;
			const tag = isUltra
				? `${colors.cyan}[Ultralearning Canvas]${colors.reset}`
				: `${colors.yellow}[Standard 80/20]${colors.reset}`;
			console.log(
				`${colors.green}✓ PASSED: ${relativePath} ${tag}${colors.reset}`,
			);
			for (const warn of warnings) {
				console.log(`  - WARNING: ${warn}`);
			}
		}
	}

	console.log(
		`\n${colors.bold}Summary:${colors.reset} Total Scanned: ${filesToScan.length} (Ultralearning Canvas: ${ultralearningCount}, Standard: ${standardCount}) | ${colors.green}Passed: ${passedCount}${colors.reset} | ${colors.red}Failed: ${failedCount}${colors.reset}`,
	);
	if (failedCount > 0) {
		process.exit(1);
	}
}

if (
	process.argv[1] &&
	import.meta.url.endsWith(process.argv[1].split("/").pop())
) {
	main();
}
