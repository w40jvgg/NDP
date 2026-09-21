(() => {
  'use strict';

  const mobile = matchMedia('(max-width: 780px), (max-height: 520px) and (orientation: landscape) and (pointer: coarse)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const body = document.body;
  const nav = document.querySelector('.nav-links');
  const navToggle = document.querySelector('[data-nav-toggle]');

  const syncNav = () => body.classList.toggle('mobile-nav-open', Boolean(mobile.matches && nav?.classList.contains('open')));
  const closeNav = () => {
    if (!nav) return;
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    syncNav();
  };

  navToggle?.addEventListener('click', () => requestAnimationFrame(syncNav));
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('click', event => {
    if (!mobile.matches || !nav?.classList.contains('open')) return;
    if (event.target.closest('.nav-links') || event.target.closest('[data-nav-toggle]')) return;
    closeNav();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNav(); });

  const story = document.querySelector('[data-story]');
  const storyScroll = story?.querySelector('.story-scroll');
  if (!story || !storyScroll) return;

  const copies = [...story.querySelectorAll('.story-copy-panel[data-copy-stage]')];
  const visuals = [...story.querySelectorAll('.story-visual-panel[data-visual-stage]')];
  const rails = [...story.querySelectorAll('.story-rail-step[data-rail-stage]')];
  const bars = [...story.querySelectorAll('.story-progress i')];
  const number = story.querySelector('#story-step-number');
  const current = story.querySelector('#story-current');
  const result = story.querySelector('#story-result');
  const system = story.querySelector('#story-stage-system');

  const meta = [
    ['Аудиофайл → объект произведения','Звук → объект','SYSTEM / AUDIO OBJECT','#8b5cf6'],
    ['NDT → авторы / доли / лицензии','Объект → права','SYSTEM / RIGHTS PASSPORT','#33d6ff'],
    ['ADNA → similarity → verdict','Звук → идентичность','SYSTEM / FINGERPRINT ENGINE','#2de2c4'],
    ['Original → Sample / Remix / Derivative','ID → происхождение','SYSTEM / PROVENANCE GRAPH','#f5b94c'],
    ['Usage event → identified work','Использование → событие','SYSTEM / USAGE RESOLVER','#f472b6'],
    ['Rights graph → splits → amount','Событие → расчёт','SYSTEM / ROYALTY ENGINE','#33d6ff'],
    ['Royalty flow → rights holders','Расчёт → распределение','SYSTEM / CASCADE ROYALTY','#f5b94c'],
    ['Recipients → payment rail','Распределение → выплата','SYSTEM / PAYMENT LAYER','#2de2c4']
  ];

  const clamp01 = value => Math.max(0, Math.min(1, value));
  const smoothstep = (edge0, edge1, value) => {
    if (edge0 === edge1) return value < edge0 ? 0 : 1;
    const t = clamp01((value - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  };
  const envelope = (phase, index) => {
    const distance = Math.abs(phase - index);
    if (distance <= .18) return 1;
    if (distance >= .48) return 0;
    return 1 - smoothstep(.18, .48, distance);
  };

  let activeStage = -1;
  const updateStageMeta = stage => {
    if (stage === activeStage) return;
    activeStage = stage;
    story.dataset.storyStage = String(stage);
    story.style.setProperty('--stage-accent', meta[stage][3]);
    if (number) number.textContent = String(stage + 1).padStart(2, '0');
    if (current) current.textContent = meta[stage][0];
    if (result) result.textContent = meta[stage][1];
    if (system) system.textContent = meta[stage][2];
    rails.forEach((el, i) => {
      el.classList.toggle('active', i === stage);
      el.classList.toggle('done', i < stage);
      el.setAttribute('aria-current', i === stage ? 'step' : 'false');
    });
    bars.forEach((el, i) => {
      el.classList.toggle('is-active', i === stage);
      el.classList.toggle('is-done', i < stage);
    });
  };

  const renderStory = progress => {
    const phase = clamp01(progress) * (meta.length - 1);
    const stage = Math.max(0, Math.min(meta.length - 1, Math.round(phase)));
    updateStageMeta(stage);

    copies.forEach((panel, i) => {
      const weight = envelope(phase, i);
      const direction = Math.sign(i - phase) || 1;
      panel.style.setProperty('--mobile-opacity', weight.toFixed(4));
      panel.style.setProperty('--mobile-y', `${(direction * (1 - weight) * 14).toFixed(2)}px`);
      panel.style.setProperty('--mobile-scale', (0.992 + weight * .008).toFixed(4));
      panel.style.pointerEvents = weight > .72 ? 'auto' : 'none';
      panel.setAttribute('aria-hidden', weight > .72 ? 'false' : 'true');
    });

    visuals.forEach((panel, i) => {
      const weight = envelope(phase, i);
      const direction = Math.sign(i - phase) || 1;
      panel.style.setProperty('--mobile-opacity', weight.toFixed(4));
      panel.style.setProperty('--mobile-y', `${(direction * (1 - weight) * 16).toFixed(2)}px`);
      panel.style.setProperty('--mobile-scale', (0.99 + weight * .01).toFixed(4));
      panel.classList.toggle('is-visible', weight > .985);
    });
  };

  let scheduled = false;
  const onScrollFrame = () => {
    scheduled = false;
    if (!mobile.matches || reduce.matches) return;
    const rect = storyScroll.getBoundingClientRect();
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    const travel = Math.max(1, rect.height - viewport);
    renderStory(clamp01(-rect.top / travel));
  };
  const requestStoryFrame = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(onScrollFrame);
  };

  // The stage rail is an indicator on mobile, not horizontal navigation.
  rails.forEach(el => {
    el.removeAttribute('role');
    el.removeAttribute('tabindex');
  });

  const syncMode = () => {
    closeNav();
    if (mobile.matches && !reduce.matches) {
      requestStoryFrame();
    } else {
      copies.forEach(panel => {
        panel.style.removeProperty('--mobile-opacity');
        panel.style.removeProperty('--mobile-y');
        panel.style.removeProperty('--mobile-scale');
        panel.style.pointerEvents = '';
      });
      visuals.forEach(panel => {
        panel.style.removeProperty('--mobile-opacity');
        panel.style.removeProperty('--mobile-y');
        panel.style.removeProperty('--mobile-scale');
      });
    }
  };

  addEventListener('scroll', requestStoryFrame, { passive: true });
  addEventListener('resize', requestStoryFrame, { passive: true });
  addEventListener('orientationchange', () => setTimeout(requestStoryFrame, 80), { passive: true });
  mobile.addEventListener?.('change', syncMode);
  reduce.addEventListener?.('change', syncMode);
  syncMode();
})();
