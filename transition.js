(() => {
  'use strict';

  const overlay = document.getElementById('ndp-transition');
  if (!overlay) return;

  const ARRIVAL_KEY = 'ndp-transition-arrival';
  const ARRIVAL_PARAM = 'ndp-transition';
  const TRANSITION_MS = 5000;
  const EXIT_PHASE_MS = 4630;
  let running = false;
  let arrived = false;

  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get(ARRIVAL_PARAM) === '1') {
      arrived = true;
      url.searchParams.delete(ARRIVAL_PARAM);
      history.replaceState(null, '', url.pathname + (url.search || '') + (url.hash || ''));
    } else if (sessionStorage.getItem(ARRIVAL_KEY) === '1') {
      arrived = true;
    }
    sessionStorage.removeItem(ARRIVAL_KEY);
  } catch (_) {}

  if (arrived || document.documentElement.classList.contains('ndp-arrival-pending')) {
    document.documentElement.classList.remove('ndp-arrival-pending');
    overlay.classList.add('is-arrival');
    overlay.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => overlay.classList.add('is-arrival-ready'));
    });

    window.setTimeout(() => {
      overlay.classList.remove('is-arrival', 'is-arrival-ready');
      overlay.setAttribute('aria-hidden', 'true');
    }, 900);
  }

  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    running = false;
    document.body.classList.remove('ndp-transitioning');
    overlay.classList.remove('is-active', 'is-exiting', 'is-arrival', 'is-arrival-ready');
    overlay.setAttribute('aria-hidden', 'true');
  });

  document.querySelectorAll('a[data-ndp-transition]').forEach(link => {
    link.addEventListener('click', event => {
      if (
        running ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return;

      const href = link.getAttribute('href');
      if (!href) return;

      event.preventDefault();
      running = true;

      document.body.classList.add('ndp-transitioning');
      overlay.classList.remove('is-exiting', 'is-arrival', 'is-arrival-ready');
      overlay.setAttribute('aria-hidden', 'false');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => overlay.classList.add('is-active'));
      });

      let target = href;
      try {
        const url = new URL(href, window.location.href);
        url.searchParams.set(ARRIVAL_PARAM, '1');
        target = url.href;
        sessionStorage.setItem(ARRIVAL_KEY, '1');
      } catch (_) {}

      window.setTimeout(() => overlay.classList.add('is-exiting'), EXIT_PHASE_MS);
      window.setTimeout(() => { window.location.href = target; }, TRANSITION_MS);
    });
  });
})();
