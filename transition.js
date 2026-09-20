(() => {
  'use strict';
  const overlay = document.getElementById('ndp-transition');
  if (!overlay) return;

  const ARRIVAL_KEY = 'ndp-transition-arrival';
  const ARRIVAL_PARAM = 'ndp-transition';
  const TRANSITION_MS = 3000;
  let running = false;

  let arrived = false;
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get(ARRIVAL_PARAM) === '1') {
      arrived = true;
      url.searchParams.delete(ARRIVAL_PARAM);
      history.replaceState(null, '', url.pathname + (url.search ? url.search : '') + (url.hash ? url.hash : ''));
    } else if (sessionStorage.getItem(ARRIVAL_KEY) === '1') {
      arrived = true;
    }
    sessionStorage.removeItem(ARRIVAL_KEY);
  } catch (_) {}

  if (arrived) {
    document.documentElement.classList.add('ndp-arrival');
    window.setTimeout(() => document.documentElement.classList.remove('ndp-arrival'), 700);
  }

  document.querySelectorAll('a[data-ndp-transition]').forEach(link => {
    link.addEventListener('click', event => {
      if (running || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = link.getAttribute('href');
      if (!href) return;
      event.preventDefault();
      running = true;
      document.body.classList.add('ndp-transitioning');
      overlay.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => overlay.classList.add('is-active'));

      let target = href;
      try {
        const url = new URL(href, window.location.href);
        url.searchParams.set(ARRIVAL_PARAM, '1');
        target = url.href;
        sessionStorage.setItem(ARRIVAL_KEY, '1');
      } catch (_) {}

      window.setTimeout(() => { window.location.href = target; }, TRANSITION_MS);
    });
  });
})();
