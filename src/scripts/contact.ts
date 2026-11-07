/**
 * Contact form: validation in the current language + fetch submit to Web3Forms, no page reload.
 * Without JS the form still works as a plain POST (native validation, Web3Forms' own thank-you page).
 */
type Errors = {
  nameRequired: string;
  phoneRequired: string;
  phoneInvalid: string;
  emailInvalid: string;
  messageRequired: string;
  messageShort: string;
};

const ENDPOINT = 'https://api.web3forms.com/submit';
const form = document.querySelector<HTMLFormElement>('[data-contact-form]');

if (form) {
  const errors = JSON.parse(form.dataset.errors ?? '{}') as Errors;
  const submit = form.querySelector<HTMLButtonElement>('[data-cf-submit]')!;
  const alertBox = form.querySelector<HTMLElement>('[data-cf-error]')!;
  const live = form.querySelector<HTMLElement>('[data-cf-live]')!;
  const success = form.parentElement!.querySelector<HTMLElement>('[data-cf-success]')!;
  const again = success.querySelector<HTMLButtonElement>('[data-cf-again]');
  const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('.field__input'));
  const offlineNote = form.querySelector<HTMLElement>('[data-cf-offline-note]');
  const offlineBox = form.querySelector<HTMLElement>('[data-cf-offline]');
  const offlineLink = form.querySelector<HTMLAnchorElement>('[data-cf-offline-link]');
  /**
   * Opened from a local folder (the offline copy): Web3Forms rejects requests from origin "null"
   * (CORS preflight 403), so the form never tries to send. It explains that up front and, on submit,
   * hands the visitor's message to WhatsApp instead.
   */
  const isFile = location.protocol === 'file:';
  if (isFile && offlineNote) offlineNote.hidden = false;
  let attempted = false;
  let busy = false;

  // JS takes over validation UI from here on
  form.noValidate = true;

  const ICON =
    '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 4.5v4.2M8 11.2h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

  function messageFor(el: HTMLInputElement | HTMLTextAreaElement): string {
    const value = el.value.trim();
    switch (el.name) {
      case 'name':
        return value ? '' : errors.nameRequired;
      case 'phone': {
        if (!value) return errors.phoneRequired;
        const digits = value.replace(/\D/g, '');
        const shapeOk = /^[\d\s()+\-.]+$/.test(value);
        return shapeOk && digits.length >= 9 && digits.length <= 15 ? '' : errors.phoneInvalid;
      }
      case 'email':
        if (!value) return '';
        return el.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? errors.emailInvalid : '';
      case 'message':
        if (!value) return errors.messageRequired;
        return value.length < 10 ? errors.messageShort : '';
      default:
        return '';
    }
  }

  function render(el: HTMLInputElement | HTMLTextAreaElement, msg: string) {
    const out = el.closest('[data-field]')?.querySelector<HTMLElement>('[data-field-error]');
    if (msg) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
    if (out) out.innerHTML = msg ? `${ICON}<span></span>` : '';
    if (out && msg) out.querySelector('span')!.textContent = msg;
  }

  function validateAll(): (HTMLInputElement | HTMLTextAreaElement)[] {
    const invalid: (HTMLInputElement | HTMLTextAreaElement)[] = [];
    for (const el of fields) {
      const msg = messageFor(el);
      render(el, msg);
      if (msg) invalid.push(el);
    }
    return invalid;
  }

  // Free-text fields follow the direction of what the visitor types (English in the Hebrew form and
  // vice versa). Empty fields keep the page direction so placeholders stay aligned with the labels.
  const STRONG = /[A-Za-z\p{Script=Hebrew}\p{Script=Arabic}]/u;
  for (const el of fields) {
    if (el.getAttribute('dir') === 'ltr') continue; // phone / email are always LTR
    const sync = () => {
      const first = el.value.match(STRONG)?.[0];
      if (!first) el.removeAttribute('dir');
      else el.dir = /[A-Za-z]/.test(first) ? 'ltr' : 'rtl';
    };
    el.addEventListener('input', sync);
    form.addEventListener('reset', () => window.setTimeout(sync));
  }

  // Live feedback: validate on blur once touched; clear errors as soon as the value becomes valid
  for (const el of fields) {
    el.addEventListener('blur', () => {
      if (attempted || el.value.trim()) render(el, messageFor(el));
    });
    el.addEventListener('input', () => {
      if (el.getAttribute('aria-invalid') === 'true' && !messageFor(el)) render(el, '');
    });
  }

  function setBusy(on: boolean) {
    busy = on;
    submit.toggleAttribute('data-loading', on);
    submit.setAttribute('aria-busy', String(on));
    submit.disabled = on;
    live.textContent = on ? form!.dataset.sending ?? '' : '';
  }

  function showError() {
    alertBox.hidden = false;
    // restart the entrance animation
    alertBox.style.animation = 'none';
    void alertBox.offsetWidth;
    alertBox.style.animation = '';
  }

  function showOffline(data: Record<string, string>) {
    if (!offlineBox) return showError();
    const number = form!.dataset.waNumber ?? '';
    const greeting = form!.dataset.waGreeting ?? '';
    const signature = [data.name, data.phone].filter(Boolean).join(' · ');
    const NL = String.fromCharCode(10);
    const parts = [greeting, data.message ?? '', signature ? `— ${signature}` : ''].filter(Boolean);
    const text = parts.join(NL + NL);
    if (offlineLink) offlineLink.href = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    alertBox.hidden = true;
    offlineBox.hidden = false;
    offlineBox.style.animation = 'none';
    void offlineBox.offsetWidth;
    offlineBox.style.animation = '';
    offlineLink?.focus({ preventScroll: true });
  }

  function showSuccess() {
    form!.hidden = true;
    form!.parentElement!.querySelector<HTMLElement>('.cf-panel__head')?.setAttribute('hidden', '');
    success.hidden = false;
    success.focus({ preventScroll: true });
  }

  again?.addEventListener('click', () => {
    success.hidden = true;
    form.parentElement!.querySelector<HTMLElement>('.cf-panel__head')?.removeAttribute('hidden');
    form.hidden = false;
    attempted = false;
    fields[0]?.focus();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;
    attempted = true;
    alertBox.hidden = true;
    if (offlineBox) offlineBox.hidden = true;

    const invalid = validateAll();
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    // Honeypot ticked → silently "succeed" without sending
    if (data.botcheck) {
      showSuccess();
      return;
    }
    if (isFile) {
      showOffline(data);
      return;
    }
    if (!data.access_key) {
      // Not configured (missing PUBLIC_WEB3FORMS_KEY): fail visibly instead of pretending
      showError();
      return;
    }

    setBusy(true);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      const json = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (res.ok && json.success) {
        form.reset();
        fields.forEach((el) => render(el, ''));
        showSuccess();
      } else {
        showError();
      }
    } catch {
      showError();
    } finally {
      window.clearTimeout(timer);
      setBusy(false);
    }
  });
}
