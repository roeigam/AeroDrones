/**
 * Language toggle behavior.
 * - Clicking the other-language flag keeps the current section: "/#builds" → "/en/#builds".
 * - The choice is stored in localStorage (try/catch: storage can be blocked).
 * - NEVER redirects. Not on first visit, not for returning visitors. Hebrew at "/" always stays Hebrew.
 *   A stored preference that differs from the current page only adds a subtle .is-preferred hint.
 */
const KEY = 'aerodrones:lang';

function readPref(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
function writePref(lang: string) {
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* storage blocked — the toggle still works, the choice just isn't remembered */
  }
}

/** Section currently in view, published by nav.ts on <html data-section>. Falls back to the URL hash. */
function currentSection(): string {
  const fromNav = document.documentElement.dataset.section;
  if (fromNav && fromNav !== 'top') return fromNav;
  const hash = location.hash.slice(1);
  return hash && hash !== 'top' && document.getElementById(hash) ? hash : '';
}

function init() {
  const pref = readPref();
  document.querySelectorAll<HTMLElement>('[data-lang-toggle]').forEach((group) => {
    const current = group.dataset.currentLang;
    group.querySelectorAll<HTMLAnchorElement>('a[data-flag]').forEach((link) => {
      const lang = link.dataset.flag!;
      const isCurrent = lang === current;
      if (pref && pref === lang && !isCurrent) link.classList.add('is-preferred');

      link.addEventListener('click', (event) => {
        if (isCurrent) {
          event.preventDefault(); // already on this language — do nothing
          return;
        }
        writePref(lang);
        const section = currentSection();
        const base = link.getAttribute('href')!.split('#')[0];
        link.href = section ? `${base}#${section}` : base;
      });
    });
  });
}

init();
