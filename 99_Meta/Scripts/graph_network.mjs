#!/usr/bin/env bun
import fs from "node:fs";
import path from "node:path";

const colors = {
	reset: "\x1b[0m",
	bold: "\x1b[1m",
	dim: "\x1b[2m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
};

const rootDir = process.cwd();

// Directories to index for the core knowledge graph
const targetScanDirs = ["30_Resources", "20_Areas", "10_Projects", "99_Meta"];

const ignoredFolderNames = new Set([
	".git",
	".obsidian",
	".agents",
	"node_modules",
	"50_Flashcards", // Flashcards are atomic retrieval items, excluded from note graph
	"40_Archives", // Archived notes excluded from active knowledge graph
	"Templates", // Template boilerplates contain intentional dummy link examples
]);

// 1. Domain Taxonomy Definition
const DOMAINS = {
	LANGUAGE: "Linguistics & Language",
	ENGINEERING: "Software Engineering & Tech",
	FINANCE: "Finance & Economics",
	PSYCHOLOGY: "Psychology & Mental Models",
	LIFE: "Health, Dermatology & Life",
	META_HUB: "Meta Hub / Index (Universal Bridge)",
};

function classifyDomain(relPath, tags = []) {
	const lowerPath = relPath.toLowerCase();

	// Universal Bridges / MOCs / System Specs
	if (
		lowerPath.includes("000_") ||
		lowerPath.includes("index") ||
		lowerPath.includes("dashboard") ||
		lowerPath.includes("system_structure") ||
		lowerPath.includes("master_roadmaps_index") ||
		tags.some((t) => t.includes("type/moc") || t.includes("meta/"))
	) {
		return DOMAINS.META_HUB;
	}

	// Universal Metacognition, PKM & Career Bridges (Accessible from all domains)
	if (
		lowerPath.includes("master_backend_engineering_ssot") ||
		lowerPath.includes("first_principles_thinking") ||
		lowerPath.includes("herbert_simon_learning_method") ||
		lowerPath.includes("socratic_questioning_method") ||
		lowerPath.includes("spaced_repetition") ||
		lowerPath.includes("m_shaped_polymath") ||
		lowerPath.includes("zettelkasten") ||
		lowerPath.includes("para_method") ||
		lowerPath.includes("map_of_content") ||
		lowerPath.includes("visual_workflow_documentation_policy") ||
		lowerPath.includes("star_method")
	) {
		return DOMAINS.META_HUB;
	}

	// Domain: Language
	if (
		lowerPath.includes("learning_and_linguistics") ||
		lowerPath.includes("english") ||
		lowerPath.includes("toeic") ||
		lowerPath.includes("ielts") ||
		lowerPath.includes("presentation_delivery") ||
		tags.some(
			(t) =>
				t.includes("topic/english") ||
				t.includes("topic/linguistics") ||
				t.includes("topic/grammar") ||
				t.includes("topic/toeic"),
		)
	) {
		return DOMAINS.LANGUAGE;
	}

	// Domain: Finance
	if (
		lowerPath.includes("finance") ||
		lowerPath.includes("economics") ||
		tags.some(
			(t) => t.includes("topic/finance") || t.includes("topic/economics"),
		)
	) {
		return DOMAINS.FINANCE;
	}

	// Domain: Life
	if (
		lowerPath.includes("life/") ||
		lowerPath.includes("health") ||
		lowerPath.includes("sleep") ||
		lowerPath.includes("dermatology")
	) {
		return DOMAINS.LIFE;
	}

	// Domain: Psychology & Mental Models
	if (
		lowerPath.includes("psychology") ||
		lowerPath.includes("mental_models") ||
		lowerPath.includes("negotiation") ||
		lowerPath.includes("product_and_business_mindsets") ||
		tags.some(
			(t) =>
				t.includes("topic/psychology") ||
				t.includes("topic/mental-models") ||
				t.includes("topic/negotiation"),
		)
	) {
		return DOMAINS.PSYCHOLOGY;
	}

	// Default for 30_Resources/Tech, Methods/Engineering, Concepts/Computer_Science, Software_Testing, Projects
	return DOMAINS.ENGINEERING;
}

// Check if a target string refers to a media/asset file on disk
function resolveAssetPath(targetRaw) {
	const isAsset = /\.(svg|png|jpe?g|gif|webp|pdf|dbml)$/i.test(targetRaw);
	if (!isAsset) return null;

	const candidatePaths = [
		path.resolve(rootDir, targetRaw),
		path.resolve(rootDir, "30_Resources/Excalidraw", path.basename(targetRaw)),
		path.resolve(
			rootDir,
			"10_Projects/Ticket_Booking_Backend/Database",
			path.basename(targetRaw),
		),
	];

	for (const cp of candidatePaths) {
		if (fs.existsSync(cp)) return cp;
	}
	return "MISSING_ASSET";
}

