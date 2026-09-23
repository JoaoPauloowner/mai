<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ENGINEERING OPERATING PROTOCOL

## 1. PRINCIPLE

Priority:
CORRECTNESS > SIMPLICITY > SPEED > REFINEMENT

Goal:
> PRODUCE RESULTS, NOT NARRATION.

Be concise in:
- tokens, text, research, file reads, explanations, abstractions, comments, documentation.

Do not narrate execution.

Prefer:
RESULT: PASS / PARTIAL / FAIL
CHANGED: - file → change
TESTED: - command/route → result
ISSUES: - only if applicable
NEXT: - only if necessary

---

## 2. READ ONLY WHAT IS NECESSARY

Before opening a file, ask:
> Is this necessary to solve or verify the current task?

If not, do not open it. Do not read the entire repository unnecessarily.

Use targeted discovery:
task → relevant file → direct dependency → configuration → test → fix

---

## 3. NEVER REPEAT DISCOVERED INFORMATION

Maintain a compact internal map:
FACTS | PROBLEMS | ACTIONS | RESULTS

If something is already known, do not search again or reread without reason.

---

## 4. USE SKILLS AND TOOLS SURGICALLY

Priority:
SPECIALIZED SKILL > NATIVE TOOL > DIRECT COMMAND > MANUAL IMPLEMENTATION

Use targeted tools: `grep/ripgrep`, `find`, `git status`, `git diff`, `git log`, `TypeScript`, `lint`, `build`, focused tests.

---

## 5. PRESERVE WORKING CODE

If existing code works, PRESERVE IT.
Refactor only for bug, risk, meaningful duplication, proven maintenance problem or explicit requirement.

---

## 6. MINIMAL PATCH PRINCIPLE

Fix the smallest possible surface.
Do not turn "fix login" into "rewrite authentication architecture".

---

## 7. DO NOT CHANGE ARCHITECTURE WITHOUT EVIDENCE

SUSPECT → INSPECT → REPRODUCE → CONFIRM CAUSE → MINIMAL PATCH → TEST
Never: SUSPECT → REWRITE.

---

## 8. BACKEND / API DISCIPLINE

Trace: FRONTEND → API → AUTH → AUTHORIZATION/TENANT → SERVICE → DATABASE → RESPONSE → FRONTEND.
A `200` response does not automatically mean the integration works.

---

## 9. FRONTEND DISCIPLINE

Existing component > Shared component > Existing theme > New component.

---

## 10. TEST BEFORE CLAIMING

Never claim something works unless it was tested.
States: PASS | FAIL | NOT TESTED | UNKNOWN | BLOCKED.

---

## 11. GIT & DESTRUCTIVE ACTIONS SAFETY

Before: `git status --short`. After: `git diff --stat`.
Never execute without explicit authorization: `git reset --hard`, `git clean -fd`, `DROP DATABASE`, `TRUNCATE`, mass `DELETE`, `npm audit fix --force`.

---

## 12. FINAL OPERATING RULE

BE SURGICAL.
Before every action ask: "Is this necessary to solve or prove the task?" If NO: DO NOT DO IT.
NEVER SACRIFICE CORRECTNESS FOR SPEED.
TARGET: MAXIMUM SIGNAL, MINIMUM NOISE.
