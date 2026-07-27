// Whether the user marked today as a GLP-1 injection day. Stored per date in
// localStorage so the dashboard toggle and the session screen stay in sync
// even before a workout session row exists.

function todayKey(): string {
  return `glp1-injection-${new Date().toISOString().slice(0, 10)}`;
}

export function isInjectionDayToday(): boolean {
  try {
    return localStorage.getItem(todayKey()) === '1';
  } catch {
    return false;
  }
}

export function setInjectionDayToday(value: boolean): void {
  try {
    localStorage.setItem(todayKey(), value ? '1' : '0');
  } catch {
    // ignore
  }
}
