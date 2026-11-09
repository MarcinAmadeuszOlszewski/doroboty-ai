<!-- PLAN-REVIEW-REPORT -->
# Plan Review: P11 Waiting-Application Reminder — Employer Session Prototype

- **Plan**: context/changes/case-forge-exp-7/plan.md
- **Mode**: Deep (inline, no subagent fan-out)
- **Date**: 2026-11-09
- **Verdict**: REVISE → SOUND after triage (all findings fixed in plan)
- **Findings**: 0 critical, 3 warnings, 4 observations

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| End-State Alignment | PASS (1 observation) |
| Lean Execution | PASS |
| Architectural Fitness | PASS |
| Blind Spots | WARNING |
| Plan Completeness | WARNING |

## Grounding
9/9 paths ✓ (store.tsx line refs stale), 8/8 symbols ✓ (transition `now`, commit `replace`, nextStages, people max 100, useSearchParams, AxeBuilder, lucide, Checkbox), brief↔plan ✓, Progress↔Phase ✓. No `docs/reference/contract-surfaces.md`; no `context/foundation/lessons.md`.

## Findings

### F1 — "Handled first" metric undefined; export can't be scored consistently

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Blind Spots
- **Location**: Phase 6 §3 Session script; Success Criteria
- **Detail**: `nextStages.submitted = [reviewed, rejected]` (model.ts:98), so the first click on a submitted overdue item is always "W przeglądzie", which the plan says does not clear it. The export mixes seeded history with live clicks, and the load time was recorded nowhere. The session script said only "note order of events[].at".
- **Fix**: Define the scoring rule in session.md. The primary rank uses the first invite/reject; the secondary rank uses the first live event; only events after the load time count. Show the load time in the Settings status, local plus UTC ISO (`events[].at` is UTC; Poland is UTC+1 in November), and have the observer note the first application opened.
- **Decision**: FIXED

### F2 — Per-job copy "{n} czeka ponad 3 dni" is ungrammatical for 2–4

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Completeness
- **Location**: Phase 5 — EmployerJobs
- **Detail**: With 2 overdue items per job, the copy reads "2 czeka" instead of "2 czekają". The plan only said "consider adding waitingCountLabel".
- **Fix**: `waitingCountLabel(n)` is now mandatory in the Phase 1 contract and covered by the plural tests.
- **Decision**: FIXED

### F3 — Seeded "invited" history skips `reviewed`

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Completeness
- **Location**: Phase 2 §1
- **Detail**: The schema rejects submitted → interview_invited (model.ts:178-183).
- **Fix**: The history is spelled out as submitted 10 d → reviewed 9 d → interview_invited 8 d.
- **Decision**: FIXED

### F4 — Settings contract gaps: dialog branches and silent reminder write failure

- **Severity**: OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Blind Spots
- **Location**: Phase 3 §2
- **Detail**: `confirm()` and the dialog copy are binary (settings.tsx:40-48,108-110), so a p11 pending value would fall into `importState(raw)`. A `writeReminder` false result was not surfaced, so an OFF round would silently revert to ON after a reload.
- **Fix**: An explicit switch over all pending cases, plus a `role="alert"` error when the write fails.
- **Decision**: FIXED

### F5 — A/B role confound is avoidable

- **Severity**: OBSERVATION
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: End-State Alignment
- **Location**: Phase 2; Open Risks
- **Detail**: Queue A (BrightLabs, PM/ops) and queue B (Northstar, eng/growth) differed in role type.
- **Fix**: Both queues now use BrightLabs jobs …0001/…0004. `buildP11Session(now, queue)` and `loadP11Session(queue)` load one queue per round, the facilitator exports before the next load, and A/B and ON/OFF order are counterbalanced. Repeated job ads are documented as a limitation. The plan, brief, Phase 7 rows 7.4/7.10/7.13 and the manual steps are updated.
- **Decision**: FIXED

### F6 — Stale references in plan

- **Severity**: OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Completeness
- **Location**: Current State, Key Discoveries, Desired End State, References
- **Detail**: store.tsx has 79 lines, but the plan cited :373-421/:386-398/:388. The `commit` default is `replace=false`. The dry run was attributed to Phase 6 instead of Phase 7.
- **Fix**: References corrected.
- **Decision**: FIXED

### F7 — FEATURES: Settings panel also belongs under EMP-10

- **Severity**: OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Completeness
- **Location**: Phase 6 §2
- **Detail**: EMP-10 is "Settings / matching" (FEATURES.md:58), but the plan updated only SYS-10.
- **Fix**: EMP-10 added to the update list.
- **Decision**: FIXED
