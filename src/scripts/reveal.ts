/**
 * Scroll reveal: adds .is-visible to [data-reveal] elements as they enter the viewport.
 * CSS (base.css) does the fade + slide-up; stagger comes from the --i custom property.
 * Content is visible without JS (the hidden state only applies under html.js) and
 * under prefers-reduced-motion.
 */
const items = document.querySelectorAll<HTMLElement>('[data-reveal]');

if (!('IntersectionObserver' in window)) {
  items.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  items.forEach((el) => io.observe(el));
}
