#!/usr/bin/env bun
import fs from "node:fs/promises";
import path from "node:path";

const vaultRoot = process.cwd();
const targetDest = process.argv[2]
	? path.resolve(process.argv[2])
	: path.resolve(
			vaultRoot,
			"../../20-projects/ngxccc.github.io/src/content/notes",
		);
const publicDataDest = process.argv[3]
	? path.resolve(process.argv[3])
	: path.resolve(vaultRoot, "../../20-projects/ngxccc.github.io/public/data");

console.log(`=== Exporting Public Notes from Second Brain ===`);
console.log(`Source Vault: ${vaultRoot}`);
console.log(`Target Content Dir: ${targetDest}`);
console.log(`Target Public Data Dir: ${publicDataDest}`);

// 1. Chỉ xuất 30_Resources (Loại trừ toàn bộ 20_Areas/Finances, Health, Daily_Logs, 10_Projects)
const allowedSourceDirs = [
	path.join(vaultRoot, "30_Resources/Concepts"),
	path.join(vaultRoot, "30_Resources/Methods"),
	path.join(vaultRoot, "30_Resources/Tech"),
];

async function getMarkdownFiles(dir) {
	let results = [];
	try {
		const entries = await fs.readdir(dir, { withFileTypes: true });
		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				results = results.concat(await getMarkdownFiles(fullPath));
			} else if (entry.isFile() && entry.name.endsWith(".md")) {
				results.push(fullPath);
			}
		}
	} catch {
		// Ignore if directory does not exist
	}
	return results;
}

function parseFrontmatterAndBody(fileContent) {
	if (!fileContent.startsWith("---")) {
		return { meta: {}, body: fileContent };
	}

	const endIdx = fileContent.indexOf("\n---", 3);
	if (endIdx === -1) {
		return { meta: {}, body: fileContent };
	}

	const rawYaml = fileContent.slice(3, endIdx).trim();
	const body = fileContent.slice(endIdx + 4).trimStart();
	const meta = {};

	for (const line of rawYaml.split("\n")) {
		const colonIdx = line.indexOf(":");
		if (colonIdx === -1) continue;
		const key = line.slice(0, colonIdx).trim();
		const val = line.slice(colonIdx + 1).trim();

		if (val.startsWith("[") && val.endsWith("]")) {
			meta[key] = val
				.slice(1, -1)
				.split(",")
				.map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
				.filter(Boolean);
		} else {
			meta[key] = val.replace(/^['"]|['"]$/g, "");
		}
	}

	return { meta, body };
}

await fs.mkdir(targetDest, { recursive: true });
await fs.mkdir(publicDataDest, { recursive: true });

// Clean previous notes
try {
	const existing = await fs.readdir(targetDest);
	for (const file of existing) {
		if (file.endsWith(".md") || file.endsWith(".mdx")) {
			await fs.unlink(path.join(targetDest, file));
		}
	}
} catch {
	// targetDest might not exist yet
}

const allFiles = [];
for (const dir of allowedSourceDirs) {
	const files = await getMarkdownFiles(dir);
	allFiles.push(...files);
}

console.log(`Found ${allFiles.length} candidate notes in 30_Resources.`);

let exportedCount = 0;
const graphNodes = [];
const graphLinks = [];
const nodeMap = new Map();

for (const filePath of allFiles) {
	const raw = await fs.readFile(filePath, "utf8");
	const { meta, body } = parseFrontmatterAndBody(raw);

	const baseName = path.basename(filePath, ".md");
	const relPath = path.relative(vaultRoot, filePath);

	// Phân loại domain cơ bản
	let domain = "Engineering";
	if (relPath.includes("Psychology") || relPath.includes("Mental_Models")) {
		domain = "Mental Models";
	} else if (relPath.includes("Learning") || relPath.includes("Linguistics")) {
		domain = "Linguistics & Learning";
	} else if (relPath.includes("Finance") || relPath.includes("Economics")) {
		domain = "Economics";
	}

	const titleMatch = raw.match(/^#\s+(.+)$/m);
	const title = titleMatch ? titleMatch[1].trim() : baseName.replace(/_/g, " ");

	// Bóc tách wikilinks
	const wikilinkMatches = [...raw.matchAll(/\[\[(.*?)\]\]/g)];
	const links = [];
	for (const match of wikilinkMatches) {
		const rawTarget = match[1].split("|")[0].split("#")[0].trim();
		if (rawTarget && rawTarget !== baseName) {
			links.push(rawTarget);
		}
	}

	nodeMap.set(baseName, {
		id: baseName,
		title,
		domain,
		path: relPath,
		links,
	});

	// Chuẩn hóa content: Đảm bảo có frontmatter hợp lệ cho Astro
	const tagsArr = Array.isArray(meta.tags) ? meta.tags : [];
	const tagsYaml =
		tagsArr.length > 0 ? `[${tagsArr.map((t) => `"${t}"`).join(", ")}]` : "[]";
	const aliasesArr = Array.isArray(meta.aliases) ? meta.aliases : [];
	const aliasesYaml =
		aliasesArr.length > 0
			? `[${aliasesArr.map((a) => `"${a}"`).join(", ")}]`
			: "[]";
	const description = (meta.description || "").replace(/"/g, '\\"');
	const date = meta.date ? String(meta.date).slice(0, 10) : "2026-10-01";

	const newYaml = [
		"---",
		`title: "${title.replace(/"/g, '\\"')}"`,
		`description: "${description}"`,
		`date: "${date}"`,
		`tags: ${tagsYaml}`,
		`aliases: ${aliasesYaml}`,
		`domain: "${domain}"`,
		`sourcePath: "${relPath}"`,
		"---",
		"",
	].join("\n");

	// Thay dataviewjs bằng javascript để Shiki parse đúng chuẩn
	const sanitizedBody = body.replace(/```dataviewjs/g, "```javascript");

	const exportFileContent = newYaml + sanitizedBody;
	const destPath = path.join(targetDest, `${baseName}.md`);
	await fs.writeFile(destPath, exportFileContent, "utf8");
	exportedCount++;
}

// Xây dựng danh sách graph nodes và links
for (const [id, node] of nodeMap.entries()) {
	graphNodes.push({
		id: node.id,
		title: node.title,
		domain: node.domain,
		url: `/notes/${node.id}`,
	});

	for (const targetId of node.links) {
		if (nodeMap.has(targetId)) {
			graphLinks.push({
				source: id,
				target: targetId,
			});
		}
	}
}

const graphPayload = {
	nodes: graphNodes,
	links: graphLinks,
};

await fs.writeFile(
	path.join(publicDataDest, "notes_graph.json"),
	JSON.stringify(graphPayload, null, 2),
	"utf8",
);

console.log(`✓ Exported ${exportedCount} notes to ${targetDest}`);
console.log(
	`✓ Exported graph data (${graphNodes.length} nodes, ${graphLinks.length} links) to notes_graph.json`,
);
