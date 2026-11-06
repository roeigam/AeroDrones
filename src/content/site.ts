/**
 * ALL site text and settings live here.
 * `shared` = values identical in both languages. `he` / `en` = copy, with IDENTICAL keys.
 * Phase 1 only contains what the style tile needs; sections are filled in later phases.
 */
import type { Lang } from '../i18n/utils';

export const shared = {
  /** Brand is NEVER translated or transliterated. Wrapped in <bdi> on Hebrew pages. */
  brand: 'AeroDrones',
  seo: {
    /** ONE switch: true = <meta name="robots" content="noindex">. Set to false to make the site public. */
    noindex: true,
  },
  hero: {
    /** 'framed' = photo inside a HUD viewfinder frame. 'cutout' = floating photo with a soft radial mask (best with a transparent PNG or a dark-background shot). */
    mode: 'cutout' as 'cutout' | 'framed',
  },
} as const;

const he = {
  meta: {
    // TODO: final copy from the client
    title: 'רחפנים בהתאמה אישית — בנייה, תיקונים ושדרוגים',
    description: 'רחפני FPV שנבנים בעבודת יד: בנייה לפי הזמנה, תיקונים, שדרוגים וכיוונון.',
  },
};

const en: typeof he = {
  meta: {
    // TODO: final copy from the client
    title: 'Custom drones — builds, repairs and upgrades',
    description: 'Hand-built FPV drones: custom builds to order, repairs, upgrades and tuning.',
  },
};

export const content: Record<Lang, typeof he> = { he, en };
