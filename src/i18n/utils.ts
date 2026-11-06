export const LANGS = ['he', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export const DIR: Record<Lang, 'rtl' | 'ltr'> = { he: 'rtl', en: 'ltr' };

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value);
}

/** Root path for a language: "/" for Hebrew (default), "/en/" for English. */
export function langRoot(lang: Lang): string {
  return lang === 'he' ? '/' : '/en/';
}

export type BidiSegment = { text: string; latin: boolean };

/**
 * Splits a string into Latin/number runs and other (e.g. Hebrew) runs, so Latin tokens
 * such as "4S 1500mAh" or "F405" can be wrapped in <bdi> on RTL pages.
 * A Latin run may contain inner spaces and technical punctuation (. , : / + - × ° % ").
 */
const LATIN_RUN = /[A-Za-z0-9](?:[A-Za-z0-9.,:/+\-×°%"'’ ]*[A-Za-z0-9%°"'’)])?/g;

export function splitBidi(input: string): BidiSegment[] {
  const out: BidiSegment[] = [];
  let last = 0;
  for (const m of input.matchAll(LATIN_RUN)) {
    const start = m.index ?? 0;
    if (start > last) out.push({ text: input.slice(last, start), latin: false });
    out.push({ text: m[0], latin: true });
    last = start + m[0].length;
  }
  if (last < input.length) out.push({ text: input.slice(last), latin: false });
  return out;
}
