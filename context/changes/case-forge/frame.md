# Frame Brief: Case Forge — prototype of the P6 evidence card

> Framing step before /10x-plan. This document captures what is *actually*
> at issue, separated from what was initially assumed.

## Reported Observation

Discovery (opp-2): the employer gets many applications but few people worth
continuing after the first interview — continued per job 2.25 → 1.8 with ~60%
more applications; 26% of interviews are with weak candidates
(`super-brain-main/3-Projects/doroboty-ai/supersprint/week-2/06-decision.md`,
`04-ideas.md` rev. 3). Course task (`change.md`): build the needed fragment of
the prototype for a chosen role and test the task with a person.

## Initial Framing (preserved)

- **User's stated cause or approach**: two causes — the employer cannot tell
  strong from weak candidates because own work is invisible (P6), and invites
  too late (P11).
- **User's proposed direction**: build P6 (evidence card at each application)
  and P11 (reminder about applications waiting > 3 days) into the app, employer
  persona, run a scenario with a person.
- **Pre-dispatch narrowing**: leading item is **P6**; the test should show
  **both** understanding/trust **and** change of choice; the tester is a
  **person role-playing a recruiter**, not a real recruiter.

## Dimension Map

1. **Data substrate** — the app may not hold what the card is built from
   (employer criteria, candidate texts that differ in own-work evidence).
2. **Decision point** — the card must sit where the invite/reject decision is
   made; the app may decide elsewhere or show competing signals there.
3. **Test design** ← initial framing ("change of choice" with a role-player)
   — the session may be unable to answer the question discovery left open.
4. **Card content source** — prepared/AI content, verbatim quotes, the sig-14
   trap (quotes expanded by the candidate's writing assistant).

## Hypothesis Investigation

| Hypothesis | Evidence | Verdict |
| --- | --- | --- |
| 1. App data cannot feed the card | `jobSchema` has no criteria field (`src/features/prototype/model.ts:28-56`); requirements exist only as prose in `description` (`data/marketplace.json`). Seed: 2 candidates with near-identical texts (`data/people.json:9,20`), 1 application (`model.ts:228-246`). `stateSchema` is strict (`model.ts:133`) — new fields need schema change before import. `sourceNotes`/`generatedAnswer` still exist (`model.ts:116-117`). | STRONG |
| 2. Decision point shows no structured evidence | Stage actions only in detail view (`recruiting-application.tsx:32-53`); list has no actions (`workspace.tsx:413-466`). List shows name/job/stage/Match Score/summary; score+summary are fixed per persona, identical for every job (`model.ts:313-314`). No comparison view per job. | STRONG |
| 3. Role-play session cannot answer discovery's open questions | exp-3 = card correctness on June data; exp-5 = real employers, measures after real interviews (`bet-pack-opp2.md` §exp-3, §exp-5). exp-3: "nie rozstrzyga, czy pracodawca zaprosi inne osoby". No usability/clickable test planned anywhere in discovery. | STRONG |
| 4. Card content is the main risk | P6 risk "błędne cytaty, tekst asystenta" (`04-ideas.md:213,256`); sig-14 example `app-036665` (raw: "Wdrożenie prowadziła inna osoba" → final: "Uczestniczyłem w … doskonaleniu"). Card format and build rules in `materials-opp2.md` §Karta dowodów. Real criteria text available in `applications.csv` `screening_criteria_text`. | STRONG (as a constraint, not a cause) |

## Narrowing Signals

- User: the test result is meant to answer **"czy laik czyta kartę poprawnie
  i jej nie przecenia"** — a question discovery did not have. "Change of
  choice" is dropped as a goal.
- User recorded this as **exp-8** (`decisions/2026-11-08-test-zrozumienia-karty.md`,
  `bet-pack-opp2.md` §exp-8, `05-experiments.md` annotation): 6 cards with
  deliberate hard cases ("brak opisu własnego zakresu", "tekst po asystencie",
  work-split like Natalia C4, one strong), 3 non-technical people (min. 2),
  a real June job's `screening_criteria_text`, threshold "dwa" (repeated
  errors, invite-from-card-only counted separately).
- User: **exp-3 not run**; no verified cards exist. exp-8 is formally
  conditional on a favourable exp-3 ("exp-8 tylko po korzystnym exp-3").

## Cross-System Convention

`CASE_PROTOCOL.md` §Narrative: real prototype tests assess usability; prepared
outcomes do not demonstrate effectiveness. A comprehension test with a
role-player matches that convention; an "invites better candidates" claim
would not. Prepared AI content follows the existing EMP-06 pattern (local
template → editable → explicit approval, no provider call; `FEATURES.md` EMP-06,
OPS-06) and must be disclosed in the work description (`change.md`).

