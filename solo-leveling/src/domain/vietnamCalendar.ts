const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' });
export function vietnamDateKey(now: Date): string {
  const parts = formatter.formatToParts(now);
  const part = (type: string) => parts.find(p => p.type === type)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
export function vietnamCalendarDate(now: Date): Date {
  const [y,m,d] = vietnamDateKey(now).split('-').map(Number);
  return new Date(y,m-1,d,12);
}
export function vietnamTaskGroup(now: Date): 'WEEKDAY' | 'WEEKEND' {
  return [0,6].includes(vietnamCalendarDate(now).getDay()) ? 'WEEKEND' : 'WEEKDAY';
}
export function msUntilVietnamMidnight(now = new Date()): number {
  return new Date(`${vietnamDateKey(now)}T00:00:00+07:00`).getTime() + 86400000 - now.getTime() + 50;
}
