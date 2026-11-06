/**
 * Header behavior (no scroll listeners — IntersectionObserver only):
 * - glass bar once the page leaves the very top (sentinel)
 * - active section highlight in the nav + <html data-section> for the language toggle
 * - mobile menu: aria-expanded, Esc / link / backdrop closes, page behind is inert, focus returns
 */
const root = document.documentElement;
const header = document.querySelector<HTMLElement>('[data-header]');
const sentinel = document.querySelector<HTMLElement>('[data-header-sentinel]');

/* ---- Glass bar on scroll ---- */
if (header && sentinel) {
  new IntersectionObserver(([entry]) => {
    header.classList.toggle('is-scrolled', !entry.isIntersecting);
  }).observe(sentinel);
}

/* ---- Active section ---- */
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));
const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
const visible = new Map<string, number>();

function setActive(id: string) {
  root.dataset.section = id;
  navLinks.forEach((a) => {
    const on = a.hash === `#${id}`;
    a.classList.toggle('is-active', on);
    if (on) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  });
}

if (sections.length) {
  // A thin band in the upper-middle of the viewport decides which section is "current".
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
      let best = '';
      let bestRatio = 0;
      for (const s of sections) {
        const r = visible.get(s.id) ?? 0;
        if (r > bestRatio) {
          best = s.id;
          bestRatio = r;
        }
      }
      if (best) setActive(best);
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.01, 0.5, 1] },
  );
  sections.forEach((s) => io.observe(s));
}

/* ---- Mobile menu ---- */
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.querySelector<HTMLElement>('[data-menu]');

if (toggle && menu) {
  const outside = () =>
    Array.from(document.querySelectorAll<HTMLElement>('body > :not([data-header]):not(script)'));
  const labelOpen = toggle.dataset.labelOpen ?? '';
  const labelClose = toggle.dataset.labelClose ?? '';
  const desktop = window.matchMedia('(min-width: 960px)');

  const setOpen = (open: boolean, returnFocus = true) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? labelClose : labelOpen);
    menu.toggleAttribute('data-open', open);
    header?.classList.toggle('menu-open', open);
    root.classList.toggle('no-scroll', open);
    outside().forEach((el) => (el.inert = open));
    if (open) {
      menu.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true });
    } else if (returnFocus) {
      toggle.focus({ preventScroll: true });
    }
  };
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  toggle.addEventListener('click', () => setOpen(!isOpen()));
  menu.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('a[href^="#"], a[data-nav-link]')) setOpen(false, false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) setOpen(false);
  });
  // Keep focus inside the header (toggle + menu) while open
  header?.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !isOpen()) return;
    const items = [toggle, ...menu.querySelectorAll<HTMLElement>('a, button')];
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  desktop.addEventListener('change', (e) => {
    if (e.matches && isOpen()) setOpen(false, false);
  });
}
