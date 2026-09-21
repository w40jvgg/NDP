(() => {
  'use strict';
  const mobile = matchMedia('(max-width: 900px), (max-height: 560px) and (orientation: landscape) and (pointer: coarse)');
  const sidebar = document.getElementById('sidebar');
  const vv = window.visualViewport;
  const openButton = document.getElementById('sidebar-open');
  const closeButton = document.getElementById('sidebar-close');
  if (!sidebar) return;

  const setOpen = open => {
    if (!mobile.matches) open = false;
    sidebar.classList.toggle('open', open);
    document.body.classList.toggle('mobile-drawer-open', open);
    openButton?.setAttribute('aria-expanded', String(open));
  };

  openButton?.setAttribute('aria-controls','sidebar');
  openButton?.setAttribute('aria-expanded','false');
  /* Base app owns click actions; this layer only synchronizes responsive state. */
  openButton?.addEventListener('click', () => requestAnimationFrame(() => setOpen(sidebar.classList.contains('open'))));
  closeButton?.addEventListener('click', () => requestAnimationFrame(() => setOpen(sidebar.classList.contains('open'))));
  sidebar.querySelectorAll('.side-link').forEach(link => link.addEventListener('click', () => { if(mobile.matches) setOpen(false); }));

  // Tap-only close behavior: backdrop / close button / Escape. No horizontal swipe gesture.
  document.addEventListener('click', event => {
    if (!mobile.matches || !sidebar.classList.contains('open')) return;
    if (event.target.closest('#sidebar') || event.target.closest('#sidebar-open')) return;
    setOpen(false);
  });
  document.addEventListener('keydown', event => { if(event.key==='Escape' && sidebar.classList.contains('open')) setOpen(false); });

  const syncViewport = () => {
    const h = vv?.height || window.innerHeight;
    document.documentElement.style.setProperty('--ndp-visual-height', `${h}px`);
    if(!mobile.matches) setOpen(false);
  };
  vv?.addEventListener('resize', syncViewport, {passive:true});
  addEventListener('orientationchange', () => setTimeout(syncViewport,80), {passive:true});
  mobile.addEventListener?.('change', syncViewport);
  syncViewport();
})();
