---
created_at: Wednesday, April 8th 2026, 3:31:31 pm +07:00
updated_at: Wednesday, April 8th 2026, 3:32:55 pm +07:00
---
# 🚀 PROJECT SPECIFICATION: llm-wiki (Rust Version)

## 1. Project Overview

Build a high-performance, local-first Personal Knowledge Management (PKM) system. This is an Event-Driven RAG architecture implementing the Model Context Protocol (MCP) server in Rust.
The system watches a local directory of Markdown files, embeds them into a Vector Database (Qdrant), and exposes search capabilities to IDEs (Cursor/Copilot) via MCP over stdio.

## 2. Tech Stack & Targets

- **Language:** Rust (Edition 2026 1.94.1)
- **Toolchain:** Manage strictly via `rustup` (ensure compatibility with stable channel).
- **Async Runtime:** `tokio` (full features)
- **VectorDB:** `qdrant-client` (Rust gRPC client)
- **File Watcher:** `notify` crate (debounced events)
- **Serialization:** `serde`, `serde_json`
- **Protocol:** JSON-RPC 2.0 over `stdio` (for MCP)
- **HTTP/API Client:** `reqwest` (Must support dynamic `base_url` overriding in `config.yaml` to fully support local self-hosted LLMs like Ollama, vLLM, or LiteLLM. Handle local network requests gracefully).
- **Build Targets:** Must support cross-compilation for Windows (`.exe`) and Linux (ELF binary).

## 3. Directory Structure

```text
llm-wiki/
├── Cargo.toml
├── src/
│   ├── main.rs           # Entry point: spawns Tokio tasks (Watcher & MCP Server)
│   ├── config.rs         # Parses config.yaml (paths, API keys, endpoints)
│   ├── mcp/              # MCP Protocol implementation
│   │   ├── protocol.rs   # JSON-RPC struct definitions
│   │   └── server.rs     # Stdin/Stdout event loop & tool routing
│   ├── pipeline/         # Event-Driven Ingestion
│   │   ├── watcher.rs    # Listens to raw/ folder modifications
│   │   ├── chunker.rs    # Markdown text splitting logic
│   │   └── embedder.rs   # Calls Embedding API
│   ├── db/
│   │   └── qdrant.rs     # Qdrant DB connection & upsert/search logic
│   └── cache/
│       └── semantic.rs   # LRU Semantic Cache with Quantization, LSH & Hybrid Fallback
├── data/
│   └── raw/              # Immutable Markdown sources
└── config.yaml           # App configuration
```

## 4. Core Pipelines to Implement

### A. The Ingestion Pipeline (`watcher.rs` + `db/qdrant.rs`) -> UPDATED WITH MICRO-BATCHING

- Initialize a file watcher on `data/raw/` using the `notify` crate.
- **Event Storm Mitigation (Debounce & Deduplication):** Do NOT process files immediately upon receiving an OS event. Implement a Producer-Consumer pattern with a Time-Window Batcher using `tokio::sync::mpsc` and `tokio::select!`.
  1. **Producer Loop:** When `notify` emits a `Modify` or `Create` event, send the file `PathBuf` to an MPSC channel.
  2. **Consumer Loop (The Batcher):** - Maintain an internal `HashSet<PathBuf>` to deduplicate incoming file paths.
     - Use `tokio::time::sleep` (e.g., 2 seconds) as a debounce timer.
     - Use `tokio::select!` to race between receiving a new path from the channel AND the debounce timer ticking down.
     - If a new path arrives -> insert into `HashSet` and **reset** the timer.
     - If the timer expires (no new events for 2 seconds) AND the `HashSet` is not empty -> drain the `HashSet`, process all unique files, and **bulk upsert** their vectors to Qdrant in a single gRPC call.
  3. **Processing:** Read file -> Chunk text -> Embed via `reqwest` -> Upsert to Qdrant.

### B. The MCP Server Pipeline (`mcp/server.rs`)

- Implement a JSON-RPC 2.0 listener on `tokio::io::stdin()`.
- **Initialization:** Respond to the MCP `initialize` request, exposing the capability: `tools`.
- **Tool Definition:** Expose a tool named `search_wiki` with schema accepting `query` (string).
- **Execution (`CallToolRequest`):**
  1. Receive `query`.
  2. Check `Semantic Cache` (using Dual-Threshold & Jaccard logic).
  3. If Cache Miss or Fallback triggered, embed `query`.
  4. Query Qdrant via gRPC (`search` method) for top 5 chunks.
  5. Cache the result and write JSON-RPC response to `tokio::io::stdout()`.

### C. The Semantic Cache (`cache/semantic.rs` & `cache/lsh.rs`)

- Build a memory-efficient, thread-safe LRU Cache to operate strictly within 8GB RAM constraints.
- **Quantization:** Do NOT store raw `f32` vectors. Implement Scalar Quantization (e.g., converting `f32` to `i8`) or Binary Quantization to compress vector footprint before caching.
- **Locality-Sensitive Hashing (LSH):** Do NOT use brute-force linear iteration for Cosine Similarity. Implement a basic LSH indexing structure (Random Projection hashes) to group similar quantized vectors into buckets.
- **Execution & Dual-Threshold Asymmetric Search:** When a `query` comes, hash it -> find the bucket in $O(1)$ -> calculate Quantized Cosine Similarity ONLY for items in that specific bucket. Evaluate the score:
  - `Score >= 0.95`: **Sure Hit** -> Return cached result immediately.
  - `0.85 <= Score < 0.95`: **Grey Zone** -> Semantic match is likely but carries the risk of "pixelation" (Hash Collision) from quantization. -> *Trigger Hybrid Lexical Heuristics*.
  - `Score < 0.85`: **Miss** -> Bypass cache, hit Qdrant.
