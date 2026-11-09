# P11 waiting-application reminder (employer session prototype)

Plan: `context/changes/case-forge-exp-7/plan.md`. Frame: `context/changes/case-forge-exp-7/frame.md`.

## Intent

Discovery idea **P11**: remind an employer about applications that wait more than 3 days without a decision. exp-7 judged the idea favourable. This prototype lets a facilitator load one of two equivalent synthetic BrightLabs queues (A or B) before a round, switch the reminder on or off for that round, and run a with/without session. It tests whether the employer notices and understands the waiting applications and handles them first. It does not prove that real employers invite faster; exp-6 (live email, random split) stays the behaviour test.

## Acceptance criteria

- Settings has a "Sesja testowa P11" panel: load queue A or B (after a confirmation), set the reminder for the round, and see the queue and the load time (local and UTC).
- Reminder ON: "Moje oferty" and "Kandydaci" show a banner "N zgłoszenia czekają ponad 3 dni · Pokaż je"; job cards show their own waiting count; each application card shows "Zgłoszenie <date> · Czeka N dni" with a cobalt clock when overdue; "Pokaż je" opens `/app/kandydaci?czeka`, filtered to waiting applications.
- Reminder OFF: no banner, no per-job count, no "Czeka" cue, `?czeka` is ignored; each card still shows "Zgłoszenie <date>"; list order is identical in both variants.
- Inviting or rejecting an application removes it from the waiting count immediately and after reload; "W przeglądzie" does not.
- Each stage change keeps its real timestamp, so an export shows the handling order.
- Without a loaded session (`initialState`, existing tests, baseline packet, employer pages) nothing changes.

## Out of scope

Email or notification delivery, scheduler, experiment assignment or exposure logging, change to `initialState`, `people.json`, `marketplace.json`, the stage machine, the `State` version or the export format, sorting by waiting time, a waiting cue on the application detail page or the home KPI tiles, P6/P10, candidate-side changes.

## Adaptations during implementation

- The load status (queue and load time) is held in the store (and persisted under its own key) instead of Settings-local state: loading a session sets `activePersonId` to `null`, which remounts the page content (`shell.tsx` keys it on the active person), so a local message would vanish.

## Environment notes

- `npm run verify:packet` fails in this Windows checkout both before and after the P11 changes: `core.autocrlf=true` turns `public/case/baseline.csv` into CRLF while the script compares against LF output. Run against the committed (LF) blobs (`git show HEAD:...` into a temp root) it passes: "Baseline packet verified: 120 journeys". The P11 changes do not touch the packet.
- Playwright's expected Chromium build (1243) is not installed here; only 1223 is. Nothing was installed. E2E runs used a temporary `playwright.local.config.ts` (deleted afterwards) that spread the base config and added `use.launchOptions.executablePath` pointing at `%LOCALAPPDATA%/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe`; invocation: `npx playwright test -c playwright.local.config.ts --workers=1` after `npm run build`. With the default 8 workers two heavy journeys timed out at 30 s (both pass in isolation); with `--workers=2` all 34 passed.
- `npm run format:check` fails repo-wide in this checkout (CRLF working copies vs `endOfLine: lf`); the files touched by P11 pass `prettier --check`.

## Evidence

Run on 2026-11-09, Windows, Node v26.13.0 (project targets Node 24), `core.autocrlf=true`.

| Check                                                                                                  | Result                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npx vitest run src/features/prototype/p11.test.ts`                                                    | 12 passed                                                                                                                                                              |
| `npm test`                                                                                             | 6 files, 39 tests passed                                                                                                                                               |
| `npm run typecheck`, `npm run lint`                                                                    | passed                                                                                                                                                                 |
| `npm run build`                                                                                        | passed                                                                                                                                                                 |
| e2e, full suite incl. new P11 journey (axe on Kandydaci with reminder ON, 390 px no horizontal scroll) | 35 passed with `--workers=1` (see environment notes for the local Chromium)                                                                                            |
| `npx prettier --check` on every file P11 touched                                                       | passed                                                                                                                                                                 |
| `./scripts/verify` as a whole                                                                          | **fails in this checkout** at `format:check` (146 files, all CRLF working copies; none are P11 files)                                                                  |
| `npm run design-system:check`                                                                          | **fails in this checkout** ("Agent-kit reference changed: .nvmrc", hash vs CRLF working copy); `git diff HEAD -- docs/design-system` is empty, so the kit is unchanged |
| `npm run verify:packet`                                                                                | fails here for the same CRLF reason; passes on the committed LF blobs                                                                                                  |

Screenshot: `artifacts/p11-kandydaci-mobile.png` (390 px, reminder ON, queue A after one invite).

Not run: manual dry run of the session script (Phase 7), CI, any human review.
