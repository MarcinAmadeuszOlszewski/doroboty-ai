import type { Application, State } from "./model";
import type { StoragePort } from "./storage";

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
