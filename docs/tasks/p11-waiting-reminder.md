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

- The checkout had CRLF working copies (`core.autocrlf=true`), which broke `format:check`, `design-system:check` and `verify:packet`. Fixed locally with `git config core.autocrlf input` and a re-checkout (`git rm --cached -r . && git reset --hard` on a clean tree). Nothing in the repository changed for this.
- Playwright's Chromium build 1243 was installed with `npx playwright install chromium` (browser only, no OS dependencies).
- `docs/design-system/agent-kit` checks hard-require Node 24 (the project's `engines` allows 24–26, but the kit script does not). The gate was run with a portable Node v24.22.2 from nodejs.org (SHA-256 checked) placed first on `PATH`; nothing was installed system-wide.
- Five Markdown files under `context/changes/` (the change's frame, plan-brief, plan, plan-review and `case-forge/frame.md`) were reformatted by Prettier so `format:check` passes; no content change.

## Evidence

Run on 2026-11-09, Windows, Node v24.22.2 (portable), LF working copy.

| Check                                                                                 | Result                                                                                                                       |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `./scripts/verify` (format, design-system, lint, typecheck, unit, packet, build, e2e) | exit 0: design-system 67 files match; 39 unit tests; packet 120 journeys; build ok; 35 e2e passed (1.8 min, default workers) |
| New e2e journey "P11 session: …"                                                      | passed inside the full run (axe on Kandydaci with reminder ON, 390 px no horizontal scroll)                                  |

Earlier, before the environment fixes, the same code passed lint, typecheck, unit tests, build and 35 e2e tests with a locally installed older Chromium.

Screenshot: `artifacts/p11-kandydaci-mobile.png` (390 px, reminder ON, queue A after one invite; git-ignored).

Manual verification (plan Phase 7, rows 7.1–7.15) was performed and confirmed by the user on 2026-11-09, after the sidebar fix `fdad1c4`; it is the user's report, not a recorded transcript.

Not run: CI, any independent code review.
