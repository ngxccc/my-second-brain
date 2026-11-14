---
noteId: 1792942753762
---

How do you correctly sequence grammatical tenses across the three core questions of a Daily Standup?

---

- **Yesterday (Past Simple: V2)** $\rightarrow$ **Today (Present Continuous: am/are V-ing)** $\rightarrow$ **Blockers (Present Simple / Passive)**.
- e.g., `Yesterday I fixed ticket #102, today I am refactoring the middleware, and I am blocked by credentials.`

---

Extra:

- Formula:
  1. Yesterday: `Subject + V2 (Past Simple)`
  2. Today: `Subject + am/is/are + V-ing (Present Continuous)`
  3. Blockers: `Subject + have no blockers` HOẶC `Subject + am currently blocked by + [Noun Phrase]`
- Examples:
  - _`Yesterday, I wrapped up the schema migration script and pushed it to staging.`_
  - _`Today, I am investigating a race condition in the worker pool.`_
  - _`I am currently blocked by missing API keys from the third-party provider.`_
- Traps:
  - [FAIL] `Yesterday I work on...` $\rightarrow$ [OK] `Yesterday I worked on...`
  - [FAIL] `Today I will do...` $\rightarrow$ [OK] `Today I am working on...`
