/**
 * Builds lightbox on a native <dialog>.
 * - open from any [data-lb-open="<index>"] button; focus returns to that button on close
 * - next/prev buttons, ArrowLeft/ArrowRight, Home/End, and horizontal swipe — all follow the
 *   document direction (in RTL "next" is to the left)
 * - Esc / close button / backdrop click close with an animation (dialog 'cancel' is intercepted)
 * - showModal() makes the page inert and keeps focus inside the dialog
 * - neighbors' images are switched to eager loading so navigation feels instant
 */
const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');

if (dialog) {
  const root = document.documentElement;
  const medias = Array.from(dialog.querySelectorAll<HTMLElement>('[data-lb-media]'));
  const infos = Array.from(dialog.querySelectorAll<HTMLElement>('[data-lb-info]'));
  const current = dialog.querySelector<HTMLElement>('[data-lb-current]');
  const bar = dialog.querySelector<HTMLElement>('[data-lb-bar]');
  const live = dialog.querySelector<HTMLElement>('[data-lb-live]');
  const stage = dialog.querySelector<HTMLElement>('[data-lb-stage]');
  const side = dialog.querySelector<HTMLElement>('.lb__side');
  const panel = dialog.querySelector<HTMLElement>('[data-lb-panel]');
  const total = medias.length;
  const of = dialog.dataset.of ?? '/';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isRtl = () => root.dir === 'rtl';
  let index = 0;
  let opener: HTMLElement | null = null;
  let closing = false;

  const pad = (n: number) => String(n).padStart(2, '0');
  const wrap = (n: number) => (n + total) % total;

  /** Make an image (and the next/prev ones) start loading now. */
  function warm(i: number) {
    [i, wrap(i + 1), wrap(i - 1)].forEach((k) => {
      medias[k]?.querySelectorAll('img').forEach((img) => {
        if (img.loading !== 'eager') img.loading = 'eager';
      });
    });
  }

  function show(next: number, step: 1 | -1 | 0) {
    const prev = index;
    index = wrap(next);
    warm(index);

    // direction of travel on screen: +1 = content moves in from the inline end
    const dir = step === 0 ? 0 : step * (isRtl() ? -1 : 1);
    dialog!.style.setProperty('--lb-dir', String(dir));

    medias.forEach((m, k) => {
      m.classList.remove('is-entering', 'is-leaving');
      if (k === index) {
        m.hidden = false;
        if (step !== 0 && !reduced.matches) m.classList.add('is-entering');
      } else if (k === prev && step !== 0 && !reduced.matches) {
        m.hidden = false;
        m.classList.add('is-leaving');
        m.addEventListener('animationend', () => {
          if (k !== index) m.hidden = true;
          m.classList.remove('is-leaving');
        }, { once: true });
      } else {
        m.hidden = true;
      }
    });
    infos.forEach((info, k) => {
      info.hidden = k !== index;
      info.classList.toggle('is-entering', k === index && step !== 0 && !reduced.matches);
    });
    side?.scrollTo({ top: 0 });

    if (current) current.textContent = pad(index + 1);
    bar?.style.setProperty('--p', String((index + 1) / total));
    if (live && step !== 0) {
      const name = infos[index]?.querySelector('h2')?.textContent?.trim() ?? '';
      live.textContent = `${name} — ${index + 1} ${of} ${total}`;
    }
  }

  function open(i: number, from: HTMLElement) {
    opener = from;
    closing = false;
    dialog!.classList.remove('is-closing');
    show(i, 0);
    root.classList.add('no-scroll');
    dialog!.showModal();
  }

  function finishClose() {
    dialog!.classList.remove('is-closing');
    if (dialog!.open) dialog!.close();
    root.classList.remove('no-scroll');
    opener?.focus({ preventScroll: true });
    closing = false;
  }

  function close() {
    if (!dialog!.open || closing) return;
    closing = true;
    if (reduced.matches || !panel) return finishClose();
    dialog!.classList.add('is-closing');
    let done = false;
    const end = () => { if (!done) { done = true; finishClose(); } };
    panel.addEventListener('animationend', end, { once: true });
    window.setTimeout(end, 400); // safety net if animationend never fires
  }

  const next = () => show(index + 1, 1);
  const prev = () => show(index - 1, -1);

  /* ---- Wiring ---- */
  document.querySelectorAll<HTMLElement>('[data-lb-open]').forEach((btn) => {
    btn.addEventListener('click', () => open(Number(btn.dataset.lbOpen), btn));
  });
  dialog.querySelector('[data-lb-next]')?.addEventListener('click', next);
  dialog.querySelector('[data-lb-prev]')?.addEventListener('click', prev);
  dialog.querySelector('[data-lb-close]')?.addEventListener('click', close);

  // Esc → animated close instead of the instant native one
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });
  // Backdrop click (the dialog box itself, outside the panel)
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  // Safety: if the dialog gets closed any other way, clean up
  dialog.addEventListener('close', () => {
    root.classList.remove('no-scroll');
  });

  dialog.addEventListener('keydown', (e) => {
    if (e.defaultPrevented) return;
    // Focus trap: showModal() keeps focus out of the page but lets Tab escape to browser UI.
    if (e.key === 'Tab') {
      const items = Array.from(
        dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'),
      ).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
        e.preventDefault();
        first.focus();
      }
      return;
    }
    const forward = isRtl() ? 'ArrowLeft' : 'ArrowRight';
    const backward = isRtl() ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === forward) { e.preventDefault(); next(); }
    else if (e.key === backward) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { e.preventDefault(); show(0, -1); }
    else if (e.key === 'End') { e.preventDefault(); show(total - 1, 1); }
  });

  /* ---- Swipe (touch) on the image stage ---- */
  let sx = 0;
  let sy = 0;
  let tracking = false;
  stage?.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    tracking = true;
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: true });
  stage?.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
    // swiping toward the inline start (left in LTR, right in RTL) reveals the next build
    const towardStart = isRtl() ? dx > 0 : dx < 0;
    if (towardStart) next(); else prev();
  }, { passive: true });
}
