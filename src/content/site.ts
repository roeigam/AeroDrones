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
    /** Decorative corner labels for the 'framed' mode (neutral HUD values). */
    frameLabels: { end: 'CAM-01', bottomStart: 'GRID 07-B · HDG 045°', bottomEnd: '1080p · 120fps' },
  },
  about: {
    /** Decorative HUD frame labels around the About photo (neutral values). */
    frameLabels: { end: 'CAM-02', bottomStart: 'ISO 400 · f/2.8', bottomEnd: 'GRID 07-B · HDG 045°' },
  },
  /** Language names, each written in its own language (used by the flag toggle). */
  langNames: { he: 'עברית', en: 'English' } as Record<Lang, string>,
  /** Platform names are proper nouns, identical in both languages (used as aria-labels). */
  socialNames: { instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok', facebook: 'Facebook' } as Record<SocialId, string>,
  /** Sender name on contact-form emails (Web3Forms from_name). */
  formFromName: 'AeroDrones website',
  /** Platform name, identical in both languages. */
  whatsappName: 'WhatsApp',
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
    ogImageAlt: 'AeroDrones — רחפני FPV שנבנים לעוף',
    ogLocale: 'he_IL',
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
  } as Record<SectionId, { num: string; label: string; title: string; lede?: string }>,
  about: {
    // TODO: the client's real story (placeholder copy)
    paragraphs: [
      'התחלתי לטוס לפני יותר משמונה שנים עם רחפן מדף קטן, שהתרסק כבר בשבוע הראשון. במקום לקנות חדש, פירקתי אותו כדי להבין מה נשבר — ומשם זה כבר לא עצר.',
      'היום אני מתכנן ובונה רחפני FPV מאפס: בוחר כל חלק, מלחים, מכוונן את הבקר ובודק כל רחפן בשטח לפני שהוא יוצא מהסדנה. אותה תשומת לב נכנסת לכל תיקון ושדרוג — כי רחפן טוב צריך להרגיש כמו המשך של היד.',
    ],
    // TODO (MUST before delivery): these numbers are placeholders. Get the real values from the client,
    // or set stats: [] to hide the row entirely (the layout is designed to work without it).
    stats: [
      { value: '8+', label: 'שנים באוויר' },
      { value: '150+', label: 'רחפנים נבנו ותוקנו' },
      { value: '100%', label: 'נבדקים בטיסה לפני מסירה' },
    ] as { value: string; label: string }[],
    imageAlt: 'רחפן FPV על שולחן העבודה, מוקף בציור אור', // TODO: update when the real photo arrives
  },
  services: {
    lede: 'מבנייה מאפס ועד כיוונון עדין — כל מה שהרחפן שלך צריך, תחת קורת גג אחת.',
    // TODO: final service copy from the client
    items: [
      {
        icon: 'build',
        title: 'בנייה לפי הזמנה',
        text: 'רחפן שמתוכנן סביבך: סגנון הטיסה, התקציב והמטרה — מבחירת החלקים ועד טיסת הבכורה.',
        points: ['תכנון לפי סגנון טיסה ותקציב', 'חלקים איכותיים והלחמות נקיות', 'כיוונון וטיסת מבחן לפני מסירה'],
      },
      {
        icon: 'repair',
        title: 'תיקונים',
        text: 'התרסקות, מנוע שלא מסתובב או וידאו שנעלם? אבחון מסודר ותיקון שמחזיר אותך לאוויר.',
        points: ['אבחון תקלות מהיר', 'החלפת מנועים, ESC, בקרים ושלדות', 'תיקונים אחרי התרסקות'],
      },
      {
        icon: 'tune',
        title: 'שדרוגים וכיוונון',
        text: 'להוציא מהרחפן את המקסימום: טיסה חלקה יותר, תגובה חדה יותר וזמן טיסה ארוך יותר.',
        points: ['כיוונון PID ופילטרים', 'שדרוג לווידאו דיגיטלי ו-VTX', 'הגדרות Betaflight / INAV'],
      },
    ] as { icon: 'build' | 'repair' | 'tune'; title: string; text: string; points: string[] }[],
    ctaText: 'לא בטוחים מה בדיוק צריך?',
    ctaLink: 'ספרו לי על הרחפן',
  },
  builds: {
    lede: 'כל רחפן נבנה, מכוונן ונבדק בשטח. לחצו על בנייה כדי לראות אותה מקרוב.',
    open: 'פתיחת',
    moreSpecs: 'מפרטים נוספים',
    dialogLabel: 'גלריית הבנייה',
    close: 'סגירה',
    prev: 'הבנייה הקודמת',
    next: 'הבנייה הבאה',
    of: 'מתוך',
    specsTitle: 'מפרט',
    slide: 'שקופית',
  },
  contact: {
    // TODO: final copy from the client
    lede: 'בנייה חדשה, תיקון או שדרוג? ספרו לי מה אתם צריכים ואחזור אליכם בהקדם.',
    whatsapp: {
      title: 'הכי מהיר: וואטסאפ',
      text: 'שלחו הודעה עם תמונה של הרחפן או תיאור קצר — ואענה ישירות.',
      cta: 'שליחת הודעה בוואטסאפ',
      greeting: 'היי! הגעתי מהאתר של AeroDrones ואשמח לשמוע פרטים על',
      fabLabel: 'שליחת הודעה בוואטסאפ',
    },
    // TODO: real values from the client
    facts: [
      { label: 'זמן תגובה', value: 'עד יום עבודה' },
      { label: 'אזור שירות', value: 'כל הארץ · משלוח או איסוף' },
    ] as { label: string; value: string }[],
    form: {
      title: 'או השאירו פרטים',
      name: 'שם מלא',
      namePlaceholder: 'איך לפנות אליך?',
      phone: 'טלפון',
      phonePlaceholder: '050-000-0000',
      email: 'אימייל',
      emailPlaceholder: 'name@example.com',
      emailOptional: '(לא חובה)',
      message: 'הודעה',
      messagePlaceholder: 'ספרו לי על הרחפן, על התקלה או על מה שאתם רוצים לבנות…',
      requiredNote: 'שדות חובה',
      submit: 'שליחת הודעה',
      sending: 'שולח…',
      privacy: 'הפרטים משמשים רק כדי לחזור אליכם.',
      subject: 'פנייה חדשה מהאתר (עברית) — AeroDrones',
      language: 'Hebrew',
      offline: {
        note: 'זו גרסה לא־מקוונת של האתר, ולכן הטופס לא יכול לשלוח מכאן. הכי מהיר: וואטסאפ.',
        title: 'אי אפשר לשלוח את הטופס מהגרסה הלא־מקוונת.',
        text: 'ההודעה שכתבתם מוכנה — אפשר לשלוח אותה בוואטסאפ בלחיצה אחת.',
        cta: 'שליחת ההודעה בוואטסאפ',
      },
      errors: {
        nameRequired: 'נא למלא שם',
        phoneRequired: 'נא למלא מספר טלפון',
        phoneInvalid: 'מספר הטלפון לא נראה תקין',
        emailInvalid: 'כתובת האימייל לא נראית תקינה',
        messageRequired: 'נא לכתוב הודעה',
        messageShort: 'ההודעה קצרה מדי — עוד כמה מילים?',
      },
      success: {
        title: 'ההודעה נשלחה!',
        text: 'תודה שפניתם. אחזור אליכם בהקדם.',
        again: 'שליחת הודעה נוספת',
      },
      error: {
        title: 'משהו השתבש בשליחה.',
        text: 'נסו שוב בעוד רגע, או שלחו לי הודעה בוואטסאפ.',
      },
    },
  },
  notFound: {
    metaTitle: 'העמוד לא נמצא — AeroDrones',
    eyebrow: 'ERR 404 · האות אבד',
    title: 'איבדנו את האות.',
    text: 'העמוד שחיפשתם לא קיים או שעבר מקום. בואו נחזור לבסיס.',
    home: 'חזרה לעמוד הבית',
    builds: 'לבנייה שלי',
  },
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
    ogImageAlt: 'AeroDrones — FPV drones built to fly',
    ogLocale: 'en_US',
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
  about: {
    // TODO: the client's real story (placeholder copy)
    paragraphs: [
      'I started flying more than eight years ago with a small off-the-shelf drone that crashed in its very first week. Instead of buying a new one, I took it apart to understand what broke — and I never stopped.',
      'Today I design and build FPV drones from scratch: choosing every part, soldering, tuning the flight controller and field-testing each quad before it leaves the workshop. The same care goes into every repair and upgrade — because a good drone should feel like an extension of your hand.',
    ],
    // TODO (MUST before delivery): these numbers are placeholders. Get the real values from the client,
    // or set stats: [] to hide the row entirely (the layout is designed to work without it).
    stats: [
      { value: '8+', label: 'Years in the air' },
      { value: '150+', label: 'Drones built & repaired' },
      { value: '100%', label: 'Flight-tested before handover' },
    ],
    imageAlt: 'FPV drone on the workbench, surrounded by light painting', // TODO: update when the real photo arrives
  },
  services: {
    lede: 'From a build from scratch to fine tuning — everything your drone needs, under one roof.',
    // TODO: final service copy from the client
    items: [
      {
        icon: 'build',
        title: 'Custom builds to order',
        text: 'A drone designed around you: your flying style, budget and goals — from parts selection to the maiden flight.',
        points: ['Planned around your flying style and budget', 'Quality parts and clean soldering', 'Tuned and test-flown before handover'],
      },
      {
        icon: 'repair',
        title: 'Repairs & fixes',
        text: "A crash, a motor that won't spin or video that cuts out? Proper diagnosis and a repair that gets you back in the air.",
        points: ['Fast fault diagnosis', 'Motor, ESC, flight controller and frame swaps', 'Post-crash repairs'],
      },
      {
        icon: 'tune',
        title: 'Upgrades & tuning',
        text: 'Get the most out of your drone: smoother flight, a sharper response and longer flight times.',
        points: ['PID and filter tuning', 'Digital video and VTX upgrades', 'Betaflight / INAV setup'],
      },
    ],
    ctaText: 'Not sure exactly what you need?',
    ctaLink: 'Tell me about your drone',
  },
  builds: {
    lede: 'Every drone is built, tuned and field-tested. Tap a build to see it up close.',
    open: 'Open',
    moreSpecs: 'more specs',
    dialogLabel: 'Builds gallery',
    close: 'Close',
    prev: 'Previous build',
    next: 'Next build',
    of: 'of',
    specsTitle: 'Specs',
    slide: 'Slide',
  },
  contact: {
    // TODO: final copy from the client
    lede: "A new build, a repair or an upgrade? Tell me what you need and I'll get back to you soon.",
    whatsapp: {
      title: 'Fastest: WhatsApp',
      text: "Send a message with a photo of your drone or a short description — I'll reply directly.",
      cta: 'Message me on WhatsApp',
      greeting: "Hi! I found AeroDrones' website and I'd like to hear more about",
      fabLabel: 'Message on WhatsApp',
    },
    // TODO: real values from the client
    facts: [
      { label: 'Response time', value: 'Within one business day' },
      { label: 'Service area', value: 'Nationwide · shipping or pickup' },
    ],
    form: {
      title: 'Or leave your details',
      name: 'Full name',
      namePlaceholder: 'What should I call you?',
      phone: 'Phone',
      phonePlaceholder: '050-000-0000',
      email: 'Email',
      emailPlaceholder: 'name@example.com',
      emailOptional: '(optional)',
      message: 'Message',
      messagePlaceholder: 'Tell me about your drone, the problem, or what you want to build…',
      requiredNote: 'Required fields',
      submit: 'Send message',
      sending: 'Sending…',
      privacy: 'Your details are only used to get back to you.',
      subject: 'New message from the website (English) — AeroDrones',
      language: 'English',
      offline: {
        note: "This is an offline copy of the site, so the form can't send from here. Fastest: WhatsApp.",
        title: "The form can't send from the offline copy.",
        text: 'Your message is ready — send it on WhatsApp in one tap.',
        cta: 'Send this on WhatsApp',
      },
      errors: {
        nameRequired: 'Please enter your name',
        phoneRequired: 'Please enter a phone number',
        phoneInvalid: "That phone number doesn't look right",
        emailInvalid: "That email address doesn't look right",
        messageRequired: 'Please write a message',
        messageShort: 'That message is a bit short — a few more words?',
      },
      success: {
        title: 'Message sent!',
        text: "Thanks for reaching out. I'll get back to you soon.",
        again: 'Send another message',
      },
      error: {
        title: 'Something went wrong.',
        text: 'Please try again in a moment, or message me on WhatsApp.',
      },
    },
  },
  notFound: {
    metaTitle: 'Page not found — AeroDrones',
    eyebrow: 'ERR 404 · Signal lost',
    title: 'We lost the signal.',
    text: "The page you're looking for doesn't exist or has moved. Let's bring you back to base.",
    home: 'Back to home',
    builds: 'See my builds',
  },
  footer: {
    // TODO: final copy from the client
    tagline: 'FPV drones built, repaired and tuned by hand.',
    rights: 'All rights reserved.',
    backToTop: 'Back to top',
  },
};

export const content: Record<Lang, typeof he> = { he, en };

/** wa.me link with the number and the greeting in the given language. */
export function whatsappHref(lang: Lang): string {
  const text = `${content[lang].contact.whatsapp.greeting} `;
  return `https://wa.me/${shared.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
