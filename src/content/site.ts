/**
 * ALL site text and settings live here.
 * `shared` = values identical in both languages. `he` / `en` = copy with IDENTICAL keys
 * (the `en` object is typed as `typeof he`, so a missing key is a type error).
 * Every placeholder value is marked TODO.
 */
import type { Lang } from '../i18n/utils';

export type SectionId = 'about' | 'services' | 'builds' | 'contact';
export type SocialId = 'instagram' | 'youtube' | 'tiktok' | 'facebook';

export const shared = {
  /** Brand is NEVER translated or transliterated. Wrapped in <bdi> on Hebrew pages. */
  brand: 'AeroDrones',
  seo: {
    /** ONE switch: true = <meta name="robots" content="noindex, nofollow">. Set to false to make the site public. */
    noindex: true,
  },
  hero: {
    /** 'cutout' = photo floats and blends into the glow (needs a dark-background shot or a transparent PNG). 'framed' = photo inside a HUD viewfinder frame. */
    mode: 'cutout' as 'cutout' | 'framed',
    /** Decorative telemetry readouts around the hero drone (aria-hidden). */
    readouts: [
      { k: 'ALT', v: '120.4', u: 'm' },
      { k: 'SPD', v: '0.0', u: 'm/s' },
      { k: 'BAT', v: '16.8', u: 'V' },
      { k: 'GPS', v: '14', u: 'SAT' },
    ],
    /** Used by the 'framed' mode corner labels. TODO: real coordinates (or keep decorative). */
    frameLabels: { end: 'CAM-01', bottomStart: '32.08°N 34.78°E', bottomEnd: '1080p · 120fps' },
  },
  /** Language names, each written in its own language (used by the flag toggle). */
  langNames: { he: 'עברית', en: 'English' } as Record<Lang, string>,
  /** Platform names are proper nouns, identical in both languages (used as aria-labels). */
  socialNames: { instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok', facebook: 'Facebook' } as Record<SocialId, string>,
  // TODO: client's real WhatsApp number, international format, digits only (e.g. 9725XXXXXXXX)
  whatsappNumber: '972500000000',
  // TODO: client's real social profiles (remove any he doesn't use)
  social: [
    { id: 'instagram', url: 'https://www.instagram.com/' },
    { id: 'youtube', url: 'https://www.youtube.com/' },
    { id: 'tiktok', url: 'https://www.tiktok.com/' },
    { id: 'facebook', url: 'https://www.facebook.com/' },
  ] as { id: SocialId; url: string }[],
} as const;

const he = {
  meta: {
    // TODO: final copy from the client
    title: 'AeroDrones — רחפני FPV בהתאמה אישית',
    description: 'רחפני FPV שנבנים בעבודת יד: בנייה לפי הזמנה, תיקונים, שדרוגים וכיוונון.',
  },
  a11y: {
    skipToContent: 'דילוג לתוכן',
    mainNav: 'ניווט ראשי',
    menuOpen: 'פתיחת תפריט',
    menuClose: 'סגירת תפריט',
    langSwitch: 'בחירת שפה',
    homeLink: 'חזרה לראש העמוד',
    social: 'רשתות חברתיות',
  },
  nav: [
    { id: 'about', label: 'אודות' },
    { id: 'services', label: 'שירותים' },
    { id: 'builds', label: 'הבנייה שלי' },
    { id: 'contact', label: 'צור קשר' },
  ] as { id: SectionId; label: string }[],
  hero: {
    // TODO: final copy from the client
    eyebrow: '// FPV בהתאמה אישית · בנייה · תיקון · כיוונון',
    titleLead: 'רחפנים שנבנים',
    titleAccent: 'לעוף.',
    tagline: 'בנייה בעבודת יד, תיקונים ושדרוגים לרחפני FPV — מבחירת כל חלק ועד טיסת המבחן.',
    ctaPrimary: 'צרו קשר',
    ctaSecondary: 'לבנייה שלי',
    scroll: 'גלילה',
    imageAlt: 'רחפן FPV מותאם אישית עם מצלמת אקשן ותאורת לד', // TODO: update when the real photo arrives
  },
  sections: {
    about: { num: '01', label: 'אודות', title: 'מהשולחן לשמיים.' },
    services: { num: '02', label: 'שירותים', title: 'מה אני עושה.' },
    builds: { num: '03', label: 'הבנייה שלי', title: 'רחפנים שיצאו מהסדנה.' },
    contact: { num: '04', label: 'צור קשר', title: 'בואו נבנה משהו שעף.' },
  } as Record<SectionId, { num: string; label: string; title: string }>,
  footer: {
    // TODO: final copy from the client
    tagline: 'רחפני FPV שנבנים, מתוקנים ומכוונים בעבודת יד.',
    rights: 'כל הזכויות שמורות.',
    backToTop: 'חזרה למעלה',
  },
};

const en: typeof he = {
  meta: {
    // TODO: final copy from the client
    title: 'AeroDrones — Custom FPV drones',
    description: 'Hand-built FPV drones: custom builds to order, repairs, upgrades and tuning.',
  },
  a11y: {
    skipToContent: 'Skip to content',
    mainNav: 'Main navigation',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    langSwitch: 'Choose language',
    homeLink: 'Back to top of page',
    social: 'Social media',
  },
  nav: [
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'builds', label: 'My builds' },
    { id: 'contact', label: 'Contact' },
  ],
  hero: {
    // TODO: final copy from the client
    eyebrow: '// Custom FPV · Build · Repair · Tune',
    titleLead: 'Drones built',
    titleAccent: 'to fly.',
    tagline: 'Hand-built FPV drones, repairs and upgrades — from choosing every part to the maiden flight.',
    ctaPrimary: 'Contact me',
    ctaSecondary: 'See my builds',
    scroll: 'Scroll',
    imageAlt: 'Custom FPV drone with an action camera and LED lighting', // TODO: update when the real photo arrives
  },
  sections: {
    about: { num: '01', label: 'About', title: 'From the bench to the sky.' },
    services: { num: '02', label: 'Services', title: 'What I do.' },
    builds: { num: '03', label: 'My builds', title: 'Straight out of the workshop.' },
    contact: { num: '04', label: 'Contact', title: "Let's build something that flies." },
  },
  footer: {
    // TODO: final copy from the client
    tagline: 'FPV drones built, repaired and tuned by hand.',
    rights: 'All rights reserved.',
    backToTop: 'Back to top',
  },
};

export const content: Record<Lang, typeof he> = { he, en };