// 2. Note and Graph Collector
function collectNotes() {
	const notes = new Map(); // nameLower -> Note
	const allFiles = [];

	function scan(dir) {
		if (!fs.existsSync(dir)) return;
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				if (!ignoredFolderNames.has(entry.name)) {
					scan(fullPath);
				}
			} else if (entry.isFile() && entry.name.endsWith(".md")) {
				allFiles.push(fullPath);
			}
		}
	}

	for (const d of targetScanDirs) {
		scan(path.join(rootDir, d));
	}

	const rootEntries = fs.readdirSync(rootDir, { withFileTypes: true });
	for (const re of rootEntries) {
		if (re.isFile() && re.name.endsWith(".md")) {
			allFiles.push(path.join(rootDir, re.name));
		}
	}

	for (const fp of allFiles) {
		const relPath = path.relative(rootDir, fp);
		const filename = path.basename(fp);
		const stem = filename.replace(/\.md$/, "");
		const content = fs.readFileSync(fp, "utf-8");

		// Extract tags from frontmatter
		const tags = [];
		const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
		if (fmMatch) {
			const tagLineMatch = fmMatch[1].match(/tags:\s*\[?(.*?)\]?(\r?\n|$)/);
			if (tagLineMatch) {
				const rawTags = tagLineMatch[1].split(/[, ]+/).filter(Boolean);
				for (const t of rawTags) {
					tags.push(
						t
							.replace(/[[\]'"]/g, "")
							.trim()
							.toLowerCase(),
					);
				}
			}
		}

		// Extract wikilinks and note whether they are planned checklist stubs: - [ ] [[Target]]
		const lines = content.split("\n");
		const outboundRaw = [];
		const plannedStubs = new Set();

		for (const line of lines) {
			const isChecklistStub = /^\s*[-*]\s*\[\s*\]\s*/.test(line);
			const matches = line.matchAll(/\[\[([^[\]\n\r]+)\]\]/g);
			for (const m of matches) {
				let targetName = m[1].trim();
				targetName = targetName.replace(/\\\|/g, "|").split("|")[0].trim();
				targetName = targetName.split("#")[0].trim();
				if (targetName) {
					outboundRaw.push(targetName);
					if (isChecklistStub) {
						const stemTarget = path
							.basename(targetName)
							.replace(/\.md$/, "")
							.trim()
							.toLowerCase();
						plannedStubs.add(stemTarget);
					}
				}
			}
		}

		const domain = classifyDomain(relPath, tags);

		notes.set(stem.toLowerCase(), {
			name: stem,
			filename,
			relPath,
			fullPath: fp,
			tags,
			domain,
			outboundRaw,
			plannedStubs,
			outbound: new Set(),
			inbound: new Set(),
			assets: new Set(),
		});
	}

	// Resolve link targets to build graph edges
	for (const note of notes.values()) {
		for (const targetRaw of note.outboundRaw) {
			const assetResolution = resolveAssetPath(targetRaw);
			if (assetResolution) {
				if (assetResolution !== "MISSING_ASSET") {
					note.assets.add(targetRaw);
				}
				continue;
			}

			const targetStem = path.basename(targetRaw).replace(/\.md$/, "").trim();
			const targetLower = targetStem.toLowerCase();

			if (notes.has(targetLower)) {
				const targetNote = notes.get(targetLower);
				note.outbound.add(targetNote.name);
				targetNote.inbound.add(note.name);
			}
		}
	}

	return notes;
}

// 3. Validation Engine
function validateGraph(notes, isStrict = false) {
	const errors = [];
	const warnings = [];

	for (const note of notes.values()) {
		// A. Broken Link & Missing Asset Check
		for (const targetRaw of note.outboundRaw) {
			const assetResolution = resolveAssetPath(targetRaw);
			if (assetResolution === "MISSING_ASSET") {
				errors.push({
					file: note.relPath,
					type: "MISSING_ASSET",
					message: `Broken asset link: '${targetRaw}' file not found on disk.`,
				});
				continue;
			}
			if (assetResolution) continue;

			const targetStem = path.basename(targetRaw).replace(/\.md$/, "").trim();
			const targetLower = targetStem.toLowerCase();

			// Ignore documentation example placeholders
			if (targetStem === "Note_Title" && note.filename === "AGENTS.md") {
				continue;
			}

			if (!notes.has(targetLower)) {
				// Check 1: Is it in 00_Inbox?
				const existsInInbox = fs.existsSync(
					path.join(rootDir, "00_Inbox", `${targetStem}.md`),
				);
				if (existsInInbox) {
					warnings.push({
						file: note.relPath,
						type: "INBOX_TARGET",
						message: `Links to temporary inbox note '[[${targetStem}]]'. Migrate target to 30_Resources.`,
					});
					continue;
				}

				// Check 2: Is it an uncreated planned stub in a syllabus checklist (- [ ] [[...]])?
				if (note.plannedStubs.has(targetLower)) {
					warnings.push({
						file: note.relPath,
						type: "PLANNED_STUB",
						message: `Planned roadmap stub: '[[${targetStem}]]' is in an uncompleted checklist (- [ ]). Will be created in future sprints.`,
					});
					continue;
				}

				// Check 3: Is it inside 10_Projects/ (WIP project development)?
				if (note.relPath.startsWith("10_Projects/")) {
					warnings.push({
						file: note.relPath,
						type: "PROJECT_WIP_LINK",
						message: `Project WIP link: '[[${targetStem}]]' not yet materialized in active project folder.`,
					});
					continue;
				}

				// Check 4: Uncreated future note in core knowledge base
				if (isStrict) {
					errors.push({
						file: note.relPath,
						type: "BROKEN_LINK",
						message: `Broken wikilink: '[[${targetRaw}]]' (stem: '${targetStem}') does not exist in knowledge graph.`,
					});
				} else {
					warnings.push({
						file: note.relPath,
						type: "UNCREATED_NOTE",
						message: `Wikilink '[[${targetRaw}]]' target note does not exist yet. Consider authoring or updating reference.`,
					});
				}
			}
		}

		// B. Self-link Check
		if (note.outbound.has(note.name)) {
			warnings.push({
				file: note.relPath,
				type: "SELF_LINK",
				message: `Note contains circular self-link: '[[${note.name}]]'.`,
			});
		}

		// C. Semantic Domain Contamination (Bẫy Link Sai Vùng Kiến Thức - CRITICAL FAILURE)
		if (note.domain !== DOMAINS.META_HUB) {
			for (const targetName of note.outbound) {
				const targetNote = notes.get(targetName.toLowerCase());
				if (!targetNote) continue;

				if (targetNote.domain === DOMAINS.META_HUB) {
					// Allowed: Any note can link to a universal MOC, SSOT bridge, or PKM method
					continue;
				}

				// Check incompatible cross-domain links
				const incompatible =
					(note.domain === DOMAINS.LANGUAGE &&
						targetNote.domain === DOMAINS.ENGINEERING) ||
					(note.domain === DOMAINS.LANGUAGE &&
						targetNote.domain === DOMAINS.FINANCE) ||
					(note.domain === DOMAINS.LIFE &&
						targetNote.domain === DOMAINS.ENGINEERING) ||
					(note.domain === DOMAINS.FINANCE &&
						targetNote.domain === DOMAINS.LIFE) ||
					(note.domain === DOMAINS.LIFE &&
						targetNote.domain === DOMAINS.FINANCE);

				if (incompatible) {
					errors.push({
						file: note.relPath,
						type: "DOMAIN_CONTAMINATION",
						message: `Cross-domain contamination: Note in [${note.domain}] directly links to isolated note '[[${targetNote.name}]]' in [${targetNote.domain}]. Bridge through MOC or SSOT instead.`,
					});
				}
			}
		}

		// D. Orphan Check (No inbound AND no outbound)
		const isMetaFile =
			note.filename === "README.md" ||
			note.filename === "AGENTS.md" ||
			note.relPath.startsWith("20_Areas/Daily_Logs") ||
			note.relPath.startsWith("99_Meta/");

		if (!isMetaFile && note.inbound.size === 0 && note.outbound.size === 0) {
			warnings.push({
				file: note.relPath,
				type: "ORPHAN_NODE",
				message: `Orphan note: 0 inbound and 0 outbound links. Connect to related notes or domain MOC.`,
			});
		}
	}

	return { errors, warnings };
}

// 4. CLI Rendering & Formatting
function showNoteNetwork(notes, queryName) {
	const queryLower = queryName.toLowerCase().replace(/\.md$/, "");
	let target = notes.get(queryLower);

	if (!target) {
		for (const [k, n] of notes.entries()) {
			if (k.includes(queryLower) || n.name.toLowerCase().includes(queryLower)) {
				target = n;
				break;
			}
		}
	}

	if (!target) {
		console.error(
			`${colors.red}Error: Note '${queryName}' not found in knowledge graph.${colors.reset}`,
		);
		process.exit(1);
	}

	console.log(
		`\n${colors.cyan}${colors.bold}=== NOTE NETWORK: ${target.name} ===${colors.reset}`,
	);
	console.log(`${colors.dim}Path  : ${target.relPath}`);
	console.log(`Domain: ${target.domain}${colors.reset}\n`);

	// Inbound
	const inArr = Array.from(target.inbound);
	console.log(
		`${colors.bold}◄── Inbound Links (Backlinks) [${inArr.length}]:${colors.reset}`,
	);
	if (inArr.length === 0) {
		console.log(
			`    ${colors.dim}(None - No other note links to this note)${colors.reset}`,
		);
	} else {
		for (let i = 0; i < inArr.length; i++) {
			const isLast = i === inArr.length - 1;
			const prefix = isLast ? "└──" : "├──";
			const srcNote = notes.get(inArr[i].toLowerCase());
			const domainLabel = srcNote ? `[${srcNote.domain}]` : "";
			console.log(
				`    ${prefix} ${colors.green}[[${inArr[i]}]]${colors.reset} ${colors.dim}${domainLabel}${colors.reset}`,
			);
		}
	}

	console.log("");

	// Outbound
	const outArr = Array.from(target.outbound);
	console.log(
		`${colors.bold}──► Outbound Links (Forward Links) [${outArr.length}]:${colors.reset}`,
	);
	if (outArr.length === 0) {
		console.log(
			`    ${colors.dim}(None - This note has no outbound links)${colors.reset}`,
		);
	} else {
		for (let i = 0; i < outArr.length; i++) {
			const isLast = i === outArr.length - 1;
			const prefix = isLast ? "└──" : "├──";
			const destNote = notes.get(outArr[i].toLowerCase());
			const domainLabel = destNote ? `[${destNote.domain}]` : "";
			console.log(
				`    ${prefix} ${colors.blue}[[${outArr[i]}]]${colors.reset} ${colors.dim}${domainLabel}${colors.reset}`,
			);
		}
	}

	// Assets
	if (target.assets.size > 0) {
		console.log(
			`\n${colors.bold}🖼 Media & Architecture Diagrams [${target.assets.size}]:${colors.reset}`,
		);
		for (const a of target.assets) {
			console.log(`    • ${colors.magenta}${a}${colors.reset}`);
		}
	}

	// Shared 2nd-degree neighbors
	const secondDegree = new Set();
	for (const outName of target.outbound) {
		const outNote = notes.get(outName.toLowerCase());
		if (outNote) {
			for (const secondOut of outNote.outbound) {
				if (secondOut !== target.name && !target.outbound.has(secondOut)) {
					secondDegree.add(secondOut);
				}
			}
		}
	}

	console.log(
		`\n${colors.bold}◈ 2nd-Degree Contextual Cluster [${secondDegree.size}]:${colors.reset}`,
	);
	const secondArr = Array.from(secondDegree).slice(0, 8);
	for (const s of secondArr) {
		console.log(`    • ${colors.dim}[[${s}]]${colors.reset}`);
	}
	if (secondDegree.size > 8) {
		console.log(`    ... and ${secondDegree.size - 8} more neighbors.`);
	}
}

function showGraphStats(notes) {
	const totalNodes = notes.size;
	let totalEdges = 0;
	let orphanCount = 0;
	let deadEndCount = 0;

	const domainCounts = {};
	const degreeList = [];

	for (const n of notes.values()) {
		totalEdges += n.outbound.size;
		domainCounts[n.domain] = (domainCounts[n.domain] || 0) + 1;

		const totalDegree = n.inbound.size + n.outbound.size;
		degreeList.push({
			name: n.name,
			in: n.inbound.size,
			out: n.outbound.size,
			total: totalDegree,
		});

		const isMetaFile =
			n.filename === "README.md" ||
			n.filename === "AGENTS.md" ||
			n.relPath.startsWith("20_Areas/Daily_Logs") ||
			n.relPath.startsWith("99_Meta/");

		if (!isMetaFile && n.inbound.size === 0 && n.outbound.size === 0)
			orphanCount++;
		if (n.outbound.size === 0) deadEndCount++;
	}

	const possibleEdges = totalNodes * (totalNodes - 1);
	const density = possibleEdges > 0 ? (totalEdges / possibleEdges) * 100 : 0;

	degreeList.sort((a, b) => b.total - a.total);

	console.log(
		`\n${colors.cyan}${colors.bold}=== OBSIDIAN SECOND BRAIN: GRAPH NETWORK STATS ===${colors.reset}\n`,
	);
	console.log(
		`Total Notes (Nodes)     : ${colors.bold}${totalNodes}${colors.reset}`,
	);
	console.log(
		`Total Links (Edges)     : ${colors.bold}${totalEdges}${colors.reset}`,
	);
	console.log(
		`Graph Density           : ${colors.bold}${density.toFixed(3)}%${colors.reset}`,
	);
	console.log(
		`Orphan Notes (0 in/out) : ${orphanCount === 0 ? colors.green : colors.yellow}${orphanCount}${colors.reset}`,
	);
	console.log(`Dead-End Notes (0 out)  : ${deadEndCount}${colors.reset}\n`);

	console.log(`${colors.bold}Distribution by Domain:${colors.reset}`);
	for (const [dom, count] of Object.entries(domainCounts)) {
		console.log(`  • ${dom.padEnd(35)}: ${count} notes`);
	}

	console.log(
		`\n${colors.bold}Top 10 Most Connected Hub Notes:${colors.reset}`,
	);
	for (let i = 0; i < Math.min(10, degreeList.length); i++) {
		const item = degreeList[i];
		console.log(
			`  ${(i + 1).toString().padStart(2)}. ${colors.bold}${item.name.padEnd(45)}${colors.reset} (In: ${item.in.toString().padStart(2)}, Out: ${item.out.toString().padStart(2)}, Total: ${item.total.toString().padStart(2)})`,
		);
	}
}

function exportMermaid(notes, queryName) {
	const queryLower = queryName
		? queryName.toLowerCase().replace(/\.md$/, "")
		: "";
	let subset = [];

	if (queryLower) {
		const target = notes.get(queryLower);
		if (!target) {
			console.error(`Note '${queryName}' not found.`);
			process.exit(1);
		}
		const nodeSet = new Set([
			target.name,
			...target.inbound,
			...target.outbound,
		]);
		subset = Array.from(nodeSet)
			.map((n) => notes.get(n.toLowerCase()))
			.filter(Boolean);
	} else {
		subset = Array.from(notes.values());
	}

	console.log("```mermaid");
	console.log("graph LR");
	for (const node of subset) {
		for (const target of node.outbound) {
			if (!queryLower || subset.some((s) => s.name === target)) {
				console.log(
					`  ${node.name}["${node.name}"] --> ${target}["${target}"]`,
				);
			}
		}
	}
	console.log("```");
}

// 5. Main CLI Router
const args = process.argv.slice(2);
const command = args[0] || "validate";
const isStrict = args.includes("--strict");

const notes = collectNotes();

if (command === "validate") {
	console.log(
		`${colors.cyan}${colors.bold}Auditing Knowledge Graph Network across ${notes.size} notes (Strict: ${isStrict})...${colors.reset}\n`,
	);
	const { errors, warnings } = validateGraph(notes, isStrict);

	for (const w of warnings) {
		console.warn(
			`${colors.yellow}WARN:${colors.reset} [${w.file}] (${w.type}) ${w.message}`,
		);
	}
	for (const e of errors) {
		console.error(
			`${colors.red}FAIL:${colors.reset} [${e.file}] (${e.type}) ${e.message}`,
		);
	}

	console.log("\n" + "─".repeat(60));
	console.log(`Audited: ${notes.size} note nodes`);
	console.log(`Warnings: ${warnings.length}`);
	console.log(`Failures: ${errors.length}`);

	if (errors.length > 0) {
		console.error(
			`\n${colors.red}${colors.bold}Graph network validation failed with ${errors.length} error(s).${colors.reset}`,
		);
		process.exit(1);
	} else {
		console.log(
			`\n${colors.green}${colors.bold}✓ All knowledge graph network checks passed cleanly!${colors.reset}`,
		);
		process.exit(0);
	}
} else if (command === "show" || command === "inspect") {
	const query = args[1];
	if (!query) {
		console.error(
			"Usage: bun 99_Meta/Scripts/graph_network.mjs show <Note_Title>",
		);
		process.exit(1);
	}
	showNoteNetwork(notes, query);
} else if (command === "stats") {
	showGraphStats(notes);
} else if (command === "mermaid") {
	exportMermaid(notes, args[1]);
} else {
	console.log(
		`Unknown command '${command}'. Available commands: validate [--strict], show <Note>, stats, mermaid <Note>`,
	);
	process.exit(1);
}
