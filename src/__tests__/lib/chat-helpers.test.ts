import { getAskedYear, parsePeriod } from '@/lib/chat-helpers';

describe('getAskedYear', () => {
  it('extracts year from "where did X work in 2021"', () => {
    expect(getAskedYear([{ role: 'user', content: 'where did Austin work in 2021?' }])).toBe(2021);
  });

  it('extracts year from "experience in 2020"', () => {
    expect(getAskedYear([{ role: 'user', content: 'experience in 2020' }])).toBe(2020);
  });

  it('extracts year from parts array format', () => {
    expect(
      getAskedYear([
        { role: 'assistant', content: 'Hi' },
        { role: 'user', parts: [{ type: 'text', text: 'where did they work in 2019?' }] },
      ])
    ).toBe(2019);
  });

  it('returns null when no user message', () => {
    expect(getAskedYear([])).toBe(null);
    expect(getAskedYear([{ role: 'assistant', content: 'Hi' }])).toBe(null);
  });

  it('returns null when no year in message', () => {
    expect(getAskedYear([{ role: 'user', content: 'What is your rate?' }])).toBe(null);
  });
});

describe('parsePeriod', () => {
  it('parses "2019-2021"', () => {
    expect(parsePeriod('2019-2021')).toEqual([2019, 2021]);
  });

  it('parses "2019 - 2021"', () => {
    expect(parsePeriod('2019 - 2021')).toEqual([2019, 2021]);
  });

  it('parses "2019 to 2021"', () => {
    expect(parsePeriod('2019 to 2021')).toEqual([2019, 2021]);
  });

  it('parses single year as start and end', () => {
    expect(parsePeriod('2023')).toEqual([2023, 2023]);
  });

  it('parses "2019 - Present"', () => {
    const [start, end] = parsePeriod('2019 - Present')!;
    expect(start).toBe(2019);
    expect(end).toBe(new Date().getFullYear());
  });

  it('returns null for null/undefined', () => {
    expect(parsePeriod(null)).toBe(null);
    expect(parsePeriod(undefined)).toBe(null);
  });

  it('returns null for string with no years', () => {
    expect(parsePeriod('unknown')).toBe(null);
  });
});
