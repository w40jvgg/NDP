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
  /* Base app owns the primary open/close click handlers; this layer only keeps state/a11y in sync. */
  openButton?.addEventListener('click', () => requestAnimationFrame(() => setOpen(sidebar.classList.contains('open'))));
  closeButton?.addEventListener('click', () => requestAnimationFrame(() => setOpen(sidebar.classList.contains('open'))));
  sidebar.querySelectorAll('.side-link').forEach(link => link.addEventListener('click', () => { if(mobile.matches) setOpen(false); }));

  document.addEventListener('click', event => {
    if (!mobile.matches || !sidebar.classList.contains('open')) return;
    if (event.target.closest('#sidebar') || event.target.closest('#sidebar-open')) return;
    setOpen(false);
  });
  document.addEventListener('keydown', event => { if(event.key==='Escape' && sidebar.classList.contains('open')) setOpen(false); });

  let sx=0, sy=0;
  sidebar.addEventListener('touchstart', event => {
    if(!mobile.matches || event.touches.length!==1) return;
    sx=event.touches[0].clientX; sy=event.touches[0].clientY;
  }, {passive:true});
  sidebar.addEventListener('touchend', event => {
    if(!mobile.matches || !event.changedTouches.length) return;
    const dx=event.changedTouches[0].clientX-sx, dy=event.changedTouches[0].clientY-sy;
    if(dx < -52 && Math.abs(dx) > Math.abs(dy)*1.2) setOpen(false);
  }, {passive:true});

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
