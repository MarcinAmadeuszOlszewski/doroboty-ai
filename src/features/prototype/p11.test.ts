import { describe, expect, it } from "vitest";
import { initialState, type Application, type Stage } from "./model";
import {
  REMINDER_STORAGE_KEY,
  daysLabel,
  isOverdue,
  isWaiting,
  readReminder,
  waitingCountLabel,
  waitingDays,
  waitingSummary,
  writeReminder,
} from "./p11";

const NOW = new Date("2026-11-09T12:00:00.000Z");
const HOUR = 3_600_000;
function app(stage: Stage, agoMs: number): Application {
  const base = initialState().applications[0];
  return {
    ...base,
    stage,
    events: [{ stage: "submitted", at: new Date(NOW.getTime() - agoMs).toISOString(), note: "" }],
  };
}

describe("P11 waiting logic", () => {
  it("treats 3 days 23 hours as not overdue and 4 days as overdue", () => {
    expect(isOverdue(app("submitted", 3 * 24 * HOUR + 23 * HOUR), NOW)).toBe(false);
    expect(waitingDays(app("submitted", 3 * 24 * HOUR + 23 * HOUR), NOW)).toBe(3);
    expect(isOverdue(app("submitted", 4 * 24 * HOUR), NOW)).toBe(true);
  });
  it("keeps submitted and reviewed applications waiting, not decided ones", () => {
    expect(isWaiting(app("submitted", 0))).toBe(true);
    expect(isWaiting(app("reviewed", 0))).toBe(true);
    for (const stage of ["interview_invited", "rejected", "withdrawn"] as const) {
      expect(isWaiting(app(stage, 0))).toBe(false);
      expect(isOverdue(app(stage, 10 * 24 * HOUR), NOW)).toBe(false);
    }
    expect(isOverdue(app("reviewed", 10 * 24 * HOUR), NOW)).toBe(true);
  });
  it("uses Polish plural forms", () => {
    expect([1, 2, 4, 5, 12, 22, 25].map(waitingSummary)).toEqual([
      "1 zgłoszenie czeka ponad 3 dni",
      "2 zgłoszenia czekają ponad 3 dni",
      "4 zgłoszenia czekają ponad 3 dni",
      "5 zgłoszeń czeka ponad 3 dni",
      "12 zgłoszeń czeka ponad 3 dni",
      "22 zgłoszenia czekają ponad 3 dni",
      "25 zgłoszeń czeka ponad 3 dni",
    ]);
    expect([1, 2, 4, 5, 12, 22, 25].map(daysLabel)).toEqual([
      "Czeka 1 dzień",
      "Czeka 2 dni",
      "Czeka 4 dni",
      "Czeka 5 dni",
      "Czeka 12 dni",
      "Czeka 22 dni",
      "Czeka 25 dni",
    ]);
    expect([1, 2, 4, 5, 12, 22, 25].map(waitingCountLabel)).toEqual([
      "1 czeka ponad 3 dni",
      "2 czekają ponad 3 dni",
      "4 czekają ponad 3 dni",
      "5 czeka ponad 3 dni",
      "12 czeka ponad 3 dni",
      "22 czekają ponad 3 dni",
      "25 czeka ponad 3 dni",
    ]);
  });
});

describe("reminder variant storage", () => {
  function memory(initial?: string) {
    const data = new Map<string, string>(initial ? [[REMINDER_STORAGE_KEY, initial]] : []);
    return {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => void data.set(key, value),
    };
  }
  const broken = {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
  };
  it("defaults to on and reads off", () => {
    expect(readReminder(null)).toBe(true);
    expect(readReminder(memory())).toBe(true);
    expect(readReminder(memory("off"))).toBe(false);
    expect(readReminder(broken)).toBe(true);
  });
  it("round-trips and reports write failures without throwing", () => {
    const storage = memory();
    expect(writeReminder(storage, false)).toBe(true);
    expect(readReminder(storage)).toBe(false);
    expect(writeReminder(storage, true)).toBe(true);
    expect(readReminder(storage)).toBe(true);
    expect(writeReminder(broken, false)).toBe(false);
    expect(writeReminder(null, false)).toBe(false);
  });
});
