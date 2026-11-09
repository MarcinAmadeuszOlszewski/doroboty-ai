import { z } from "zod";
import {
  initialState,
  stateSchema,
  type Application,
  type Person,
  type Stage,
  type State,
} from "./model";
import type { StoragePort } from "./storage";
import session from "./data/p11-session.json" with { type: "json" };

export const WAIT_THRESHOLD_DAYS = 3;
export const REMINDER_STORAGE_KEY = "doroboty.p11.reminder";
const DAY_MS = 86_400_000;
const plurals = new Intl.PluralRules("pl-PL");

export function waitingDays(application: Application, now: Date): number {
  const submittedAt = Date.parse(application.events[0].at);
  return Math.max(0, Math.floor((now.getTime() - submittedAt) / DAY_MS));
}
export function isWaiting(application: Application): boolean {
  return application.stage === "submitted" || application.stage === "reviewed";
}
export function isOverdue(application: Application, now: Date): boolean {
  return isWaiting(application) && waitingDays(application, now) > WAIT_THRESHOLD_DAYS;
}
export function isP11Session(state: State): boolean {
  return state.people.some((person) => person.id.startsWith("p11-"));
}
export function overdueApplications(applications: Application[], now: Date): Application[] {
  return applications.filter((application) => isOverdue(application, now));
}
function pluralForm(n: number, one: string, few: string, many: string): string {
  const category = plurals.select(n);
  return category === "one" ? one : category === "few" ? few : many;
}
export function waitingSummary(count: number): string {
  return `${count} ${pluralForm(count, "zgłoszenie czeka", "zgłoszenia czekają", "zgłoszeń czeka")} ponad ${WAIT_THRESHOLD_DAYS} dni`;
}
export function daysLabel(n: number): string {
  return `Czeka ${n} ${n === 1 ? "dzień" : "dni"}`;
}
export function waitingCountLabel(n: number): string {
  return `${n} ${pluralForm(n, "czeka", "czekają", "czeka")} ponad ${WAIT_THRESHOLD_DAYS} dni`;
}

export function readReminder(storage: StoragePort | null): boolean {
  if (!storage) return true;
  try {
    return storage.getItem(REMINDER_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}
export function writeReminder(storage: StoragePort | null, on: boolean): boolean {
  if (!storage) return false;
  try {
    storage.setItem(REMINDER_STORAGE_KEY, on ? "on" : "off");
    return true;
  } catch {
    return false;
  }
}

export type P11Queue = "A" | "B";
export const P11_QUEUES: readonly P11Queue[] = ["A", "B"];

const seedSchema = z.object({
  personas: z
    .array(
      z.object({
        id: z.string().startsWith("p11-"),
        role: z.literal("candidate"),
        name: z.string(),
        headline: z.string(),
        bio: z.string(),
        location: z.string(),
        cv: z.string(),
        exampleScore: z.number().int(),
        exampleSummary: z.string(),
      }),
    )
    .length(16),
  applications: z
    .array(
      z.object({
        queue: z.enum(["A", "B"]),
        id: z.string(),
        candidateId: z.string(),
        jobId: z.string(),
        answer: z.string(),
        daysAgo: z.number().int().positive(),
        history: z
          .array(
            z.object({
              stage: z.custom<Stage>(),
              daysAgo: z.number().int().positive(),
              note: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .length(16),
});
const seed = seedSchema.parse(session);

/** Submission and history events are seeded two hours past a whole day so ages never sit on a boundary. */
const SEED_OFFSET_MS = 2 * 3_600_000;
function seededAt(now: Date, daysAgo: number) {
  return new Date(now.getTime() - daysAgo * DAY_MS - SEED_OFFSET_MS).toISOString();
}

export function buildP11Session(now: Date, queue: P11Queue): State {
  const base = initialState();
  const templates = seed.applications.filter((x) => x.queue === queue);
  const personas = seed.personas as Person[];
  const state: State = {
    ...base,
    activePersonId: null,
    people: [...base.people, ...personas],
    applications: templates.map((template) => {
      const persona = personas.find((x) => x.id === template.candidateId)!;
      const job = base.jobs.find((x) => x.id === template.jobId)!;
      const events = [
        { stage: "submitted" as const, at: seededAt(now, template.daysAgo), note: "" },
        ...(template.history ?? []).map((event) => ({
          stage: event.stage,
          at: seededAt(now, event.daysAgo),
          note: event.note,
        })),
      ];
      return {
        id: template.id,
        candidateId: persona.id,
        jobId: job.id,
        companyId: job.companyId,
        jobTitle: job.title,
        candidateName: persona.name,
        cv: persona.cv,
        answer: template.answer,
        sourceNotes: "",
        generatedAnswer: "",
        score: persona.exampleScore,
        summary: persona.exampleSummary,
        stage: events[events.length - 1].stage,
        events,
      };
    }),
  };
  return stateSchema.parse(state);
}
