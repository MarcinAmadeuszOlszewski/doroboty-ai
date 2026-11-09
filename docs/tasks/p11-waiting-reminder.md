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

## Evidence

Filled in at the end of Phase 6.
