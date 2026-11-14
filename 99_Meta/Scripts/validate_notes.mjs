import fs from "node:fs/promises";
import path from "node:path";
import { validate as validateAlgorithm } from "./validators/algorithm.mjs";
import { validate as validateAudit } from "./validators/audit.mjs";
import { validate as validateChecklist } from "./validators/checklist.mjs";
import { validate as validateConcept } from "./validators/concept.mjs";
import { validate as validateGuide } from "./validators/guide.mjs";
import { validate as validateMethod } from "./validators/method.mjs";
import { validate as validatePattern } from "./validators/pattern.mjs";
import { validate as validateProject } from "./validators/project.mjs";
import { validate as validateStrategy } from "./validators/strategy.mjs";
import { validate as validateTechnique } from "./validators/technique.mjs";
import { codeBlockOrCommandRegex } from "./validators/utils.mjs";

const rootDir = process.cwd();
const validatorsRegistry = {
	"type/concept": validateConcept,
	"type/pattern": validatePattern,
	"type/project": validateProject,
	"type/method": validateMethod,
	"type/checklist": validateChecklist,
	"type/guide": validateGuide,
	"type/algorithm": validateAlgorithm,
	"type/audit": validateAudit,
	"type/strategy": validateStrategy,
	"type/technique": validateTechnique,
};
let declaredTagsSet = null;
async function getDeclaredTags() {
	if (declaredTagsSet) return declaredTagsSet;
	try {
		const ssotPath = path.join(rootDir, "99_Meta", "Tag_Taxonomy_SSOT.md");
		const content = await fs.readFile(ssotPath, "utf8");
		const matches = content.match(/`([a-z0-9_\-/]+)`/gi) || [];
		declaredTagsSet = new Set(
			matches.map((m) => m.replace(/`/g, "").toLowerCase()),
		);
	} catch {
		declaredTagsSet = new Set();
	}
	return declaredTagsSet;
}

// Colors for console
const colors = {
	reset: "\x1b[0m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	cyan: "\x1b[36m",
};

const ignoredDirs = [
	"00_Inbox",
	"10_Projects",
	"40_Archives",
	"50_Flashcards",
	"99_Meta",
	".git",
	".obsidian",
	".agents",
	"node_modules",
];

async function getMarkdownFiles(dir) {
	let results = [];
	const list = await fs.readdir(dir, { withFileTypes: true });
	for (const file of list) {
		const res = path.resolve(dir, file.name);
		if (file.isDirectory()) {
			if (!ignoredDirs.includes(file.name)) {
				results = results.concat(await getMarkdownFiles(res));
			}
		} else if (
			file.isFile() &&
			file.name.endsWith(".md") &&
			!file.name.includes("MOC") &&
			!file.name.includes("Template") &&
			!file.name.endsWith("README.md")
		) {
			const relative = path.relative(rootDir, res);
			// Only include files in subfolders, skip root level notes/meta-files
			if (relative.includes(path.sep)) {
				results.push(res);
			}
		}
	}
	return results;
}

function parseFrontmatter(content) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return null;
	const block = match[1];
	const lines = block.split(/\r?\n/);
	const yaml = {};
	// This is a hand-rolled parser, not YAML. Track the structures it cannot
	// represent so a silent wrong parse becomes a visible error instead.
	const issues = [];
	const seenKeys = new Set();
	for (const line of lines) {
		const colonIdx = line.indexOf(":");
		if (colonIdx > 0 && !/^\s/.test(line)) {
			const key = line.slice(0, colonIdx).trim();
			const val = line.slice(colonIdx + 1).trim();
			if (seenKeys.has(key)) {
				issues.push(
					`duplicate frontmatter key '${key}' (later value silently wins)`,
				);
			}
			seenKeys.add(key);
			if (/^[>|][+-]?\s*$/.test(val)) {
				issues.push(
					`block scalar '${key}: ${val}' is not parsed by this validator`,
				);
			}
			yaml[key] = val;
		}
	}
	// Robust parsing of tags if multiline or formatted
	const tagsMatch = block.match(/tags:\s*([\s\S]*?)(?=\r?\n\w+:|$)/);
	if (tagsMatch) {
		let tagsStr = tagsMatch[1].trim();
		// Clean up brackets, newlines, and list dash markers
		tagsStr = tagsStr
			.replace(/[[\]]/g, "")
			.replace(/^\s*-\s*/gm, "")
			.split(/[\s,\n\r]+/)
			.filter(Boolean)
			.join(", ");
		yaml.tags = tagsStr;
	}
	yaml.__issues = issues;
	return yaml;
}

// Scope where the atomic note standard is enforced. Notes outside it (inbox,
// projects, archives, flashcards) are working material, not permanent notes.
function isPermanentScope(relativePath) {
	return (
		relativePath.startsWith("30_Resources/") ||
		relativePath.startsWith("20_Areas/")
	);
}

// Daily logs are append-only timelines; nothing links to a given day, so the
// orphan check would only ever produce noise for them.
function isDailyLogPath(relativePath) {
	return relativePath.startsWith("20_Areas/Daily_Logs/");
}

const TLDR_LABELS = ["Bản chất", "Mục đích", "Điểm mấu chốt"];

function getTldrBody(content) {
	const lines = content.split(/\r?\n/);
	const start = lines.findIndex((l) => /^##\s+(?:[^\n#]*\s+)?TL;DR/.test(l));
	if (start < 0) return null;
	const rest = lines.slice(start + 1);
	const stop = rest.findIndex((l) => /^##\s+/.test(l));
	return stop >= 0 ? rest.slice(0, stop) : rest;
}

// --- Concision policy (AGENTS.md §4) ---
// Caps are calibrated against the vault distribution, not invented: median
// TL;DR block 362 chars, median prose paragraph 260 chars, median body 3.6k.
const TLDR_MAX_BULLET_CHARS = 200;
const TLDR_MAX_TOTAL_CHARS = 600;
const PROSE_MAX_CHARS = 300;
const BODY_MAX_CHARS = 5000;
// A checklist is a lookup table, a roadmap is a curriculum, an index is a
// directory: long is their correct shape, so only study notes are capped.
const BODY_CAPPED_TYPES = ["type/concept", "type/tech", "type/method"];
const STRUCTURAL_HEADINGS = ["TL;DR", "Related Notes"];
const PRACTICAL_HEADINGS =
	/^##\s+(?:[^\n#]*\s+)?(?:Practical\s+Implementation|Concrete\s+Examples|Practical\s+Examples|Code\s+Snippet)/i;
const DESCRIPTION_OVERLAP_MAX = 0.45;

// Split a note into its intro (frontmatter + H1 stripped) and H2 sections.
function splitNote(content) {
	const parts = content.split(/^##\s+(.+?)\s*$/m);
	const intro = (parts[0] || "").replace(/^---\n[\s\S]*?\n---\n?/, "");
	const sections = [];
	for (let i = 1; i < parts.length; i += 2) {
		sections.push({ title: (parts[i] || "").trim(), body: parts[i + 1] || "" });
	}
	return { intro, sections };
}

// Longest run of consecutive prose lines: no heading, list, table or fence.
function longestProseRun(text) {
	let run = 0;
	let worst = 0;
	let inCode = false;
	for (const line of text.split(/\r?\n/)) {
		if (/^\s*```/.test(line)) inCode = !inCode;
		const isProse =
			!inCode && line.trim() !== "" && !/^\s*(#|[-*+]|\d+\.|>|\||<)/.test(line);
		run = isProse ? run + line.trim().length : 0;
		if (run > worst) worst = run;
	}
	return worst;
}

function contentWords(text) {
	return new Set(
		(
			String(text)
				.toLowerCase()
				.match(/[\p{L}\p{N}]+/gu) || []
		).filter((w) => w.length >= 4),
	);
}

// Returns warnings (never errors): this policy ships as a transition, and its
// checks are promoted to errors once the flagged backlog is trimmed.
function collectConcisionWarnings(content, frontmatter, tags, relativePath) {
	const warnings = [];
	// A day log is raw working material: it takes no TL;DR shape, no paragraph
	// cap and no body cap. Same reason the orphan check skips this folder.
	if (/20_Areas\/Daily_Logs\//.test(relativePath || "")) return warnings;
	const { intro, sections } = splitNote(content);
	// Reference material is long by design: a curriculum, a lookup table, a
	// profile or a directory is not a study note and takes no body cap.
	const isReferenceMaterial =
		/(?:Roadmap|Index|MOC|Dashboard|Hub|Profile|Learning_Path|Knowledge_Checklist)\.md$/i.test(
			relativePath || "",
		) || /\/000_[^/]*\.md$/i.test(relativePath || "");
	const tldr = sections.find((s) => /TL;DR/i.test(s.title));

	if (tldr) {
		const bullets = tldr.body.split(/\r?\n/).filter((l) => /^-\s+/.test(l));
		const labels = bullets
			.map((l) => /^-\s+\*\*(.+?)\*\*/.exec(l))
			.filter(Boolean)
			.map((m) => m[1].trim());
		const ordered = labels.filter((l) =>
			TLDR_LABELS.some((tl) => l.startsWith(tl)),
		);
		if (
			ordered.length === TLDR_LABELS.length &&
			ordered.some((l, i) => !l.startsWith(TLDR_LABELS[i]))
		) {
			warnings.push(
				`TL;DR labels out of order (expected: ${TLDR_LABELS.join(" -> ")})`,
			);
		}
		const lens = bullets.map((b) => b.replace(/^-\s+/, "").trim().length);
		const longest = lens.length ? Math.max(...lens) : 0;
		const total = lens.reduce((a, b) => a + b, 0);
		if (longest > TLDR_MAX_BULLET_CHARS) {
			warnings.push(
				`TL;DR bullet of ${longest} chars (cap ${TLDR_MAX_BULLET_CHARS}): keep one line per label`,
			);
		}
		if (total > TLDR_MAX_TOTAL_CHARS) {
			warnings.push(
				`TL;DR block of ${total} chars (cap ${TLDR_MAX_TOTAL_CHARS}): it is a scan target, not a summary document`,
			);
		}
		const description = frontmatter ? frontmatter.description || "" : "";
		const essence = bullets.find((b) => /^-\s+\*\*Bản chất/.test(b));
		if (description && essence) {
			const essenceText = essence
				.replace(/^-\s+/, "")
				.replace(/^\*\*[^*]+\*\*\s*[:：]?\s*/, "")
				.trim();
			const a = contentWords(essenceText);
			const b = contentWords(description);
			const union = new Set([...a, ...b]);
			const shared = [...a].filter((w) => b.has(w)).length;
			const overlap = union.size ? shared / union.size : 0;
			if (overlap >= DESCRIPTION_OVERLAP_MAX) {
				warnings.push(
					`TL;DR 'Bản chất' restates the description (word overlap ${overlap.toFixed(2)}, cap ${DESCRIPTION_OVERLAP_MAX}): it must carry new information`,
				);
			}
		}
	}

	const topicSections = sections.filter(
		(s) => !STRUCTURAL_HEADINGS.includes(s.title),
	);
	if (sections.length > 0 && topicSections.length === 0) {
		warnings.push(
			"Note has no topic heading besides TL;DR/Related Notes: nothing answers the subject of the note",
		);
	}
	for (const s of topicSections) {
		const hasStructure = /^\s*(?:[-*+]\s|\d+\.\s|\||>)/m.test(s.body);
		const hasCode = codeBlockOrCommandRegex.test(s.body);
		if (!hasStructure && !hasCode) {
			warnings.push(
				`Section '${s.title}' holds no bullet, table row or code block: name it, then list its mechanics`,
			);
		}
		if (PRACTICAL_HEADINGS.test(`## ${s.title}`) && !hasCode) {
			warnings.push(
				`Section '${s.title}' promises implementation but contains no code block, command or output: rename it to what it really holds`,
			);
		}
	}

	const body = intro + topicSections.map((s) => s.body).join("\n");
	const prose = longestProseRun(body);
	if (prose > PROSE_MAX_CHARS) {
		warnings.push(
			`Prose paragraph of ${prose} chars (cap ${PROSE_MAX_CHARS}): split it into bullets, a table or code`,
		);
	}
	if (
		!isReferenceMaterial &&
		BODY_CAPPED_TYPES.some((t) => String(tags).includes(t))
	) {
		const len = body.trim().length;
		if (len > BODY_MAX_CHARS) {
			warnings.push(
				`Body of ${len} chars (cap ${BODY_MAX_CHARS} for this note type): check whether the note holds more than one idea`,
			);
		}
	}
	return warnings;
}

// Build the set of note names that at least one other note links to.
// Aliases resolve too, so renaming a note does not create false orphans.
async function collectInboundLinks() {
	const skipDirs = [".git", ".obsidian", ".agents", "node_modules", ".trash"];
	const files = [];
	async function walk(dir) {
		const list = await fs.readdir(dir, { withFileTypes: true });
		for (const entry of list) {
			const res = path.resolve(dir, entry.name);
			if (entry.isDirectory()) {
				if (!skipDirs.includes(entry.name)) await walk(res);
			} else if (entry.isFile() && entry.name.endsWith(".md")) {
				files.push(res);
			}
		}
	}
	await walk(rootDir);

	const names = new Set(files.map((f) => path.basename(f, ".md")));
	const contents = new Map();
	const aliasTo = new Map();
	for (const f of files) {
		const content = await fs.readFile(f, "utf8");
		contents.set(f, content);
		const fm = parseFrontmatter(content);
		if (!fm || !fm.aliases) continue;
		const aliasList = String(fm.aliases)
			.replace(/^\[|\]$/g, "")
			.split(",")
			.map((a) => a.trim().replace(/^["']|["']$/g, ""))
			.filter(Boolean);
		for (const alias of aliasList) aliasTo.set(alias, path.basename(f, ".md"));
	}

	const inbound = new Set();
	for (const [f, content] of contents) {
		const own = path.basename(f, ".md");
		for (const match of content.match(/\[\[[^\]]+\]\]/g) || []) {
			const target = match.slice(2, -2).split("|")[0].split("#")[0].trim();
			if (!target) continue;
			const base = target.split("/").pop();
			const resolved = names.has(base)
				? base
				: aliasTo.get(base) || aliasTo.get(target);
			if (resolved && resolved !== own) inbound.add(resolved);
		}
	}
	return inbound;
}

async function validateFile(filePath, inboundLinks) {
	const relativePath = path.relative(rootDir, filePath);
	try {
		const content = await fs.readFile(filePath, "utf8");
		const errors = [];
		const warnings = [];

		// 0. Empty file check
		if (content.trim() === "") {
			warnings.push("File is completely empty");
			return { path: relativePath, errors, warnings, isPlaceholder: true };
		}

		// 1. YAML frontmatter check
		const isDailyLog = relativePath.startsWith("20_Areas/Daily_Logs");
		const isResource = relativePath.startsWith("30_Resources/");
		const frontmatter = parseFrontmatter(content);

		if (!frontmatter) {
			if (isResource) {
				errors.push(
					"Missing or invalid YAML frontmatter (must start and end with '---') for resource note",
				);
				return { path: relativePath, errors, warnings, isPlaceholder: false };
			} else if (isDailyLog) {
				// Daily logs don't require frontmatter
			} else {
				// Outside resources and not a daily log, skip validation as it is not a standard atomic note
				return { path: relativePath, errors, warnings, isPlaceholder: false };
			}
		}

		// Check tags
		if (frontmatter) {
			if (!frontmatter.tags && isResource) {
				errors.push("Missing 'tags' in frontmatter");
			} else if (
				frontmatter.tags === "[]" ||
				(frontmatter.tags && frontmatter.tags.trim() === "")
			) {
				errors.push("'tags' is empty");
			}

			if (frontmatter.tags) {
				let rawTagsList = [];
				if (Array.isArray(frontmatter.tags)) {
					rawTagsList = frontmatter.tags;
				} else if (typeof frontmatter.tags === "string") {
					rawTagsList = frontmatter.tags
						.replace(/^\[|\]$/g, "")
						.split(",")
						.map((t) => t.trim())
						.filter(Boolean);
				}

				// Lean taxonomy invariant: Maximum 2 tags (1 type, 1 optional status)
				if (rawTagsList.length > 2) {
					errors.push(
						`Too many tags (${rawTagsList.length}). Maximum allowed is 2 tags (1 'type/*', 1 optional 'status/*') to prevent taxonomy bloat.`,
					);
				}

				const declared = await getDeclaredTags();
				for (const tagItem of rawTagsList) {
					const cleanTag = tagItem.toLowerCase();
					if (cleanTag && declared.size > 0 && !declared.has(cleanTag)) {
						errors.push(
							`Undeclared or disallowed tag '${tagItem}' in frontmatter. Please use only declared 'type/*' and 'status/*' tags from 99_Meta/Tag_Taxonomy_SSOT.md`,
						);
					}
				}
			}
		}

		if (
			frontmatter &&
			frontmatter.__issues &&
			frontmatter.__issues.length > 0
		) {
			for (const issue of frontmatter.__issues) {
				errors.push(
					`Frontmatter not representable by validator parser: ${issue}`,
				);
			}
		}

		if (isResource && frontmatter && !frontmatter.date) {
			errors.push("Missing 'date' in frontmatter (format YYYY-MM-DD)");
		}

		const tags = frontmatter ? frontmatter.tags || "" : "";
		const hasTypeTag = tags.includes("type/");

		if (!isResource && !isDailyLog && !hasTypeTag) {
			// Skip validation for files outside resources and daily logs that do not have a type tag
			return { path: relativePath, errors, warnings, isPlaceholder: false };
		}

		const isPlaceholder =
			tags.includes("status/todo") ||
			/^\s*[-*]\s*TODO\s*:/im.test(content) ||
			content.includes("Ghi chú chờ (Placeholder)");
		// TL;DR standard: exactly 3 bullets carrying the 3 required labels.
		if (!isPlaceholder && isPermanentScope(relativePath)) {
			const tldrBody = getTldrBody(content);
			if (tldrBody) {
				const bulletCount = tldrBody.filter((l) => /^-\s+/.test(l)).length;
				const joined = tldrBody.join("\n");
				const missingLabels = TLDR_LABELS.filter(
					(label) => !joined.includes(label),
				);
				if (bulletCount !== 3) {
					errors.push(
						`TL;DR must have exactly 3 bullets (found ${bulletCount})`,
					);
				}
				if (missingLabels.length > 0) {
					errors.push(`TL;DR missing label(s): ${missingLabels.join(", ")}`);
				}
			}
			// Concision policy: warnings during the transition, promoted to
			// errors once the flagged backlog is trimmed.
			warnings.push(
				...collectConcisionWarnings(content, frontmatter, tags, relativePath),
			);
		}

		// Orphan: nothing links here, so the note is unreachable while browsing.
		const baseName = path.basename(filePath, ".md");
		const isIndexNote = /(?:^000_|MOC|Index|Dashboard|README|Hub)/.test(
			baseName,
		);
		if (
			!isPlaceholder &&
			isPermanentScope(relativePath) &&
			!isDailyLogPath(relativePath) &&
			inboundLinks &&
			!isIndexNote &&
			!inboundLinks.has(baseName)
		) {
			warnings.push("Orphan note: no other note links to this file");
		}

		// 2. Heading 1 check
		const hasH1 = /^#\s+.+/m.test(content);
		if (!hasH1) {
			errors.push("Missing top-level heading (# Title)");
		}
		// Check for emojis/icons (No-Emoji policy). Code fences are exempt:
		// sample data and terminal output may legitimately contain pictographs.
		const contentWithoutCode = content.replace(/```[\s\S]*?```/g, "");
		const emojiRegex = /\p{Extended_Pictographic}/u;
		if (emojiRegex.test(contentWithoutCode)) {
			const message =
				"Note contains emojis or icons, violating the No-Emoji policy.";
			if (isPermanentScope(relativePath)) errors.push(message);
			else warnings.push(message);
		}

		// Check for raw template instruction markers
		if (content.includes("[BẮT BUỘC]") || content.includes("[TÙY CHỌN]")) {
			errors.push(
				"Note still contains raw template instruction markers ('[BẮT BUỘC]' or '[TÙY CHỌN]')",
			);
		}

		if (!isPlaceholder) {
			// Check for Daily Logs path
			if (relativePath.startsWith("20_Areas/Daily_Logs")) {
				const hasWhatNext = /^##\s+What next\??/im.test(content);
				if (!hasWhatNext) {
					errors.push("Daily Log is missing '## What next?' section");
				}
			} else {
				let hasSpecificValidator = false;
				const isRoadmap = /Roadmap\.md$/i.test(relativePath);
				if (isRoadmap) {
					// Roadmaps have their own dedicated standalone validator (validate_roadmaps.mjs)
					// Skip generic method/tech validation here as requested by user
					hasSpecificValidator = true;
				} else {
					for (const [tag, validateFn] of Object.entries(validatorsRegistry)) {
						if (tags.includes(tag)) {
							hasSpecificValidator = true;
							const res = validateFn(content, { tags, relativePath });
							if (res.errors) errors.push(...res.errors);
							if (res.warnings) warnings.push(...res.warnings);
						}
					}
				}

				if (!hasSpecificValidator) {
					// Fallback to standard generic checks if it has no type tag
					const hasTldr = /^##\s+TL;DR/m.test(content);
					if (!hasTldr) {
						errors.push("Missing '## TL;DR' section");
					}
				}

				// Standard check for secondary headings in general
				const hasH2 = /^##\s+.+/m.test(content);
				if (!hasH2) {
					warnings.push("No secondary headings (##) found");
				}
			}
		} else {
			// For placeholders
			if (
				!content.includes("TODO") &&
				!content.includes("placeholder") &&
				!content.includes("Placeholder")
			) {
				warnings.push(
					"Note has placeholder status but no TODO tag or explanation in content",
				);
			}
		}

		return { path: relativePath, errors, warnings, isPlaceholder };
	} catch (err) {
		return {
			path: relativePath,
			errors: [`Error reading file: ${err.message}`],
			warnings: [],
			isPlaceholder: false,
		};
	}
}

async function main() {
	const args = process.argv.slice(2);
	const isJsonMode = args.includes("--json");
	const isVerbose = args.includes("--verbose") || args.includes("-v");
	const fileArgs = args.filter(
		(arg) => arg !== "--json" && arg !== "--verbose" && arg !== "-v",
	);

	if (!isJsonMode) {
		console.log(
			`${colors.cyan}=== Obsidian Atomic Note Validator ===${colors.reset}`,
		);
	}

	let allFiles = [];

	if (fileArgs.length > 0) {
		for (const arg of fileArgs) {
			allFiles.push(path.resolve(rootDir, arg));
		}
	} else {
		try {
			allFiles = await getMarkdownFiles(rootDir);
		} catch (e) {
			if (!isJsonMode) {
				console.error(
					`${colors.red}Error scanning directory: ${e.message}${colors.reset}`,
				);
			}
		}
	}

	const inboundLinks = await collectInboundLinks();
	let failedCount = 0;
	let passedCount = 0;
	let placeholderCount = 0;
	const jsonResults = [];

	for (const file of allFiles) {
		const result = await validateFile(file, inboundLinks);
		const passed = result.errors.length === 0;

		if (isJsonMode) {
			jsonResults.push({
				path: result.path,
				passed,
				errors: result.errors,
				warnings: result.warnings,
				isPlaceholder: result.isPlaceholder,
			});
		}

		if (result.errors.length > 0) {
			failedCount++;
			if (!isJsonMode) {
				console.log(`${colors.red}✗ FAILED: ${result.path}${colors.reset}`);
				for (const err of result.errors) {
					console.log(`  - ERROR: ${err}`);
				}
				for (const warn of result.warnings) {
					console.log(`  - WARNING: ${warn}`);
				}
			}
		} else {
			passedCount++;
			if (result.isPlaceholder) {
				placeholderCount++;
				if (!isJsonMode && isVerbose) {
					console.log(
						`${colors.yellow}⚠ PASSED (Placeholder): ${result.path}${colors.reset}`,
					);
				}
			} else {
				if (!isJsonMode && isVerbose) {
					console.log(`${colors.green}✓ PASSED: ${result.path}${colors.reset}`);
				}
			}
			if (!isJsonMode && isVerbose && result.warnings.length > 0) {
				for (const warn of result.warnings) {
					console.log(`    - WARNING: ${warn}`);
				}
			}
		}
	}

	if (isJsonMode) {
		const jsonOutput = {
			summary: {
				total: allFiles.length,
				passed: passedCount,
				failed: failedCount,
				placeholders: placeholderCount,
			},
			results: jsonResults,
		};
		console.log(JSON.stringify(jsonOutput, null, 2));
	} else {
		if (failedCount === 0) {
			console.log(
				`${colors.green}✓ ALL PASSED: ${allFiles.length} notes scanned cleanly (0 errors, ${placeholderCount} placeholders).${colors.reset}`,
			);
		} else {
			console.log("\n=== Summary ===");
			console.log(`Total scanned: ${allFiles.length}`);
			console.log(
				`Passed:        ${colors.green}${passedCount}${colors.reset} (including ${placeholderCount} placeholders)`,
			);
			console.log(`Failed:        ${colors.red}${failedCount}${colors.reset}`);
		}
	}

	if (failedCount > 0) {
		process.exit(1);
	} else {
		process.exit(0);
	}
}

main().catch((err) => {
	console.error("Validator crashed:", err);
	process.exit(1);
});
