# Personal Knowledge Management (PKM) - Second Brain

Centralized repository and cognitive workbench structured on a modified **PARA Method** (Inbox, Projects, Areas, Resources, Archives, Flashcards, Meta) combined with **Zettelkasten** linking principles.

Primary mission: Accelerate career progression toward senior-level **Backend Engineering**, while anchoring systems thinking, English proficiency, and financial independence through verified atomic notes, executable roadmaps, and automated quality gates.

---

## Vault Architecture (Modified PARA)

Enforces a strict **2-level folder depth limit** across resources and projects to balance structural clarity with friction-free retrieval:

- **`00_Inbox/` (Capture)**: Temporary holding area for raw thoughts, drafts, and unprocessed web clippings. Triaged and emptied regularly.
- **`10_Projects/` (Active & Time-bound)**: Active initiatives with concrete deliverables and deadlines. Subdirectories sit flat under the project root (`Architecture/`, `Auth/`, `Database/`, `DevOps/`, `Workflows/`, `Testing/`).
- **`20_Areas/` (Long-term Standards)**: Ongoing domains of responsibility without terminal end-dates:
  - `Daily_Logs/`: Standardized daily logs tracking focus, blockers, and cognitive reflections.
  - `Finances/`: Investment strategies, financial migration plans, and capital allocation models.
  - `Learning/`: Central learning dashboards, learner profiles, and skill progression logs.
- **`30_Resources/` (Evergreen Knowledge)**: Curated, reusable reference library of atomic notes:
  - `Tech/`: Domain-specific engineering knowledge (`Architecture_and_Patterns/`, `API_and_Data_Design/`, `Frameworks_and_Ecosystem/`, `Infrastructure_and_Cloud/`, `Language_and_Core/`, `Web_Client_and_Security/`).
  - `Concepts/`: Fundamental theories and mental models (`Academic_and_Case_Studies/`, `Computer_Science/`, `Finance_and_Economics/`, `Knowledge_Management/`, `Learning_and_Linguistics/`, `Negotiation_and_Communication/`, `Product_and_Business_Mindsets/`, `Psychology_and_Mental_Models/`, `Software_Testing/`).
  - `Methods/`: Actionable SOPs, execution frameworks, and roadmaps (`Engineering/`, `Learning_and_Cognition/`, `Finance/`).
  - `Life/`: Evidence-backed research on physiology, sleep, and lifestyle optimization (`Health_and_Dermatology/`, `Sleep_and_Recovery/`).
  - `Excalidraw/`: Visual architecture diagrams and mental model sketches.
- **`40_Archives/` (Cold Storage)**: Completed projects, deprecated standards, and inactive reference material.
- **`50_Flashcards/` (Spaced Repetition)**: Anki-synchronized decks via Yanki:
  - `Vocabulary/`: 4-Tier Frequency Architecture (`1_Core_General/`, `2_Academic_Analytical/`, `3_Software_Engineering/`, `4_Professional_Workplace/`).
  - `Grammar/`: Tactical sentence formulas, cues, and pronunciation mechanics.
  - Technical Domains: `ASPDOTNET/`, `Architecture_Patterns/`, `Database_Concurrency/`, `Database_Indexing/`, `Git_Internals/`, `Go_Runtime/`, `Go_Slice/`, `Operating_Systems/`, `Redis_Architecture/`, `SDLC/`, `Software_Testing/`, `V8_Engine/`.
- **`99_Meta/` (System Governance)**: System templates, Tag SSOT, and automated validation scripts.

---

## Core Roadmaps & Strategic Anchors

Key roadmap documents driving technical engineering, in-memory systems, problem-solving, and continuous language acquisition:

