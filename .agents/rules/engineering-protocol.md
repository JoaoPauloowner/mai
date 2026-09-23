# ENGINEERING OPERATING PROTOCOL

## 1. PRINCIPLE

Priority:
CORRECTNESS > SIMPLICITY > SPEED > REFINEMENT

Goal:
> PRODUCE RESULTS, NOT NARRATION.

Be concise in:
- tokens
- text
- research
- file reads
- explanations
- abstractions
- comments
- documentation

Do not narrate execution.

Avoid:
- "Agora vou..."
- "Em seguida..."
- "Estou verificando..."
- "Isso é importante porque..."

Unless a relevant decision requires explanation.

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

If not, do not open it.

Do not:
- read the entire repository unnecessarily
- inspect large files without reason
- perform broad exploration
- repeat searches

Use targeted discovery:
task → relevant file → direct dependency → configuration → test → fix

Stop when evidence is sufficient.

---

## 3. NEVER REPEAT DISCOVERED INFORMATION

Maintain a compact internal map:
FACTS | PROBLEMS | ACTIONS | RESULTS

If something is already known:
- do not search again
- do not reread without reason
- do not re-prove the same cause

---

## 4. USE SKILLS AND TOOLS SURGICALLY

Before a complex task, check whether a relevant Skill exists.

Priority:
SPECIALIZED SKILL > NATIVE TOOL > DIRECT COMMAND > MANUAL IMPLEMENTATION

Use a Skill only when it reduces work, errors, context or implementation time.
Do not install/search for Skills merely for sophistication.

Prefer targeted tools:
- grep/ripgrep, find, git status, git diff, git log, TypeScript, lint, build, focused tests

---

## 5. PRESERVE WORKING CODE

If existing code works:
> PRESERVE IT.

Do not refactor because:
- you prefer another pattern
- the code is not aesthetically pleasing
- there is minor duplication
- you want an abstraction
- you would implement it differently

Refactor only for:
- bug, security/risk, meaningful duplication, proven maintenance problem, explicit requirement, measurable impact.

---

## 6. MINIMAL PATCH PRINCIPLE

Fix the smallest possible surface.

Priority:
1. smallest change
2. lowest risk
3. smallest affected surface
4. test
5. refactor only if justified

Do not turn "fix login" into "rewrite authentication architecture".
Prefer reuse over duplication.

---

## 7. DO NOT CHANGE ARCHITECTURE WITHOUT EVIDENCE

Never modify core architecture based on assumption.

For bugs:
SUSPECT → INSPECT → REPRODUCE → CONFIRM CAUSE → MINIMAL PATCH → TEST

Never:
SUSPECT → REWRITE

---

## 8. BACKEND / API DISCIPLINE

For API issues, trace:
FRONTEND → API → AUTH → AUTHORIZATION/TENANT → SERVICE → DATABASE / EXTERNAL API → RESPONSE → FRONTEND

A `200` response does not automatically mean the integration works. Prove the problem before altering backend code.

---

## 9. FRONTEND DISCIPLINE

Before changing UI:
1. find existing component
2. find shared component
3. check existing tokens/theme
4. only then create a new component

---

## 10. TEST BEFORE CLAIMING

Never claim something works unless it was tested.

Use explicit states:
PASS | FAIL | NOT TESTED | UNKNOWN | BLOCKED — CREDENTIAL REQUIRED | BLOCKED — EXTERNAL SERVICE

---

## 11. GIT SAFETY

Before modifying:
`git status --short`

After modifying:
`git diff --stat`

Never execute without explicit authorization:
- `git reset --hard`, `git clean -fd`, `DROP DATABASE`, `TRUNCATE`, mass `DELETE`, `npm audit fix --force`.

---

## 12. DEPENDENCIES & NEXT.JS

Do not install dependencies if an existing one or native API solves the issue.
Before changing routing/middleware/config, understand existing architecture. Warning ≠ bug.

---

## 13. DESTRUCTIVE OR HIGH-IMPACT CHANGES

Stop before executing a large restructuring. Report:
PROBLEM: X
IMPACT: Y
PROPOSAL: Z
FILES: X
RISK: LOW / MEDIUM / HIGH

---

## 14. OUT-OF-SCOPE PROBLEMS

If discovered:
OUT OF SCOPE: [problem]
Do not fix automatically without user authorization.

---

## 15. FINAL OPERATING RULE

BE SURGICAL.
Before every action ask: "Is this necessary to solve or prove the task?" If NO: DO NOT DO IT.
NEVER SACRIFICE CORRECTNESS FOR SPEED.
TARGET: MAXIMUM SIGNAL, MINIMUM NOISE.
