# Frame Brief: Case Forge exp-7 — prototype of P11 (reminder about waiting applications)

> Framing step before /10x-plan. This document captures what is *actually*
> at issue, separated from what was initially assumed.

## Reported Observation

Course task (`change.md`): build the needed fragment of the prototype for the
solution chosen in discovery, pick candidate or employer, run the full task
with a person on sample data. Discovery's active step is **exp-7**
(`super-brain-main/3-Projects/doroboty-ai/decisions/2026-11-09-p10-odlozony-exp-7.md`),
after exp-3 was judged unfavourable and P6/P10 dropped or deferred.

## Initial Framing (preserved)

- **User's stated cause or approach**: "exp-7 is the chosen solution" — the
  thing to prototype in doroboty-ai.
- **User's proposed direction**: build screens/behaviour for exp-7 in the app,
  with sample data and a scenario run by a person.
- **Pre-dispatch narrowing**: scope = **both, exp-7 gates the prototype**
  (exp-7 analysis in discovery; prototype of P11 only if exp-7 supports it).
  Test should show **both** that the person notices/understands waiting
  applications **and** acts sooner. "Acts sooner" = **with/without
  comparison** (one round/person sees the reminder, one does not; compare what
  they handle first).

## Dimension Map

1. **Gate status** — exp-7 is a data analysis, not a screen; it has not run,
   so the prototype has no green light yet.
2. **Gate feasibility** — exp-7 might not give a usable answer (empty buckets,
   strength-classification ceiling like exp-3).
3. **Mechanism fit** — P11 triggers on "no screening decision > 3 days"; the
   delay might sit elsewhere (after screening), making the trigger miss.
4. **App substrate** ← where the initial framing lands — the app may lack
   what a P11 screen and a with/without session need.
5. **Test design** — a role-play session may not be able to show "acts
   sooner" as behaviour.

## Hypothesis Investigation

| Hypothesis | Evidence | Verdict |
| --- | --- | --- |
| 1. Gate not run | No `experiments/exp-7/` folder; bet-pack §exp-7 "Wyniki: nie zebrano"; decision record: "exp-7 to analiza danych, nie prototyp. Nie daje jeszcze ekranu do testu z osobą". | STRONG |
| 2. Gate infeasible | Runnable: `applications.csv` has `submitted_at`, `screened_at`, `invite_sent_at`, `candidate_response_type`, `post_interview_decision`. But delay distribution is bimodal — **0 invites between 3 and 7 days** (`2026-10-30-opoznienie-zaproszenia/analysis.md` §1), so exp-7's "4–7 dni" bucket is empty. Strength classification = 28 templated variants grouped by May outcomes (`2026-10-29-co-zmienily-asystenci/analysis.md:44,65`) — ceiling not checked yet (flagged in decision record). Crude preview (this frame, not exp-7): among interviewed, continue rate late > 7 d **36.6%** (512/1 397) vs fast **31.2%** (1 108/3 553) — late invitees do not look weaker. | WEAK (feasible, with two caveats) |
| 3. Trigger misses the delay | Delay sits **before** the screening decision: late invites have median submit→screen 16 d, screen→invite 0.33 d; fast: 2 d / 0.33 d (this frame, `applications.csv`, 6 600 invites). Matches P11 trigger `screening_decision` empty (`materials-opp2.md` §exp-6). | NONE (mechanism fits) |
| 4. App lacks substrate | Present: per-application `events[{stage, at}]`, submission = `events[0].at` (`src/features/prototype/model.ts:121-124,173`); stages `submitted`/`reviewed` = no decision (`model.ts:76-106`); invite action records time (`model.ts:320-337`, `recruiting-application.tsx:37-49`). Absent: simulated clock (`transition(..., now)` exists at `model.ts:258` but `store.tsx:33` never passes it); only **1** seeded application (`model.ts:230-246`), 2 employers, no multi-job queue; `/app/kandydaci` list unsorted, no dates or waiting time (`workspace.tsx:413-466`); no reminder/notification UI anywhere (reusable: `Notice` `shell.tsx:28`, home KPI tiles `workspace.tsx:107-124`). FEATURES.md EMP-07/08/09 mention no waiting time. | STRONG |
| 5. Role-play can't show "acts sooner" | No real days pass in a session. With/without comparison is possible only if the app can stage the same queue in two variants (reminder on/off) — not possible today (dim. 4). Role-players know they are tested, so "handles flagged items first" partly measures salience, not effect. `CASE_PROTOCOL.md:11`: "Real prototype tests assess usability; prepared outcomes do not demonstrate effectiveness." | PARTIAL |

