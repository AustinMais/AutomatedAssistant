/**
 * Pure helpers for chat API — extracted for testability.
 */

/** Extract year from a message if it looks like "where did X work in 2021?" or "experience in 2020". */
export function getAskedYear(
  messages: Array<{ role?: string; parts?: Array<{ type?: string; text?: string }>; content?: string }>
): number | null {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser) return null;
  let text = '';
  if (typeof lastUser.content === 'string') text = lastUser.content;
  else if (Array.isArray(lastUser.parts)) {
    text = lastUser.parts.map((p) => (p && typeof p.text === 'string' ? p.text : '')).join('');
  }
  const match = text.match(/(?:where|work|experience|worked).*?(?:in\s+)?(20\d{2})\b/i) ?? text.match(/\b(20\d{2})\b/);
  return match ? parseInt(match[1], 10) : null;
}

/** Parse period to [startYear, endYear]. Supports "2019-2021", "2019 - 2021", "2019 to 2021", "2023-2023", "2019 - Present". */
export function parsePeriod(period: unknown): [number, number] | null {
  if (period === null || period === undefined) return null;
  if (typeof period === 'object' && period !== null && 'start' in period && 'end' in period) {
    const p = period as { start: unknown; end: unknown };
    const startArr = parsePeriod(p.start);
    const endArr = parsePeriod(p.end);
    if (startArr && endArr) return [startArr[0], endArr[1]];
    const a =
      startArr?.[0] ??
      (typeof p.start === 'string' ? parseInt(p.start.match(/\b(20\d{2}|19\d{2})\b/)?.[1] ?? '', 10) : NaN);
    const b =
      endArr?.[1] ??
      (typeof p.end === 'string' && /\bpresent\b/i.test(String(p.end))
        ? new Date().getFullYear()
        : typeof p.end === 'string'
          ? parseInt(p.end.match(/\b(20\d{2}|19\d{2})\b/)?.[1] ?? '', 10)
          : NaN);
    if (!Number.isFinite(a)) return null;
    return [a, Number.isFinite(b) ? b : new Date().getFullYear()];
  }
  const raw = typeof period === 'string' ? period : String(period);
  const upper = raw.trim();
  const hasPresent = /\bpresent\b/i.test(upper);
  const numbers = upper.match(/\b(20\d{2}|19\d{2})\b/g);
  if (!numbers || numbers.length < 1) return null;
  const start = parseInt(numbers[0], 10);
  const end = hasPresent
    ? new Date().getFullYear()
    : numbers.length >= 2
      ? parseInt(numbers[numbers.length - 1], 10)
      : start;
  return [start, end];
}
