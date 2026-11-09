# P11 Waiting-Application Reminder — Employer Session Prototype Implementation Plan

## Overview

Build an employer-side session vehicle for discovery idea **P11** (reminder about applications waiting more than 3 days without a decision). exp-7 judged the idea favourable (`super-brain-main/3-Projects/doroboty-ai/decisions/2026-11-09-exp-7-korzystny.md`), so the gate is open. The prototype lets a facilitator load one of two equivalent synthetic queues (A or B, both on BrightLabs) before each round, switch the reminder on or off per round, and run a with/without session. The session tests whether the employer notices and understands the waiting applications, and whether they handle them first. It does not prove that real employers invite faster; exp-6 (live email, random split) remains discovery's behaviour test.

## Current State Analysis

From the frame (`context/changes/case-forge-exp-7/frame.md`, Hypothesis 4) plus verification in this planning session:

- Applications carry `events[{stage, at, note}]`, and the submission time is `events[0].at` (`src/features/prototype/model.ts:121-124,173`). The stages `submitted` and `reviewed` mean that no invite or reject decision has been made yet (`model.ts:76-106`).
- `transition(state, action, now = new Date().toISOString())` (`model.ts:258-263`) stamps every stage change with real time. `store.run` never passes `now` (`store.tsx:31-43`).
- `initialState()` seeds exactly one application (`model.ts:218-248`), and tests depend on that:
  - `model.test.ts:36` checks `toHaveLength(1)`;
  - `tests/e2e/prototype.spec.ts:166` asserts that "Marek Nowak" is absent after reject;
  - e2e uses `application-example` at lines 167, 691 and 766.
- Schema limits:
  - `candidateId` must be a candidate persona, and each `candidateId:jobId` pair must be unique (`model.ts:156-172`). With 2 candidates and 2 jobs per employer, each employer can have at most 4 applications today.
  - `version: z.literal(1)` (`model.ts:135`) is shared by localStorage, import and export (`storage.ts`).
- `/app/kandydaci` (`workspace.tsx` `ApplicationsPage`, about lines 413-466) shows cards in insertion order. Each card has a name link, job title, stage, `MatchScore` and summary. It shows no dates and no waiting time. It already reads `useSearchParams` (`?wyslano`).
- After choosing an employer persona, the picker opens `/app/oferty` (`workspace.tsx` `PersonPicker`). `EmployerJobs` (`employer.tsx:19-65`) lists jobs as cards that show the application count and status.
- Settings (`settings.tsx:18-131`) already provides reset, import and export with a `ConfirmDialog`. The store's `commit(next, replace = false)` (`store.tsx:18-30`) replaces state and, when called with `replace = true` (as `reset` does, `store.tsx:66`), also clears the blocked flag.
- Job dates:
  - `expiryAt` is not enforced anywhere in the UI (grep: only schema, types and the editor default).
  - The BrightLabs and Northstar jobs were published between 2026-09-10 and 2026-09-28, so seeded submissions up to 16 days before 2026-11-09 come after publication.
- No reminder or notification UI exists. `Notice` (`shell.tsx:28`) is a `role="status"` box.
- Nocny błękit recipe for P11 (`.claude/skills/nocny-blekit/references/screens.md` §6):
  - Banner: 3px cobalt bar on the left, cobalt-tint background and a steel clock icon. Text "N zgłoszenia czekają ponad 3 dni" (number in weight 600), plus a text button "Pokaż je".
  - Waiting cell: the day count in weight 600 with a cobalt clock icon.
  - No red, no exclamation marks, no animation.
  - Host tokens: cobalt `--gui-color-1` / `--primary` `#1f3fbf`, tint `--gui-color-1-transparent` `#e8edfb` (`tokens.css:100,118`).
- Discovery's reminder trigger uses "`screening_decision` empty, > 3 days". The mail copy is in `materials-opp2.md` §Przypomnienie.

## Desired End State

