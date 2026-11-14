# P11 Waiting-Application Reminder — Plan Brief

> Full plan: `context/changes/case-forge-exp-7/plan.md`
> Frame brief: `context/changes/case-forge-exp-7/frame.md`

## What & Why

The frame states the problem as follows:

> The actual problem to plan around is: P11 has no green light yet (exp-7 unrun, though a crude preview is favourable), and the app cannot stage an employer queue with simulated waiting time in two variants (reminder on / off) — so the with/without session the user wants cannot be run.

exp-7 has since run and is **favourable**, so the gate is open. This plan builds the employer session vehicle. The session checks two things: whether the employer notices and understands applications waiting more than 3 days, and whether they handle those first when the reminder is on.

## Starting Point

The app already stores the submission time and the stage history for each application. It has no simulated waiting time, only one seeded application, and a candidate list without dates. It has no reminder UI and no way to stage an ON round and an OFF round.

## Desired End State

Before each round, a facilitator uses Ustawienia → "Sesja testowa P11" to load one of two equivalent synthetic queues (A or B). Both use BrightLabs's two jobs with different candidates. They switch the reminder on or off for each round and export after each round, because the next load replaces the data.

**When the reminder is on:**

- Employers see "4 zgłoszenia czekają ponad 3 dni · Pokaż je" on Moje oferty and on Kandydaci.
- Each card shows "Czeka N dni".

**When it is off:** the list shows only the submission date, in the same order as when it is on.

Inviting or rejecting an application clears it from the count. The export shows the order in which applications were handled.

## Key Decisions Made

| Decision            | Choice                                                                                                                           | Why (1 sentence)                                                                                     | Source |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------ |
| Persona             | Employer                                                                                                                         | The trigger hits the delay that happens before the screening decision.                               | Frame  |
| Gate                | exp-7 first, prototype only if favourable                                                                                        | exp-7 came back favourable on 2026-11-09.                                                            | Frame  |
| Test goal           | Noticed and understood, plus with/without comparison                                                                             | "Acts sooner" means handled first with the reminder versus without it.                               | Frame  |
| Round structure     | Same person, two equivalent queues (A/B) on the same BrightLabs jobs, one loaded per round, A/B and ON/OFF order counterbalanced | Each person is their own control, with no repeated names and no role-type confound (plan review F5). | Plan   |
| What OFF removes    | Banner, per-job counts and the "Czeka" cue; the date stays                                                                       | This tests the whole P11 nudge against a fair baseline that still shows the date.                    | Plan   |
| What clears waiting | Invite or reject only                                                                                                            | Without this, "W przeglądzie" would silence the reminder without a decision.                         | Plan   |
| Placement           | Moje oferty (the landing page) and Kandydaci                                                                                     | The reminder is seen on the first screen, like the email.                                            | Plan   |
| List layout         | Keep the cards and add a facts line                                                                                              | Smallest change; the mobile layout and existing e2e tests stay intact.                               | Plan   |
| Clock               | Seed relative to load time; actions use real time                                                                                | A frozen "now" would collapse the handled-order measure.                                             | Plan   |
| Variant storage     | Separate localStorage key, outside `State`                                                                                       | No schema or version change, and existing saves are not broken.                                      | Plan   |
| Default app         | `initialState` unchanged; separate session loader; all P11 UI gated on a loaded session                                          | Existing tests and baseline employer pages stay identical.                                           | Plan   |

## Scope

**In scope:**

- Pure waiting logic and Polish plurals.
- Two-queue synthetic seed.
- Settings loader and ON/OFF switch.
- Banner and waiting cue on Kandydaci and Moje oferty, with a `?czeka` filter.
- E2E journey, FEATURES update (EMP-04/07, SYS-10, new EMP-11), Polish session script with disclosure, `./scripts/verify`.

**Out of scope:**

- Email or real notifications.
- Experiment assignment or exposure logging.
- Sorting by waiting time and a table redesign.
- A cue on the detail page.
- P6/P10.
- Changes to `initialState` or `people.json`.

## Architecture / Approach

`p11.ts` is a pure module (waiting status, copy, `buildP11Session(now, queue)`) backed by `data/p11-session.json`. The store gains `loadP11Session(queue)`, which uses the existing replace-commit path, and a `reminder` flag stored under `doroboty.p11.reminder`. `ApplicationsPage` and `EmployerJobs` compute overdue items at render with `Date.now()`. A shared `WaitingReminder` component follows the nocny-blekit P11 recipe: cobalt bar, tint background, no red.

## Phases at a Glance

| Phase                  | What it delivers                                                                                  | Key risk                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1. Waiting logic       | `p11.ts` helpers, plurals, variant key, task note                                                 | Off-by-one at the 3-day threshold                                         |
| 2. Session seed        | 16 synthetic candidates and two equivalent queues, schema-valid                                   | A/B not equivalent; stray `application-example` adds a fifth overdue item |
| 3. Facilitator setup   | Settings panel: load session and ON/OFF switch                                                    | The setting is not in the export, so the facilitator must log the variant |
| 4. Kandydaci list      | Date and "Czeka" line, banner, `?czeka` filter                                                    | Different order between ON and OFF would bias the comparison              |
| 5. Moje oferty         | Landing banner and per-job counts                                                                 | Polish plural in per-job count                                            |
| 6. E2E, docs, gate     | Browser journey, FEATURES, session script, `./scripts/verify`                                     | Playwright Chromium not provisioned                                       |
| 7. Manual verification | All manual checks in one pass, after Phases 1–6: both variants, mobile, keyboard, session dry run | Late discovery of UX issues (no per-phase manual stop)                    |

**Prerequisites:** Node 24, `npm ci`, Playwright Chromium for the e2e tests.
**Estimated effort:** about 2 sessions across 6 implementation phases plus one manual verification pass.

## Open Risks & Assumptions

- A role-play session measures salience and usability, not changed behaviour (`CASE_PROTOCOL.md:11`). exp-6 is still the behaviour test.
- Participants know they are being tested, so "handled first" partly reflects the novelty of the banner.
- The 16 synthetic candidates appear in the persona picker during the session. This is accepted.
- The reminder variant is not in the export JSON, so the facilitator records it in the session notes.
- Ages are fixed at load time, so the queue is loaded right before each round. The facilitator exports before the next load, because each load replaces the data.
- Both rounds show the same two BrightLabs job ads with different candidates, so round 2 benefits from familiarity with the jobs. A/B and ON/OFF order are counterbalanced.
- "Handled first" is scored from the export by a fixed rule: the primary rank is the first invite/reject, the secondary rank is the first live event, and only events after the recorded load time count.
- There is a strategic caveat from discovery: P11 does not explain the June drop in repurchase (sig-15).

## Success Criteria (Summary)

- In an ON round, the participant names the waiting applications without being prompted, and handles the overdue ones before the fresh ones more often than in the OFF round.
- The facilitator can set up and switch a round in under a minute, and read the handled order from the export.
- `./scripts/verify` passes, and the default app and its tests are unchanged.