## Narrowing Signals

- User: exp-7 **gates** the prototype — prototype is planned conditionally,
  not instead of the analysis.
- User: "acts sooner" = **with/without comparison**, not stated intent and not
  "oldest first" alone. This forces two staged variants of the same queue.
- Delay-location check ruled out dimension 3: P11's trigger hits where the
  delay actually is.

## Cross-System Convention

Same shape as the previous frame (`context/changes/case-forge/frame.md`): a
role-play session tests usability/comprehension, not behaviour change
(`CASE_PROTOCOL.md:11`). A with/without session fits that convention if read
as "does the reminder make waiting applications noticed and handled first",
not "does it make employers invite faster". Discovery's own behaviour test for
P11 is exp-6 (live email, random split), which this prototype does not replace.
Strategic caveat already recorded in discovery: sig-15 does not explain the
June drop and its link to repurchase flips between months
(`02-signals.md:69`, `04-ideas.md` §P11).

## Reframed (or Confirmed) Problem Statement

> **The actual problem to plan around is**: P11 has no green light yet
> (exp-7 unrun, though a crude preview is favourable), and the app cannot
> stage an employer queue with simulated waiting time in two variants
> (reminder on / off) — so the with/without session the user wants cannot be
> run.

The initial framing ("prototype exp-7") mixed a data analysis with a screen.
Split: exp-7 is a 1–2 day analysis in discovery that decides go/no-go; the
prototype is P11 for the **employer** persona. The app has the timestamps but
not the clock, the seeded queue, the waiting-time view or the reminder — and
the session needs a controlled off-variant to compare against.

## Confidence

**MEDIUM.** Substrate and gate evidence are file-level and strong; mechanism
fit is verified on data. Weaker: exp-7 itself is unrun (preview is crude — no
strength split, no month split, "idziemy dalej" only among interviewed), and
with/without role-play measures salience more than effect.

Verification before /10x-plan: run exp-7 in discovery (two buckets ≤ 3 d /
> 7 d, since 4–7 d is empty; check the strength classification for a ceiling
first). If unfavourable, opp-2 has no active idea and this change has no
prototype direction.

> **Update 2026-11-09:** exp-7 run
> (`super-brain-main/.../experiments/exp-7/results.md`). **Favourable**:
> late invitees have strong own-work text in 57–58% vs 61.5% for fast, and
> continue after interview 36–38% vs 31%. No narrowing to a subset of jobs.
> Estimated gain is +0.17 continued per job. User verdict: **favourable**
> (`super-brain-main/.../decisions/2026-11-09-exp-7-korzystny.md`). The gate
> is open: plan the P11 employer prototype. exp-6 is selected in discovery.

## What Changes for /10x-plan

Plan only after a favourable (or mixed) exp-7. Then plan an employer-side
P11 session vehicle, not a production reminder: fixed demo "now", a seeded
multi-job queue with applications under and over 3 days without decision,
waiting time visible, and a reminder that can be switched off for the
comparison round; disclose prepared data in the work description. P6/P10 stay
out of scope.

## References

- Source files: `src/features/prototype/model.ts:76-106,121-124,173,230-246,258-263,320-337`;
  `src/features/prototype/store.tsx:33`; `src/features/prototype/workspace.tsx:107-124,413-466`;
  `src/features/prototype/recruiting-application.tsx:37-49`; `src/features/prototype/shell.tsx:28`;
  `FEATURES.md` EMP-01, EMP-07..09; `docs/case/CASE_PROTOCOL.md:11`.
- Discovery (outside repo, `C:\workshop\super-brain-main\3-Projects\doroboty-ai\`):
  `decisions/2026-11-09-p10-odlozony-exp-7.md`, `decisions/2026-11-09-exp-3-niekorzystny.md`,
  `supersprint/week-2/experiments/bet-pack-opp2.md` §exp-7/§exp-6,
  `experiments/materials-opp2.md` §Przypomnienie, `04-ideas.md` §P11,
  `signals/quantitative/analysis/2026-10-30-opoznienie-zaproszenia/analysis.md`,
  `signals/quantitative/analysis/2026-10-29-co-zmienily-asystenci/analysis.md`, `data/applications.csv`.
- Prior frame: `context/changes/case-forge/frame.md`.
- Investigation: app-substrate read-only agent; delay-location and crude
  continue-rate check (Python script, job tmp, not saved in repo), 2026-11-09.