| Roadmap / Guide                     | File Path                                                                                                                           | Focus & Core Objective                                                                                           |
| :---------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **Master Roadmaps Index**           | [`Master_Roadmaps_Index.md`](20_Areas/Learning/Master_Roadmaps_Index.md)                                                            | Central navigation dashboard connecting all 80/20 mastery roadmaps across the vault.                             |
| **Master SSOT & Roadmap**           | [`Master_Backend_Engineering_SSOT.md`](30_Resources/Methods/Engineering/Master_Backend_Engineering_SSOT.md)                         | Single Source of Truth (SSOT), 4-Layer Cognitive Stack, and master development pipeline for Backend Engineering. |
| **Redis Mastery 80/20**             | [`Redis_Mastery_80_20_Roadmap.md`](30_Resources/Methods/Engineering/Redis_Mastery_80_20_Roadmap.md)                                 | In-Memory Systems Engineering: Event Loop, `listpack` memory encodings, cache failure modes, and persistence.    |
| **Grafana k6 Mastery 80/20**        | [`Grafana_K6_Mastery_80_20_Roadmap.md`](30_Resources/Methods/Engineering/Grafana_K6_Mastery_80_20_Roadmap.md)                       | Performance engineering: Closed vs Open Workload Models, Coordinated Omission, and CI/CD Quality Gates.          |
| **English Mastery 80/20**           | [`English_Mastery_80_20_Roadmap.md`](30_Resources/Methods/Learning_and_Cognition/English_Mastery_80_20_Roadmap.md)                  | SLA-based language acquisition: Paul Nation Four Strands, NGSL 92% coverage, and Syntax State Machines.          |
| **System Design**                   | [`System_Design_Architecture_Roadmap.md`](30_Resources/Methods/Engineering/System_Design_Architecture_Roadmap.md)                   | Scalable architecture roadmap: single-node limits, caching, rate limiting, and event-driven architectures.       |
| **SQL & Database Benchmarking**     | [`Postgres_SQL_Performance_Benchmarking_Guide.md`](30_Resources/Methods/Engineering/Postgres_SQL_Performance_Benchmarking_Guide.md) | Indexing mechanics, `EXPLAIN ANALYZE` decomposition, cursor pagination, and benchmarking with `k6`.              |
| **Linux Mastery Core**              | [`Linux_Mastery_Core_Roadmap.md`](30_Resources/Methods/Engineering/Linux_Mastery_Core_Roadmap.md)                                   | Kernel primitives, Process Memory, Sockets, cgroups, systemd, and eBPF tracing via the USE Method.               |
| **LeetCode & Algorithmic Patterns** | [`LeetCode_Pattern_Mastery_Roadmap.md`](30_Resources/Methods/Engineering/LeetCode_Pattern_Mastery_Roadmap.md)                       | Pattern-recognition roadmap covering 15 core algorithmic patterns (Blind 75, NeetCode 150).                      |
| **Data Structures & Algorithms**    | [`Data_Structures_and_Algorithms_Roadmap.md`](30_Resources/Methods/Engineering/Data_Structures_and_Algorithms_Roadmap.md)           | Algorithmic complexity, core data structure mechanics, and memory trade-offs.                                    |
| **Mental Models & Problem Solving** | [`Problem_Solving_Mental_Model_Pipeline.md`](30_Resources/Methods/Learning_and_Cognition/Problem_Solving_Mental_Model_Pipeline.md)  | 5-step Decision Engine translating abstract mental models into actionable cognitive pipelines.                   |
| **TOEIC Self-Study Roadmap**        | [`TOEIC_Self_Study_Roadmap_0_To_900.md`](30_Resources/Methods/Learning_and_Cognition/TOEIC_Self_Study_Roadmap_0_To_900.md)          | Milestone-driven 0 to 900+ roadmap for standardized English proficiency via dictation.                           |
| **System Structure Guide**          | [`000_System_Structure.md`](000_System_Structure.md)                                                                                | Directory mapping, folder conventions, and structural invariants across the vault.                               |

---

## Maps of Content (MOCs) & Discovery

Dynamic indexes organizing atomic notes by domain:

- **Engineering & Architecture**: [`000_Tech_MOC.md`](30_Resources/Tech/000_Tech_MOC.md)
- **Concepts & Mental Models**: [`000_Concepts_MOC.md`](30_Resources/Concepts/000_Concepts_MOC.md)
- **Methods & Standard Operating Procedures**: [`000_Methods_MOC.md`](30_Resources/Methods/000_Methods_MOC.md)

---

## Tooling, Quality Gates & CI/CD

To preserve vault integrity, prevent entropy, enforce standards, and automate verification:

1. **Fast Toolchain**: Migrated entirely to the Rust-powered **Oxc** suite (`oxlint` for linting, `oxfmt` for formatting), managed via `bun`.
2. **Tag Taxonomy SSOT**: `99_Meta/Tag_Taxonomy_SSOT.md` is the single source of truth for all metadata tags.
3. **CI/CD Quality Gates**: Configured at `.github/workflows/vault-ci.yml` (running on `main` via `actions/checkout@v7`).
4. **Validation Scripts**:
   - `bun run lint`: Lint tooling scripts using `oxlint`.
   - `bun run fmt`: Format and write tooling scripts using `oxfmt --write`.
   - `bun run validate:notes`: Verifies frontmatter YAML, required headings (`## TL;DR`, `## Core Concepts`, `## Practical Implementation`, `## Related Notes`), and tag SSOT declarations.
   - `bun run validate:flashcards`: Audits all technical (134 cards) and English (404 cards) flashcard decks against the Minimum Information Principle (MIP) and length constraints.
   - `bun run validate:graph`: Analyzes the knowledge graph network across 330+ notes to detect broken wikilinks, orphan notes, and cross-domain contamination.

### Quick Command Reference

```bash
# Run all quality gates locally
bun run validate:all

# Lint and format tooling scripts
bun run lint
bun run fmt

# Inspect the network graph of a specific note
bun 99_Meta/Scripts/graph_network.mjs show Redis_Mastery_80_20_Roadmap

# Generate a Mermaid diagram of local connections
bun 99_Meta/Scripts/graph_network.mjs mermaid Redis_Mastery_80_20_Roadmap

# View vault-wide graph network metrics
bun 99_Meta/Scripts/graph_network.mjs stats
```
