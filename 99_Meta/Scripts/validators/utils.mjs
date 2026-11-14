export const relatedNotesRegex =
	/^##\s+(?:[^\n\r#]*\s+)?(?:Related\s+Notes|Connections|Liên\s*kết\s*liên\s*quan)|^\*\*Related\s+Notes:\*\*/im;

// "This section holds something executable": a fenced block, a shell prompt
// line, or a tool invocation that carries a flag, a path or a source file.
// The tool must appear at the start of a line and be followed by an argument
// shape, so prose ("go to the docs", "make sure") and markdown headings
// (`# Load balancer`) do not count as commands.
const TOOL =
	"bun|npm|npx|pnpm|yarn|go|docker|kubectl|helm|git|curl|psql|redis-cli|make|node|deno|python3?|pip|systemctl|tmux|k6|wrk|hyperfine|ffmpeg";

export const codeBlockOrCommandRegex = new RegExp(
	"```" +
		"|^\\s*\\$\\s+\\S" +
		`|^\\s*(?:${TOOL})\\b.*(?:--?\\w|/\\S|\\.(?:go|ts|tsx|js|mjs|py|sh|sql|json|ya?ml|toml|md)\\b)`,
	"m",
);