## Reframed (or Confirmed) Problem Statement

> **The actual problem to plan around is**: the app has no way to put a
> non-technical person in front of 6 verified, criteria-ordered evidence cards
> at the invite decision — so exp-8 (does a lay recruiter read the card
> correctly and not over-trust it) cannot be run.

The initial framing (P6 + P11, measure change of choice) held on the *idea*
(P6 is right and leading) but not on the *test*: a role-player cannot produce
evidence about invitations, and P11 is a different question (timing) that
dilutes a comprehension session. The prototype is the vehicle for exp-8, not
a demonstration that the card changes hiring outcomes.

## Confidence

**HIGH** on the reframe — all four dimensions have file-level evidence, the
user independently recorded the same reframe as exp-8, and it matches the case
protocol.

> **Superseded 2026-11-09:** the user judged exp-3 **unfavourable**
> (`decisions/2026-11-09-exp-3-niekorzystny.md` in the discovery project).
> exp-8 and exp-5 are dropped, so the reframe below ("prototype = exp-8
> vehicle") no longer holds. The bet-pack points to P10. A new frame is
> needed before /10x-plan.
>
> **Update 2026-11-09 (2):** the user deferred P10. Next step is exp-7 (P11),
> a data analysis in the discovery project
> (`decisions/2026-11-09-p10-odlozony-exp-7.md`). It needs no app change.
> case-forge has no prototype direction until exp-7 reports.

**exp-3 gate — run 2026-11-08, judged unfavourable 2026-11-09**
(`.../experiments/exp-3/results.md`). 20 blinded cards:
- Quotes: 70/70 verbatim.
- Strength: 18 strong / 2 weak. That ceiling makes the discrimination
  metrics uninformative.
- "Tekst po asystencie": 0, by construction.
- The synthetic texts are templated, and several cards are word-for-word
  identical.

Open before planning:
- the user's second-person check (`check.md`, 6 cards);
- the user's exp-3 verdict.

**The reframe below depends on that verdict.** The bet-pack counts "nie
różnicują decyzji" as *niekorzystny*. The exp-8 decision record says an
unfavourable exp-3 drops exp-8 and exp-5.

Two honest readings:
- **(a) Unfavourable, read literally.** No exp-8, and the bet-pack points to P10.
- **(b) Inconclusive.** The frozen strength rule failed, not the card. Rerun
  only the discrimination part with a new rule and a new sample.

Under (a), the course task still requires a prototype tested with a person,
but its vehicle is no longer settled. That tension is the user's call.

Only if exp-8 proceeds, constraints for its cards:
- pick 6 visibly different cards from one job;
- build the assistant-text hard case separately, because none of the 20 has it.

## What Changes for /10x-plan

Plan an employer-side exp-8 vehicle, not a P6+P11 feature: one job with real
screening criteria, ~6 synthetic applications sourced from `applications.csv`
rows covering the hard cases, a prepared (disclosed) card at the decision
point, and a session script with the exp-8 measures. Plan must decide how the
always-visible Match Score/summary is treated, because it confounds the
over-trust measure, and must keep P11 out of scope (or explicitly separate).

## References

- Source files: `src/features/prototype/model.ts:28-56,107-133,228-246,313-314`;
  `src/features/prototype/workspace.tsx:413-478`;
  `src/features/prototype/recruiting-application.tsx:32-80`;
  `src/features/prototype/application-record.tsx:50-116`;
  `src/features/prototype/employer.tsx:159-190`; `data/people.json`;
  `FEATURES.md` EMP-05..09, OPS-06/07; `docs/case/CASE_PROTOCOL.md`.
- Discovery (outside repo, `C:\workshop\super-brain-main\3-Projects\doroboty-ai\`):
  `supersprint/week-2/04-ideas.md` rev. 3 §P6/§P11, `06-decision.md`,
  `experiments/bet-pack-opp2.md` §exp-3/§exp-5/§exp-8,
  `experiments/materials-opp2.md`, `decisions/2026-11-08-test-zrozumienia-karty.md`,
  `wywiady/firmy/F1,F3,F4`, `data/applications.csv` (e.g. app-021819 strong,
  app-009049 weak, app-036665 assistant-expanded).
- Investigation tasks: data substrate, decision point, discovery test design
  (three parallel read-only agents, 2026-11-08).
- exp-3 run (gate for exp-8): `supersprint/week-2/experiments/exp-3/`
  (`protocol.md`, `results.md`, `arkusz.csv`, `check.md`, `cards_checked.json`).
