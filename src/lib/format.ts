import type { Importance } from '../data/mockData';

/** 120_000_000 -> "120 млн ₸" (compact, business tone) */
export function formatKzt(value: number): string {
  if (value >= 1_000_000) {
    const mln = value / 1_000_000;
    const rounded = Math.round(mln * 10) / 10;
    const num = Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1);
    return `${num.replace('.', ',')} млн ₸`;
  }
  return `${value.toLocaleString('ru-RU')} ₸`;
}

/** Exact grouped form: "120 000 000 ₸" */
export function formatKztExact(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₸`;
}

export function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.', ',')} млн`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace('.', ',')} тыс`;
  return n.toString();
}

export interface ImportanceStyle {
  /** dot / accent color */
  color: string;
  /** tailwind text color class */
  text: string;
  /** soft background tint */
  tint: string;
  label: string;
}

export const importanceStyle: Record<Importance, ImportanceStyle> = {
  critical: { color: 'rgb(var(--rose))', text: 'text-rose', tint: 'rgba(224,121,107,0.12)', label: 'Срочно' },
  important: { color: 'rgb(var(--gold))', text: 'text-gold', tint: 'rgba(56,189,248,0.12)', label: 'Важно' },
  digest: { color: 'rgb(var(--teal))', text: 'text-teal', tint: 'rgba(79,182,166,0.12)', label: 'Дайджест' },
  silent: { color: 'rgb(var(--text-muted))', text: 'text-text-muted', tint: 'rgba(139,149,165,0.10)', label: 'Тихо' },
};

export function greetingByHour(date = new Date()): string {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'Доброе утро';
  if (h >= 12 && h < 18) return 'Добрый день';
  if (h >= 18 && h < 23) return 'Добрый вечер';
  return 'Доброй ночи';
}

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