Before each round, a facilitator opens Ustawienia → "Sesja testowa P11", loads queue A or queue B (both on BrightLabs's two jobs, different candidates) and sets the reminder for the round. Then the participant enters as Karolina Wiśniewska (BrightLabs). Loading the next queue replaces the previous round's data, so the facilitator exports after each round.

**Reminder ON:**
- "Moje oferty" shows a banner "4 zgłoszenia czekają ponad 3 dni · Pokaż je", and each job card shows how many of its applications are waiting.
- "Kandydaci" shows the same banner. Each card has the line "Zgłoszenie 3 lis 2026 · Czeka 6 dni" with a cobalt clock icon when the wait is over 3 days.
- "Pokaż je" opens `/app/kandydaci?czeka`, filtered to the waiting applications.

**Reminder OFF:**
- No banner, no per-job waiting count, no "Czeka" cue, and `?czeka` is ignored.
- Each card still shows "Zgłoszenie <date>".
- List order is identical in both variants.

**Clearing:** inviting or rejecting an application removes it from the waiting count immediately and after reload. "W przeglądzie" does not clear it.

**Measurement:** each stage change keeps its real timestamp. A round's export JSON therefore shows the order in which applications were handled.

The default app (`initialState`, the existing tests, the baseline packet and the employer pages without a loaded session) is unchanged. Verify with `./scripts/verify` plus the manual session dry run (Phase 7).

### Key Discoveries:

- `transition` already takes `now`. Freezing it would collapse the action order that the comparison needs, so only the display uses the reference time and actions keep real time (`model.ts:258-263`, `store.tsx:33`).
- Changing `initialState` would break `model.test.ts:36` and e2e lines 166-167. Load the session through a separate builder plus the existing replace-commit path instead (`store.tsx:18-30,66`).
- The schema demands one persona per seeded candidate. Synthetic candidates must live in the session seed only, not in `people.json` (`model.ts:156-171`).
- The hash router already passes query params to `ApplicationsPage` (`?wyslano`), so `?czeka` follows that pattern.

## What We're NOT Doing

- No email, no notification delivery, no scheduler and no real background clock. The reminder is in-app only, as a stand-in for the exp-6 mail.
- No change to `initialState`, `people.json`, `marketplace.json`, the stage machine, `State` version or the import/export format.
- No experiment assignment, exposure logging or release picker (FEATURES OPS-05 is Removed; `CASE_PROTOCOL.md` bans release pickers). The ON/OFF switch is a facilitator setting labelled as simulation.
- No sort-by-waiting in either variant. No table redesign of `/app/kandydaci` (cards stay).
- No waiting cue on the application detail page `/app/kandydaci/:id` or on the employer home KPI tiles.
- No P6/P10 work, no candidate-side change and no automatic analysis of the export (the facilitator reads it).
- No hiding of the synthetic session candidates from the persona picker.

## Implementation Approach

Keep everything P11-specific in a new pure module plus one data file. The store gains two things that stay out of the persisted `State`:
- a `loadP11Session(queue)` action that replaces state through the existing replace-commit;
- a `reminder` boolean persisted under its own localStorage key, default ON.

The UI reads waiting status by calling the pure helpers with `Date.now()` at render. The seed is built relative to load time, so "Czeka N dni" stays correct whenever the session is run.

**Verification order:** Phases 1–6 carry only automated checks and run back to back. All manual checks are collected in Phase 7 and done once, after everything is implemented.

Two queues, one loaded per round, both on the BrightLabs employer persona:
- Queue A and queue B both use BrightLabs jobs `…0001` (AI Product Manager) and `…0004` (AI Operations Specialist), so role type is identical across rounds.
- Both have the same wait profile, mirrored scores and the same position pattern.
- Each queue has different candidate names, so round 2 does not repeat round 1's people. The job ads do repeat; that learning effect is handled by counterbalancing A/B and ON/OFF order.
- Each round starts with a fresh load, which also resets waiting ages to load time.

## Critical Implementation Details

- **State sequencing.** Every seeded event must be strictly before load time, because the schema rejects `after.at < before.at` (`model.ts:184`) and later actions use real time. Seed submissions at `now − N days − 2 h`. Never seed a wait of exactly 3 days, so the label ("Czeka 3 dni") and the count can't disagree.
- **Threshold definition.** `waitingDays = floor((now − events[0].at) / 86 400 000)`.
  - Waiting: the stage is `submitted` or `reviewed`.
  - Overdue: waiting and `waitingDays > 3`.
  - Use this one function for the banner, the per-job count, the `?czeka` filter and the card cue.
- **Polish plurals.** Use `Intl.PluralRules("pl-PL")`: one → "zgłoszenie czeka", few → "zgłoszenia czekają", many → "zgłoszeń czeka", plus "1 dzień" / "N dni". The recipe's "2–4" shortcut is wrong for 12–14 and 22–24.
- **Baseline isolation.** Every P11 UI element is gated on `isP11Session(state)`: the date line, banner, "Czeka" cue, per-job counts and `?czeka` filter. `isP11Session` is true when any person id starts with `p11-`. Without the gate, the baseline `application-example` (fixed date 2026-11-02) would show a growing "Czeka N dni" banner on every normal employer visit and change the existing e2e journeys. With no session loaded, employer pages render exactly as today.
- **Queue equivalence beyond numbers.** Mirror answer and CV length and quality per position across A and B, not only days, stage and score. Both queues use the same two BrightLabs jobs, so the same position in A and B applies to the same job.
- **Order neutrality.** Interleave seed insertion order so that overdue items are neither first nor clustered. Use the same pattern in A and B. Spread scores across overdue and fresh items, so "handled first" can't be explained by score.

## Phase 1: Waiting logic

### Overview

Record intent, then add pure waiting-time helpers and the reminder-variant storage helper, with unit tests. No UI.

### Changes Required:

#### 1. Task note

**File**: `docs/tasks/p11-waiting-reminder.md`

**Intent**: Durable intent and acceptance criteria, as AGENTS.md requires. Link to this plan and the frame.

**Contract**: Sections: Intent, Acceptance criteria (the Desired End State bullets), Out of scope, Evidence (filled in Phase 6).

#### 2. P11 domain module

**File**: `src/features/prototype/p11.ts` (new)

**Intent**: Single source for waiting status, plural copy and the variant key.

**Contract**:
- Exports `WAIT_THRESHOLD_DAYS = 3`.
- `waitingDays(application, now: Date): number`.
- `isWaiting(application): boolean` (stage `submitted` | `reviewed`).
- `isOverdue(application, now): boolean`.
- `isP11Session(state): boolean` (any person id starts with `p11-`).
- `overdueApplications(applications, now)`.
- `waitingSummary(count): string`, e.g. "4 zgłoszenia czekają ponad 3 dni".
- `daysLabel(n): string`, e.g. "Czeka 6 dni" / "Czeka 1 dzień".
- `waitingCountLabel(n): string` for the per-job meta line: "1 czeka ponad 3 dni", "2 czekają ponad 3 dni", "5 czeka ponad 3 dni" (same `Intl.PluralRules` categories as `waitingSummary`).
- `REMINDER_STORAGE_KEY = "doroboty.p11.reminder"`.
- `readReminder(storage: StoragePort | null): boolean` (default `true`; `"off"` → false; on error → true).
- `writeReminder(storage, on)`. It must not throw to callers; it returns `false` on failure.

#### 3. Unit tests

**File**: `src/features/prototype/p11.test.ts` (new)

**Intent**: Pin threshold edges and copy.

**Contract**:
- Threshold: 3 days + 23 h is not overdue; 4 days is overdue.
- `reviewed` still waits; `interview_invited`, `rejected` and `withdrawn` don't.
- Plurals for 1, 2, 4, 5, 12, 22 and 25, for `waitingSummary`, `daysLabel` and `waitingCountLabel`.
- `readReminder` defaults and handles a storage that throws.

### Success Criteria:

#### Automated Verification:

- Unit tests pass: `npx vitest run src/features/prototype/p11.test.ts`
- Types pass: `npm run typecheck`
- Lint passes: `npm run lint`

---

## Phase 2: Session seed

### Overview

Two equivalent synthetic queues and a builder that returns a valid `State`.

### Changes Required:

#### 1. Seed data

**File**: `src/features/prototype/data/p11-session.json` (new)

**Intent**: Synthetic, clearly fictional session data. It is Polish user-facing text.

**Contract**:
- 16 candidate personas, `id` prefix `p11-`, each with `name`, `headline`, `bio`, `location`, `cv` (≥ 20 chars), `exampleScore` and `exampleSummary`.
- 16 application templates with `queue: "A" | "B"`, `candidateId`, `jobId`, `answer` (≥ 20 chars) and `daysAgo`. Handled ones also carry `history: [{stage, daysAgo, note}]`.
- Both queues use BrightLabs jobs `…0001` and `…0004`; each candidate appears once, so `candidateId:jobId` stays unique.
- Per queue, 8 applications:
  - 4 overdue (4, 6, 9, 16 days; mixed `submitted` / `reviewed`);
  - 2 fresh (1 and 2 days);
  - 1 invited, with history submitted 10 d → reviewed 9 d → interview_invited 8 d (the schema rejects submitted → interview_invited, `model.ts:97-99,178-183`);
  - 1 rejected (submitted 12 d → rejected 11 d; this direct transition is legal).
  - The overdue applications are split across both jobs.
- B mirrors A position by position: same days, stages and score.

#### 2. Session builder

**File**: `src/features/prototype/p11.ts`

**Intent**: Build the full session state from the baseline marketplace plus the seed, relative to `now`.

**Contract**:
- `buildP11Session(now: Date, queue: "A" | "B"): State`. It starts from `initialState()` with `activePersonId: null`, **removes** `application-example`, appends all 16 seed personas, and appends only the chosen queue's 8 applications. The example has a fixed date of 2026-11-02 on BrightLabs job `…0001`. It would add a fifth overdue item to queue A and break A/B equivalence.
- Event times are `now − daysAgo days − 2 h`. Seeded `jobTitle` and `candidateName` are snapshots.
- The result goes through `stateSchema.parse`.

#### 3. Seed tests

**File**: `src/features/prototype/p11.test.ts`

**Intent**: Guard validity and A/B equivalence.

**Contract**:
- For `now` = 2026-11-09 and 2026-12-31, and for each queue:
  - `stateSchema` parses;
  - every submission comes after its job's `publishedAt`;
  - every seeded event is before `now`;
  - queue A and queue B have the same multiset of (waitingDays, stage, score) and the same overdue positions.
- The first item of each queue is not overdue.
- Each loaded queue has exactly 4 overdue applications, all on BrightLabs; Northstar and Plain Sight have none; the session contains no `application-example`.
- `initialState()` is unchanged: 1 application.

### Success Criteria:

#### Automated Verification:

- Seed and logic tests pass: `npx vitest run src/features/prototype/p11.test.ts`
- Existing unit suite still passes: `npm test`
- Participant packet check still passes after the new JSON lands: `npm run verify:packet`
- Types pass: `npm run typecheck`

---

## Phase 3: Facilitator setup

### Overview

Store support and a Settings section to load the session and set the reminder for the round.

### Changes Required:

#### 1. Store

**File**: `src/features/prototype/store.tsx`

**Intent**: Load the session through the same replace-commit as reset. Hold the reminder flag outside `State`.

**Contract**:
- The store adds `loadP11Session(queue: "A" | "B")`, which calls `commit(buildP11Session(new Date(), queue), true)`.
- It adds `reminder: boolean`, initialized by `readReminder(browserStorage())`.
- It adds `setReminder(on)`, which updates state and calls `writeReminder`.
- `State`, `saveState` and the export format are unchanged.

#### 2. Settings section

**File**: `src/features/prototype/settings.tsx`

**Intent**: Facilitator controls, labelled as simulation.

**Contract**: A new panel "Sesja testowa P11" after "Dane scenariusza":
- One sentence explaining that loading replaces local data with one synthetic BrightLabs queue (A or B), that ages are counted from load time, and that the previous round must be exported first.
- Two buttons, "Załaduj kolejkę A" and "Załaduj kolejkę B". Each opens the existing `ConfirmDialog`; the `pending` union becomes `"reset" | "import" | "p11-A" | "p11-B"`.
  - `confirm()`, the dialog title, description and label switch explicitly on every case. Today they are binary (`settings.tsx:40-48,108-110`), so a p11 value would otherwise fall into `importState(raw)`.
  - After loading, show the status "Załadowano sesję P11 · kolejka A · HH:MM (UTC 2026-11-09T13:05Z)": local time plus the UTC ISO time in the export's format, so the facilitator can compare it directly with `events[].at` when scoring.
- A checkbox "Przypomnienie o czekających zgłoszeniach w tej rundzie" bound to `reminder`, with a status line "Przypomnienie: włączone / wyłączone".
  - When `writeReminder` returns `false`, show an error (`role="alert"`): "Nie udało się zapisać ustawienia — po odświeżeniu przypomnienie wróci do „włączone”." Without it, an OFF round silently reverts to ON after a reload.
- The hint "Ustawienie nie trafia do eksportu — zapisz wariant rundy w notatkach sesji."
- Use the existing `Checkbox` and `Button` primitives.

### Success Criteria:

#### Automated Verification:

- Types, lint and unit tests pass: `npm run typecheck && npm run lint && npm test`
- Format passes: `npm run format:check`

---

## Phase 4: Kandydaci list

### Overview

Waiting cue, banner and filter on `/app/kandydaci` for employers.

### Changes Required:

#### 1. Reminder banner component

**File**: `src/features/prototype/waiting-reminder.tsx` (new)

**Intent**: The recipe banner, reused on two pages.

**Contract**:
- `WaitingReminder({ count, to?: string })` renders nothing when `count === 0`.
- Markup is a `<section aria-label="Przypomnienie o czekających zgłoszeniach">` with a lucide `Clock` (steel, `aria-hidden`), the `waitingSummary(count)` text with the number in weight 600, and an optional `Link` "Pokaż je".
- Styles live in `src/app/workspace.css`:
  - 3px left bar `var(--gui-color-1)`, background `var(--gui-color-1-transparent)`;
  - no red, no animation;
  - spacing from `--gui-space-*`.

#### 2. Applications list

**File**: `src/features/prototype/workspace.tsx` (`ApplicationsPage`)

**Intent**: Show the submission date always, and the waiting cue, banner and filter only when the reminder is ON.

**Contract**: For employer only, and only when `isP11Session(state)`. Without a session the page is unchanged.
- Each card gets the facts line "Zgłoszenie {date pl-PL}". When reminder ON and the application is waiting, it adds " · {daysLabel}". When overdue, a cobalt `Clock` icon is added and the days are in weight 600.
- Banner above the search field when reminder ON. `to` = `/app/kandydaci?czeka` unless already filtered. When filtered, show the banner without the link, plus the text link "Pokaż wszystkie zgłoszenia".
- `?czeka` with reminder ON → show only overdue; with reminder OFF → ignore it.
- Order stays insertion order; the search filter keeps working.
- The candidate view (`employer = false`) is unchanged.

### Success Criteria:

#### Automated Verification:

- Types, lint and unit tests pass: `npm run typecheck && npm run lint && npm test`
- Existing e2e journeys still pass unchanged (no session loaded, so baseline Kandydaci is identical): `npm run test:e2e`

---

## Phase 5: Moje oferty landing

### Overview

Make the reminder visible on the employer's first screen.

### Changes Required:

#### 1. Employer jobs list

**File**: `src/features/prototype/employer.tsx` (`EmployerJobs`)

**Intent**: The banner shows the company-wide overdue count, and each job card shows its own count.

**Contract**:
- Only when `isP11Session(state)` and reminder ON: `WaitingReminder` with the company-wide overdue count and `to="/app/kandydaci?czeka"`, placed above the job list.
- Each job card's meta line appends " · {waitingCountLabel(n)}" when n > 0 (e.g. "2 czekają ponad 3 dni"; helper defined and tested in Phase 1).
- When reminder OFF or with no session: unchanged from today.

### Success Criteria:

#### Automated Verification:

- Types, lint and unit tests pass: `npm run typecheck && npm run lint && npm test`

---

## Phase 6: E2E, docs and gate

### Overview

Browser proof, behaviour register, session script with data disclosure, and the full gate.

### Changes Required:

#### 1. Browser journey

**File**: `tests/e2e/prototype.spec.ts`

**Intent**: One journey covering the session lifecycle.

**Contract**:
1. Settings → "Załaduj kolejkę A" → confirm → enter as Karolina Wiśniewska → landing banner "4 zgłoszenia czekają ponad 3 dni".
2. "Pokaż je" → 4 cards → invite one (Aplikacja wysłana → W przeglądzie → Zaproszenie, or directly from `reviewed`) → banner 3.
3. Reload → still 3.
4. Settings → uncheck reminder → Kandydaci has no banner, no "Czeka", and the card order matches ON.
5. Run an axe check on Kandydaci with the reminder ON.
6. Take a 390px screenshot to `artifacts/`.

#### 2. Behaviour register

**File**: `FEATURES.md`

**Intent**: Describe actual behaviour; stable IDs are preserved.

**Contract**:
- Update EMP-04 (landing waiting counts) and EMP-07 (submission date, waiting cue, `?czeka` filter).
- Update EMP-10 (Settings gains the "Sesja testowa P11" panel).
- Update SYS-10 (P11 session load, reminder key outside export).
- Add **EMP-11 · Simulated · P11 waiting reminder**. It covers: in-app only, threshold > 3 days until invite or reject, facilitator ON/OFF, synthetic two-queue seed relative to load time, no email or exposure logging. Source/test refs: `p11.ts`, `p11.test.ts`, the e2e test name.

#### 3. Session script

**File**: `context/changes/case-forge-exp-7/session.md` (new, Polish)

**Intent**: The facilitator scenario the course asks for, including the prepared-data disclosure.

**Contract**:
- Goal and success signals (noticed/understood; overdue handled first in ON vs OFF).
- Setup per round: load the round's queue (A or B) **immediately before the round**, because ages are fixed at load time and loading about 46 hours early turns the 2-day fresh application into an overdue one. Loading replaces the previous round's data, so **export JSON before loading the next queue**. The facilitator sets the variant in Settings before handing over, so the participant never sees the switch. Counterbalance both A/B order and ON/OFF order between participants. The participant always enters as Karolina Wiśniewska (BrightLabs).
- A neutral task instruction ("Przejrzyj zgłoszenia i podejmij decyzje, które uważasz za potrzebne", without the word "czeka").
- Scoring rule (defined before any session):
  - Record the UTC load time shown in the status "Załadowano sesję P11 · kolejka X · HH:MM (UTC …Z)". `events[].at` is UTC, so compare against the UTC value, not the local time. Only events after the load time are live clicks. Every seeded event is at least 26 h older than load time, which gives a second way to separate them.
  - **Primary rank:** order of the first `interview_invited` or `rejected` event per application. Compare the share of overdue applications among the first 4 decisions, ON vs OFF.
  - **Secondary rank:** order of the first live event of any kind (including "W przeglądzie"), because a `submitted` application needs "W przeglądzie" before an invite.
  - Opening an application leaves no event, so the observer notes the first application opened by hand.
- Observation sheet columns: participant, round, queue, variant, load time, first application opened, unprompted mention of waiting applications (yes/no, quote), notes. After each round, export JSON and fill in both ranks from it.
- Debrief questions.
- Limitation: both rounds show the same two BrightLabs job ads with different candidates, so round 2 benefits from familiarity with the jobs. Counterbalancing spreads this across ON and OFF.
- Disclosure: synthetic candidates and applications, waiting ages computed from load time, fixed scenario Match Scores and summaries (prepared, not AI-generated live), no email sent.
- Limits per `CASE_PROTOCOL.md:11`: role-play measures salience and usability, not effect; exp-6 is the behaviour test.

#### 4. Task note evidence

**File**: `docs/tasks/p11-waiting-reminder.md`

**Intent**: Record the commands that actually ran and their results, the screenshots and the dry-run notes.

### Success Criteria:

#### Automated Verification:

- Full gate passes: `./scripts/verify` (format, design-system check, lint, typecheck, unit, packet, build, e2e)
- Poster People kit untouched: `npm run design-system:check`
- If Playwright Chromium is missing, report it; do not install OS dependencies

---

## Phase 7: Manual verification (after all phases)

### Overview

All manual checks happen here, once Phases 1–6 are implemented and their automated checks pass. Phases 1–6 do not pause for manual confirmation; the implementer moves straight to the next phase after its automated verification passes.

### Success Criteria:

#### Manual Verification:

- Task note reads as accurate intent and acceptance criteria
- Seed copy reads as plausible, synthetic Polish candidate data, with no real persons
- Without loading the session, employer Moje oferty and Kandydaci look exactly as before (no date line, no banner)
- Load queue A → confirm → the status shows queue and load time; the persona picker lists the employers; after a reload the session data persists
- The reminder checkbox state survives a reload; keyboard-only operation works (Tab, Space, Enter in the dialog)
- Queue A with reminder ON: banner reads "4 zgłoszenia czekają ponad 3 dni"; the 4 overdue cards show the cobalt clock and "Czeka N dni"
- "Pokaż je" filters to 4 cards; "Pokaż wszystkie zgłoszenia" restores the list in the same order
- Invite one overdue application → back to the list → count 3. Mark one "W przeglądzie" → count unchanged
- BrightLabs landing banner shows 4 and per-job counts add up to 4; "Pokaż je" lands on the filtered list
- Load queue B → BrightLabs shows queue B's candidates (none from A) with 4 overdue; Northstar shows no session applications
- Reminder OFF: no banner, no per-job counts, no "Czeka"; dates visible on Kandydaci; same order as ON; landing identical to today
- Desktop and 390px mobile pass of the Settings panel, landing and Kandydaci in both variants: lines wrap, no horizontal scroll, focus visible, keyboard reachability
- Dry run of the full session script, two rounds (A with ON, B with OFF) on desktop; export after each round can be scored with the primary and secondary ranks
- FEATURES entries match the observed behaviour
- Reviewed diff before claiming completion

---

## Testing Strategy

### Unit Tests:

- Threshold edges: 3 d 23 h not overdue, 4 d overdue.
- Stage coverage: `submitted` and `reviewed` wait; invite, reject and withdrawn don't.
- Plurals: 1, 2, 4, 5, 12, 22 and 25; "dzień" vs "dni".
- `readReminder` default and throwing storage.
- Seed: schema-valid at two dates, submissions after publish, events before `now`, A/B equivalence, first item not overdue, 4 overdue per loaded queue (all on BrightLabs), `initialState` unchanged.

### Integration Tests:

- E2E journey: load → ON banners → filter → invite clears → reload persists → OFF hides cues with identical order → axe → mobile screenshot.

### Manual Testing Steps:

1. Settings → "Załaduj kolejkę A" → confirm. Keep reminder ON. Enter as Karolina Wiśniewska.
2. Check the landing banner (4) and the per-job counts. Click "Pokaż je".
3. Invite one overdue application and reject another. Return: count 2. Mark a fresh one "W przeglądzie": count still 2.
4. Export JSON and confirm that live event timestamps (after the shown load time) reflect the click order.
5. Settings → "Załaduj kolejkę B" → confirm → uncheck the reminder. Enter as Karolina Wiśniewska: queue B candidates, no banner, no "Czeka", dates visible.
6. Repeat 1–5 at 390px width, keyboard only.

## Performance Considerations

Negligible: at most about 20 applications, so the waiting functions are computed on each render without memoization. The state size increase is far below the 2 MB limit.

## Migration Notes

There is no migration. `State` stays version 1. Existing saves keep working, and the session appears only after the facilitator loads it. The reminder key is a separate optional localStorage entry. "Resetuj scenariusz" returns to the baseline but keeps the reminder setting.

## References

- Frame: `context/changes/case-forge-exp-7/frame.md`
- Gate decision: `super-brain-main/3-Projects/doroboty-ai/decisions/2026-11-09-exp-7-korzystny.md`
- Reminder spec and mail copy: `super-brain-main/.../supersprint/week-2/experiments/materials-opp2.md` §Przypomnienie
- Screen recipe: `.claude/skills/nocny-blekit/references/screens.md` §6
- Code: `src/features/prototype/model.ts:76-106,133-196,218-263`; `store.tsx:18-67`; `settings.tsx:18-116`; `workspace.tsx` `ApplicationsPage`; `employer.tsx:19-65`; `tokens.css:100,118`
- Protocol: `docs/case/CASE_PROTOCOL.md:11`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Waiting logic

#### Automated

- [x] 1.1 Unit tests pass: `npx vitest run src/features/prototype/p11.test.ts` — d9e8af9
- [x] 1.2 Types pass: `npm run typecheck` — d9e8af9
- [x] 1.3 Lint passes: `npm run lint` — d9e8af9

### Phase 2: Session seed

#### Automated

- [x] 2.1 Seed and logic tests pass: `npx vitest run src/features/prototype/p11.test.ts` — c79e771
- [x] 2.2 Existing unit suite still passes: `npm test` — c79e771
- [x] 2.3 Types pass: `npm run typecheck` — c79e771
- [x] 2.4 Participant packet check passes: `npm run verify:packet` — c79e771

### Phase 3: Facilitator setup

#### Automated

- [x] 3.1 Types, lint and unit tests pass — c5f17bd
- [x] 3.2 Format passes: `npm run format:check` — c5f17bd

### Phase 4: Kandydaci list

#### Automated

- [x] 4.1 Types, lint and unit tests pass
- [x] 4.2 Existing e2e journeys still pass unchanged: `npm run test:e2e`

### Phase 5: Moje oferty landing

#### Automated

- [ ] 5.1 Types, lint and unit tests pass

### Phase 6: E2E, docs and gate

#### Automated

- [ ] 6.1 Full gate passes: `./scripts/verify`
- [ ] 6.2 Poster People kit untouched: `npm run design-system:check`
- [ ] 6.3 Missing Playwright Chromium reported, not installed

### Phase 7: Manual verification (after all phases)

#### Manual

- [ ] 7.1 Task note reads as accurate intent and acceptance criteria
- [ ] 7.2 Seed copy reads as plausible, synthetic Polish candidate data, with no real persons
- [ ] 7.3 Without loading the session, employer Moje oferty and Kandydaci look exactly as before (no date line, no banner)
- [ ] 7.4 Load queue A → confirm → the status shows queue and load time; the persona picker lists the employers; after a reload the session data persists
- [ ] 7.5 The reminder checkbox state survives a reload; keyboard-only operation works (Tab, Space, Enter in the dialog)
- [ ] 7.6 Queue A with reminder ON: banner reads "4 zgłoszenia czekają ponad 3 dni"; the 4 overdue cards show the cobalt clock and "Czeka N dni"
- [ ] 7.7 "Pokaż je" filters to 4 cards; "Pokaż wszystkie zgłoszenia" restores the list in the same order
- [ ] 7.8 Invite one overdue application → back to the list → count 3. Mark one "W przeglądzie" → count unchanged
- [ ] 7.9 BrightLabs landing banner shows 4 and per-job counts add up to 4; "Pokaż je" lands on the filtered list
- [ ] 7.10 Load queue B → BrightLabs shows queue B's candidates (none from A) with 4 overdue; Northstar shows no session applications
- [ ] 7.11 Reminder OFF: no banner, no per-job counts, no "Czeka"; dates visible on Kandydaci; same order as ON; landing identical to today
- [ ] 7.12 Desktop and 390px mobile pass of the Settings panel, landing and Kandydaci in both variants: lines wrap, no horizontal scroll, focus visible, keyboard reachability
- [ ] 7.13 Dry run of the full session script, two rounds (A with ON, B with OFF) on desktop; export after each round can be scored with the primary and secondary ranks
- [ ] 7.14 FEATURES entries match the observed behaviour
- [ ] 7.15 Reviewed diff before claiming completion
