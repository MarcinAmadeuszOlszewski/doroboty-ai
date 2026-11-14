<!-- IMPL-REVIEW-REPORT -->

# Implementation Review: P11 Waiting-Application Reminder — Employer Session Prototype

- **Plan**: context/changes/case-forge-exp-7/plan.md
- **Scope**: All phases (1–7 of 7)
- **Date**: 2026-11-09
- **Verdict**: NEEDS ATTENTION → triaged 2026-11-09 (F1–F6 fixed, F7 accepted without Node 24 run)
- **Findings**: 0 critical, 2 warnings, 5 observations

## Verdicts

| Dimension           | Verdict                        |
| ------------------- | ------------------------------ |
| Plan Adherence      | WARNING                        |
| Scope Discipline    | WARNING                        |
| Safety & Quality    | WARNING (1 observation, minor) |
| Architecture        | PASS                           |
| Pattern Consistency | PASS                           |
| Success Criteria    | WARNING                        |

## Evidence

- Diff `f49a24a..HEAD`: all planned files present (`p11.ts`, `p11.test.ts`, `data/p11-session.json`, `waiting-reminder.tsx`, `store.tsx`, `settings.tsx`, `workspace.tsx`, `employer.tsx`, `workspace.css`, `tests/e2e/prototype.spec.ts`, `FEATURES.md`, `session.md`, `docs/tasks/p11-waiting-reminder.md`). No MISSING items.
- Seed: queues A/B mirror position by position (job, days, stage, score; answer/CV lengths within ~15 chars); overdue at positions 2/4/6/8, first item fresh; overdue scores 66/81/74/62 vs fresh/handled 78/58/71/69. Matches plan.
- Threshold, plurals, baseline gate (`isP11Session`), `?czeka` ignored when OFF, insertion order kept, real timestamps on actions: all match plan.
- Review-run gate (Node v26.13.0 — only runtime installed): format ✅, `verify-kit.mjs` 67 files ✅, lint ✅, typecheck ✅, unit 39/39 ✅, `verify:packet` ✅, build ✅, e2e 35/35 ✅ (incl. "P11 session: …" 9.8s). `npm --prefix docs/design-system/agent-kit run check` ❌ `Error: Use Node 24 (see .nvmrc).` — version guard, not a code failure. `./scripts/verify` therefore exit 1 in this environment.

## Findings

### F1 — Session script lets the participant start on the Settings screen with the switch visible

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Adherence
- **Location**: context/changes/case-forge-exp-7/session.md:14-19
- **Detail**: Plan Phase 6 requires that "the participant never sees the switch". Since `fdad1c4` (`keepActivePerson`, `store.tsx:21-25,61-63`) loading a queue while signed in keeps the persona and the page stays on `/app/settings`, showing "Sesja testowa P11", the reminder checkbox, "Przypomnienie: włączone" and copy about waiting time. Steps 4 and 6 say to set the variant before handing over and that the participant enters as Karolina Wiśniewska — but if the facilitator loaded while signed in as Karolina, step 6 is already satisfied on `/app/settings`, so following the script literally can hand over on Settings, priming the participant about waiting applications — the exact salience the session measures. Also step 2 ("Najpierw wyeksportuj JSON") is listed after step 1 (load), which inverts the safe order under time pressure; and the sidebar link "Ustawienia" stays reachable during the round.
- **Fix**: In `session.md`, move "export JSON" before "load", and add a final setup step: after setting the variant click "Zmień osobę" and hand over on the persona picker (participant picks Karolina Wiśniewska); add an observer note that opening "Ustawienia" during the round is recorded and invalidates the round's salience data.
- **Decision**: FIXED — session.md: export before load, hand over on persona picker via „Zmień osobę”, observer rule for opening Ustawienia