- **Hybrid Lexical Heuristics (Zero-Allocation Character Trigrams):** To handle code snippets lacking whitespace (e.g., `Arc<RwLock<T>>` vs `Rc<RefCell<T>>`), do NOT use word-level splitting for Jaccard similarity. Implement **Hashed Character Trigrams**.
  - Convert the query into byte windows: `query.as_bytes().windows(3)`.
  - Hash each 3-byte window into a `u64` using a fast, non-cryptographic hasher (like `rustc-hash` / `FxHasher`).
  - Compute the Jaccard Similarity ($J(A, B) = \frac{|A \cap B|}{|A \cup B|}$) comparing the two `HashSet<u64>` of trigram hashes.
  - If the Jaccard score is too low, discard the semantic cache hit as a quantization hallucination and fall back to querying Qdrant.
- Include Big-O space/time complexity notes demonstrating the memory savings of Quantization, the speedup of LSH, and how Hashed Trigrams strictly bounded memory without string allocations.

## 5. Coding Guidelines & Best Practices

- **Modern Syntax:** Use standard Rust 2021 idioms, pattern matching, and `?` for error propagation.
- **Comments:** Include English comments explaining complex logic. Add Big-O space/time complexity notes on the Semantic Cache, Jaccard calculations, and Qdrant queries.
- **Safety & Concurrency:** Avoid deadlocks. Use `tokio::spawn` for independent systems (Watcher vs. MCP Loop) communicating via `tokio::sync::mpsc` channels if necessary.
- **Stdout Strictness:** The MCP server communicates via stdout. **NEVER** use `println!` for logging debugging info, as it will break the JSON-RPC protocol. Use `eprintln!` or a logging crate outputting to `stderr` or a file.

## 6. Version Control & Git Workflow (CRITICAL)

You are acting as an autonomous developer agent with terminal access. You MUST follow this strict Git workflow:

- **Branching Strategy:** Do NOT push code directly to `main`. Create a specific feature branch for each core pipeline before writing code.
  - *Example:* `git checkout -b feature/ingestion-pipeline`
  - *Example:* `git checkout -b feature/mcp-server`
- **Atomic Commits:** Commit your work piece-by-piece (e.g., after completing a specific file, struct, or logical function). Do NOT write the entire project and submit one massive commit. I need granular control to review your work.
- **Commit Message Convention:** Strictly use Conventional Commits, and include the **file name** or component in the scope for easy tracking.
  - Format: `<type>(<file_name_or_module>): <description>`
  - *Example:* `feat(chunker.rs): implement sliding window text splitting`
  - *Example:* `refactor(semantic.rs): optimize LSH hashing logic`
  - *Example:* `chore(Cargo.toml): add tokio and reqwest dependencies`
- **Automation & Merging:** 1. Execute `git add` and `git commit` automatically after completing a logical unit.
  2. Push the branch to the remote repository.
  3. **STOP AND ASK FOR MY APPROVAL** before merging the feature branch back into `main`. Do not auto-merge without explicitly asking me first.

### 🛡️ Layer 1: OS-Level Integrity Shield (Read-Only Isolation)

To prevent semantic hallucinations where you might accidentally write destructive code (e.g., `std::fs::remove_dir_all`), you MUST lock down the source directory BEFORE running or testing the app.

1. Create the data directory: `mkdir -p data/raw/`
2. Apply OS-level Read-Only permissions to prevent accidental deletion by the application runtime:
   - *Linux/macOS:* Run `chmod -R a-w data/raw/` (Remove write permissions for all).
   - *Windows:* Run `icacls "data\raw" /deny Everyone:(W,D)` (Deny write and delete).
*Note: The Rust app should only read from this directory. If your code attempts to write/delete here, it will crash with `PermissionDenied`, which is the intended security behavior.*

### 🛡️ Layer 2: The Local Immune System (Pre-commit Hook)

**BEFORE** writing any feature code, you MUST create a Git `pre-commit` hook to automatically guard against hallucinations and concurrency bugs.

1. Create a file at `.git/hooks/pre-commit` with the following bash script:

    ```bash
    #!/bin/bash
    echo "🛡️ Running Local Immune System (Fmt, Clippy, Tests)..."

    # 1. Check formatting
    cargo fmt -- --check
    if [ $? -ne 0 ]; then
        echo "❌ Code formatting failed! Run 'cargo fmt' to fix it."
        exit 1
    fi

    # 2. Strict Clippy (Deny warnings, catch concurrency bugs)
    cargo clippy -- -D warnings -W clippy::pedantic -W clippy::await_holding_lock -W clippy::unwrap_used
    if [ $? -ne 0 ]; then
        echo "❌ Clippy found bad practices or concurrency risks! Fix them."
        exit 1
    fi

    # 3. Run unit tests
    cargo test
    if [ $? -ne 0 ]; then
        echo "❌ Unit tests failed! Code is broken."
        exit 1
    fi

    echo "✅ All checks passed! Committing..."
    ```

2. Make it executable: `chmod +x .git/hooks/pre-commit`.

3. Do NOT bypass this hook using `--no-verify`.

## 7. Action Plan

Execute the development in this strict order, committing after each step:

1. Initialize the project (`git init`), generate `Cargo.toml`, and set up the basic `src/main.rs`. -> **Execute Commit**.
2. Implement `src/mcp/protocol.rs` and `src/mcp/server.rs`. -> **Execute Commit**.
3. Implement `src/cache/semantic.rs` (with Trigrams & Quantization). -> **Execute Commit**.
4. Implement the Ingestion Pipeline (`watcher.rs` and `db/qdrant.rs`). -> **Execute Commit**.

Start with Step 1 now.