### F2 — Baseline reset no longer clears the persona (unplanned change to default app)

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Scope Discipline
- **Location**: src/features/prototype/store.tsx:103-106; tests/e2e/prototype.spec.ts:222-230
- **Detail**: Plan Desired End State: "The default app (… existing tests …) is unchanged"; Phase 4.2: "existing e2e journeys still pass unchanged". Fix commit `fdad1c4` changed `reset` to keep the active persona (previously `activePersonId: null` → persona picker) and rewrote the existing reset e2e assertion from `null` to `"candidate-anna"`. The change is documented in FEATURES SYS-10 and the commit body, and fixes a real sidebar loss on `/app/settings`, but it alters baseline behaviour that participants who never load P11 will see, and the plan was not amended.
- **Fix A ⭐ Recommended**: Record a plan addendum (Phase 3 / What We're NOT Doing) stating the reset behaviour change and its reason, and note it in the task note's Evidence.
  - Strength: Keeps the working fix; FEATURES SYS-10 and e2e already describe it, so only the plan (source of truth for future reviews) lags.
  - Tradeoff: Baseline packet behaviour still differs from pre-change.
  - Confidence: HIGH — change is small, documented and tested.
  - Blind spot: Not checked whether course/instructor materials describe "reset returns to persona picker".
- **Fix B**: Limit `keepActivePerson` to `loadP11Session` only; restore the original reset and its e2e assertion.
  - Strength: Restores "default app unchanged" literally.
  - Tradeoff: Reintroduces the sidebar loss on `/app/settings` after reset that `fdad1c4` fixed.
  - Confidence: MEDIUM — straightforward revert of 3 lines + test.
  - Blind spot: User confirmed manual checks after the fix; reverting needs re-check.
- **Decision**: FIXED via Fix A — plan.md Migration Notes addendum; task note Adaptations updated (stale "load clears persona" bullet corrected)

### F3 — Unplanned extras: load-info storage key and reformat of another change's frame

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Scope Discipline
- **Location**: src/features/prototype/p11.ts:70-91; context/changes/case-forge/frame.md
- **Detail**: Plan specified only `doroboty.p11.reminder`; implementation adds `doroboty.p11.load` (`readLoadInfo`/`writeLoadInfo`) so the load-time status survives reload — useful for scoring and documented in SYS-10, but it has no unit test. Separately, Prettier reformatted `context/changes/case-forge/frame.md` (a different change) to make `format:check` pass; whitespace-only, disclosed in the task note. Same for `FEATURES.md`: raw diff 145 lines, 11 with whitespace ignored — Prettier realigned the whole table, so the raw diff overstates the register change.
- **Fix**: Add a plan addendum line for the load key and a small `readLoadInfo` round-trip/invalid-JSON unit test.
- **Decision**: FIXED — plan.md addendum for `doroboty.p11.load`; 2 unit tests for readLoadInfo/writeLoadInfo (14/14 pass, lint + typecheck ok). Prettier reformat of other files accepted as-is (whitespace only).

### F4 — Progress 6.3 says Chromium "not installed", task note says it was installed

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Success Criteria
- **Location**: context/changes/case-forge-exp-7/plan.md:540; docs/tasks/p11-waiting-reminder.md:29
- **Detail**: Plan 6.3 "Missing Playwright Chromium reported, not installed — 731d880" is ticked, but the task note records `npx playwright install chromium` (browser only). Installing the browser does not violate AGENTS.md (it bans OS dependencies), but the checkbox text contradicts the evidence.
- **Fix**: Reword 6.3's evidence (e.g. append "— later installed browser-only, see task note") rather than leaving a contradictory tick.
- **Decision**: FIXED — Progress 6.3 annotated with the later browser-only install (title unchanged)

### F5 — Manual Phase 7 ticked in one batch on verbal confirmation only

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Success Criteria
- **Location**: context/changes/case-forge-exp-7/plan.md:546-560 (commit d2c29d4)
- **Detail**: All 15 manual items were ticked in one commit; the task note honestly states it is "the user's report, not a recorded transcript". No observable artefacts for 7.12 (desktop/390px of Settings and landing in both variants — only the e2e Kandydaci 390px screenshot exists) or 7.13 (two-round dry run; no sample exports scored with primary/secondary ranks).
- **Fix**: Keep the two dry-run exports (synthetic data) and the scored ranks next to `session.md`, or note explicitly that 7.12/7.13 have no stored artefacts.
- **Decision**: FIXED — task note Evidence states 7.12 and 7.13 have no stored artefacts

### F6 — Stale Settings message after loading a P11 queue

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Safety & Quality
- **Location**: src/features/prototype/settings.tsx:65-75
- **Detail**: `confirm()`'s P11 branch does not clear `message`, so "Przywrócono scenariusz początkowy." or "Dane zostały zaimportowane." from an earlier action stays visible after a queue load, next to the new P11 status — two `role="status"` regions with conflicting news for the facilitator (and for strict `getByRole("status")` locators).
- **Fix**: Call `setMessage("")` in the P11 branch of `confirm()`.
- **Decision**: FIXED — `setMessage("")` in the P11 branch of `confirm()`; lint, typecheck, P11 + import e2e pass

### F7 — Full gate not reproducible under Node 24 in this review

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Success Criteria
- **Location**: docs/design-system/agent-kit/scripts/check.mjs:6
- **Detail**: Only Node v26.13.0 is installed on this machine; `./scripts/verify` stops at the kit's Node-24 guard. Every other gate step passed here (see Evidence). The task note's green `./scripts/verify` under Node 24 is plausible but was not reproduced in this review.
- **Fix**: Re-run `./scripts/verify` under Node 24 (per `.nvmrc`) before merge and paste the result into the task note.
- **Decision**: ACCEPTED — user decision 2026-11-09: Node 24 re-run skipped; on Node 26 all gate steps pass except the kit's Node-24 version guard (`./scripts/verify` exit 1 there)
