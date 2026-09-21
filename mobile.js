(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const phone = matchMedia('(max-width: 767px), (max-height: 639px) and (orientation: landscape) and (pointer: coarse)');
  const shortLandscape = matchMedia('(max-height: 639px) and (orientation: landscape) and (pointer: coarse)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const nav = document.querySelector('.nav-links');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  const navBackdrop = document.createElement('div');
  navBackdrop.className = 'mobile-nav-backdrop';
  navBackdrop.setAttribute('aria-hidden', 'true');
  body.append(navBackdrop);
  let lockedScrollY = 0;
  let scrollLocked = false;

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

  /* ----------------------------------------------------------------------
     Mobile navigation: tap only. No sideways drawer, no swipe-to-close.
     ---------------------------------------------------------------------- */
  const lockPageScroll = () => {
    if (scrollLocked) return;
    lockedScrollY = window.scrollY || 0;
    body.style.position = 'fixed';
    body.style.top = `${-lockedScrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    scrollLocked = true;
  };

  const unlockPageScroll = () => {
    if (!scrollLocked) return;
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    scrollLocked = false;
    window.scrollTo(0, lockedScrollY);
  };

  const syncNavLock = () => {
    const open = Boolean(phone.matches && nav?.classList.contains('open'));
    body.classList.toggle('mobile-nav-open', open);
    navBackdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) lockPageScroll(); else unlockPageScroll();
  };

  const closeNav = () => {
    if (!nav) return;
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    syncNavLock();
  };

  navToggle?.addEventListener('click', () => requestAnimationFrame(syncNavLock));
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
  navBackdrop.addEventListener('click', closeNav);

  document.addEventListener('click', event => {
    if (!phone.matches || !nav?.classList.contains('open')) return;
    if (event.target.closest('.nav-links') || event.target.closest('[data-nav-toggle]')) return;
    closeNav();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeNav();
  });

  /* ----------------------------------------------------------------------
     Mobile graph replacements. Existing SVG nodes remain the source of truth;
     vertical mobile buttons simply trigger those existing interactions.
     ---------------------------------------------------------------------- */
  const makeHeroPath = () => {
    const stage = document.querySelector('.hero .graph-stage');
    const svg = stage?.querySelector(':scope > svg');
    if (!stage || !svg || stage.querySelector('.mobile-hero-path')) return;

    const sourceNodes = [...svg.querySelectorAll('[data-hero-node]')];
    if (!sourceNodes.length) return;

    const path = document.createElement('div');
    path.className = 'mobile-hero-path';
    path.setAttribute('aria-label', 'Граф происхождения произведения — вертикальное представление');

    const buttons = sourceNodes.map((source, index) => {
      const label = source.getAttribute('aria-label') || `Этап ${index + 1}`;
      const [titleRaw, detailRaw] = label.split(':');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mobile-hero-node';
      button.innerHTML = `
        <span class="mobile-hero-dot">${String(index + 1).padStart(2, '0')}</span>
        <span class="mobile-hero-copy"><strong>${escapeHtml(titleRaw.trim())}</strong><small>${escapeHtml((detailRaw || source.dataset.heroNode || '').trim())}</small></span>`;
      button.addEventListener('click', () => {
        source.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        buttons.forEach(item => item.classList.toggle('is-active', item === button));
      });
      source.addEventListener('click', () => buttons.forEach(item => item.classList.toggle('is-active', item === button)));
      return button;
    });

    buttons.forEach(button => path.append(button));
    buttons[0]?.classList.add('is-active');
    stage.insertBefore(path, stage.querySelector('.graph-panel'));
  };

  const demoMeta = {
    original: ['Оригинал', '100%'],
    sample: ['Сэмпл', '18%'],
    remix: ['Ремикс', '67%'],
    derivative: ['Производное', '42%'],
    ai: ['Использование ИИ', 'policy']
  };

  const makeDemoTree = () => {
    const canvas = document.querySelector('.demo-canvas');
    const svg = canvas?.querySelector(':scope > svg');
    if (!canvas || !svg || canvas.querySelector('.mobile-demo-tree')) return;

    const sourceNodes = [...svg.querySelectorAll('[data-demo-node]')];
    const unique = [];
    const seen = new Set();
    sourceNodes.forEach(node => {
      const key = node.dataset.demoNode;
      if (!key || seen.has(key)) return;
      seen.add(key);
      unique.push(node);
    });
    if (!unique.length) return;
    const order = ['original', 'sample', 'remix', 'derivative', 'ai'];
    unique.sort((a, b) => order.indexOf(a.dataset.demoNode) - order.indexOf(b.dataset.demoNode));

    const tree = document.createElement('div');
    tree.className = 'mobile-demo-tree';
    tree.setAttribute('aria-label', 'Происхождение произведения — вертикальная структура');

    const buttons = unique.map((source, index) => {
      const key = source.dataset.demoNode;
      const [fallbackTitle, share] = demoMeta[key] || [key, ''];
      const aria = source.getAttribute('aria-label') || fallbackTitle;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mobile-demo-node';
      button.innerHTML = `
        <span class="mobile-demo-dot">${String(index + 1).padStart(2, '0')}</span>
        <span class="mobile-demo-copy"><strong>${escapeHtml(fallbackTitle)}</strong><small>${escapeHtml(aria)}</small></span>
        <span class="mobile-demo-share">${escapeHtml(share)}</span>`;
      button.addEventListener('click', () => {
        source.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        buttons.forEach(item => item.classList.toggle('is-active', item === button));
      });
      source.addEventListener('click', () => buttons.forEach(item => item.classList.toggle('is-active', item === button)));
      return button;
    });

    buttons.forEach(button => tree.append(button));
    buttons[0]?.classList.add('is-active');
    canvas.append(tree);
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ----------------------------------------------------------------------
     Vertical scroll storytelling for "Как работает".
     It runs only on portrait phone viewports with enough height. On short
     screens and reduced-motion mode, the complete textual fallback is shown.
     ---------------------------------------------------------------------- */
  const story = document.querySelector('[data-story]');
  const storyScroll = story?.querySelector('.story-scroll');
  const copies = [...(story?.querySelectorAll('.story-copy-panel[data-copy-stage]') || [])];
  const visuals = [...(story?.querySelectorAll('.story-visual-panel[data-visual-stage]') || [])];
  const rails = [...(story?.querySelectorAll('.story-rail-step[data-rail-stage]') || [])];
  const bars = [...(story?.querySelectorAll('.story-progress i') || [])];
  const number = story?.querySelector('#story-step-number');
  const current = story?.querySelector('#story-current');
  const result = story?.querySelector('#story-result');
  const system = story?.querySelector('#story-stage-system');

  const storyMeta = [
    ['Аудиофайл → объект произведения', 'Звук → объект', 'SYSTEM / AUDIO OBJECT', '#8b5cf6'],
    ['NDT → авторы / доли / лицензии', 'Объект → права', 'SYSTEM / RIGHTS PASSPORT', '#33d6ff'],
    ['ADNA → similarity → verdict', 'Звук → идентичность', 'SYSTEM / FINGERPRINT ENGINE', '#2de2c4'],
    ['Original → Sample / Remix / Derivative', 'ID → происхождение', 'SYSTEM / PROVENANCE GRAPH', '#f5b94c'],
    ['Usage event → identified work', 'Использование → событие', 'SYSTEM / USAGE RESOLVER', '#f472b6'],
    ['Rights graph → splits → amount', 'Событие → расчёт', 'SYSTEM / ROYALTY ENGINE', '#33d6ff'],
    ['Royalty flow → rights holders', 'Расчёт → распределение', 'SYSTEM / CASCADE ROYALTY', '#f5b94c'],
    ['Recipients → payment rail', 'Распределение → выплата', 'SYSTEM / PAYMENT LAYER', '#2de2c4']
  ];

  const storyEligible = () => phone.matches && !shortLandscape.matches && !reduce.matches && window.innerHeight >= 640;
  let storyNear = false;
  let activeStage = -1;

  const stageWeight = (phase, index) => {
    const distance = Math.abs(phase - index);
    if (distance <= .26) return 1;
    if (distance >= .72) return 0;
    const t = clamp((distance - .26) / (.72 - .26));
    const smooth = t * t * (3 - 2 * t);
    return 1 - smooth;
  };

  const updateStoryMeta = stage => {
    if (stage === activeStage) return;
    activeStage = stage;
    story.dataset.storyStage = String(stage);
    story.style.setProperty('--stage-accent', storyMeta[stage][3]);
    if (number) number.textContent = String(stage + 1).padStart(2, '0');
    if (current) current.textContent = storyMeta[stage][0];
    if (result) result.textContent = storyMeta[stage][1];
    if (system) system.textContent = storyMeta[stage][2];
    rails.forEach((el, index) => {
      el.classList.toggle('active', index === stage);
      el.classList.toggle('done', index < stage);
      el.setAttribute('aria-current', index === stage ? 'step' : 'false');
    });
    bars.forEach((el, index) => {
      el.classList.toggle('is-active', index === stage);
      el.classList.toggle('is-done', index < stage);
    });
  };

  const renderStory = progress => {
    if (!storyEligible() || !story) return;
    const phase = clamp(progress) * (storyMeta.length - 1);
    const stage = clamp(Math.round(phase), 0, storyMeta.length - 1);
    updateStoryMeta(stage);

    copies.forEach((panel, index) => {
      const weight = stageWeight(phase, index);
      const direction = index < phase ? -1 : 1;
      panel.style.setProperty('--mobile-opacity', weight.toFixed(4));
      panel.style.setProperty('--mobile-y', `${(direction * (1 - weight) * 14).toFixed(2)}px`);
      panel.style.setProperty('--mobile-scale', (0.994 + weight * .006).toFixed(4));
      panel.style.pointerEvents = weight > .78 ? 'auto' : 'none';
      panel.setAttribute('aria-hidden', weight > .78 ? 'false' : 'true');
    });

    visuals.forEach((panel, index) => {
      const weight = stageWeight(phase, index);
      const direction = index < phase ? -1 : 1;
      panel.style.setProperty('--mobile-opacity', weight.toFixed(4));
      panel.style.setProperty('--mobile-y', `${(direction * (1 - weight) * 14).toFixed(2)}px`);
      panel.style.setProperty('--mobile-scale', (0.994 + weight * .006).toFixed(4));
      panel.classList.toggle('is-visible', weight > .985);
    });
  };

  const clearStoryInline = () => {
    copies.forEach(panel => {
      panel.style.removeProperty('--mobile-opacity');
      panel.style.removeProperty('--mobile-y');
      panel.style.removeProperty('--mobile-scale');
      panel.style.pointerEvents = '';
      panel.removeAttribute('aria-hidden');
    });
    visuals.forEach(panel => {
      panel.style.removeProperty('--mobile-opacity');
      panel.style.removeProperty('--mobile-y');
      panel.style.removeProperty('--mobile-scale');
    });
  };

  const storyObserver = storyScroll && 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        storyNear = entries.some(entry => entry.isIntersecting);
        if (storyNear) requestFrame();
      }, { rootMargin: '80% 0px 80% 0px', threshold: 0 })
    : null;
  storyObserver?.observe(storyScroll);

  /* ----------------------------------------------------------------------
     Hero continuity + sticky story are driven by one rAF pass. Native scroll
     remains fully in control; no input interception or synthetic inertia.
     ---------------------------------------------------------------------- */
  let scheduled = false;

  const renderHero = () => {
    if (!hero || !phone.matches || reduce.matches) return;
    const rect = hero.getBoundingClientRect();
    const viewport = Math.max(1, window.innerHeight);
    const progress = clamp(-rect.top / Math.max(viewport * .62, rect.height * .48));
    hero.style.setProperty('--mobile-hero-opacity', (1 - progress * .38).toFixed(4));
    hero.style.setProperty('--mobile-hero-y', `${(-progress * 12).toFixed(2)}px`);
    hero.style.setProperty('--mobile-hero-scale', (1 - progress * .012).toFixed(4));
  };

  const renderStoryFrame = () => {
    if (!storyEligible() || !storyScroll || !storyNear) return;
    const rect = storyScroll.getBoundingClientRect();
    const viewport = Math.max(1, window.innerHeight);
    const headerOffset = parseFloat(getComputedStyle(root).getPropertyValue('--ndp-mobile-header')) || 76;
    const visibleHeight = Math.max(1, viewport - headerOffset);
    const travel = Math.max(1, rect.height - visibleHeight);
    const progress = clamp((headerOffset - rect.top) / travel);
    renderStory(progress);
  };

  const onFrame = () => {
    scheduled = false;
    if (phone.matches) {
      header?.classList.toggle('is-mobile-scrolled', (window.scrollY || 0) > 90);
      renderHero();
      renderStoryFrame();
    }
  };

  const requestFrame = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(onFrame);
  };

  addEventListener('scroll', requestFrame, { passive: true });
  addEventListener('resize', requestFrame, { passive: true });
  addEventListener('orientationchange', () => setTimeout(() => {
    syncMode();
    requestFrame();
  }, 90), { passive: true });

  /* ----------------------------------------------------------------------
     Responsive mode synchronization.
     ---------------------------------------------------------------------- */
  const syncMode = () => {
    closeNav();
    root.classList.toggle('ndp-mobile-enhanced', phone.matches);
    root.classList.toggle('ndp-mobile-story', storyEligible());

    if (phone.matches) {
      makeHeroPath();
      makeDemoTree();
    }

    if (!storyEligible()) clearStoryInline();
    if (!phone.matches && hero) {
      hero.style.removeProperty('--mobile-hero-opacity');
      hero.style.removeProperty('--mobile-hero-y');
      hero.style.removeProperty('--mobile-hero-scale');
      header?.classList.remove('is-mobile-scrolled');
    }
    requestFrame();
  };

  phone.addEventListener?.('change', syncMode);
  shortLandscape.addEventListener?.('change', syncMode);
  reduce.addEventListener?.('change', syncMode);

  /* ----------------------------------------------------------------------
     Developer-only overflow audit. It never changes production layout.
     Run with ?debug-overflow=1 or call window.ndpAuditOverflow().
     ---------------------------------------------------------------------- */
  const auditOverflow = () => {
    const width = document.documentElement.clientWidth;
    const offenders = [...document.querySelectorAll('body *')].filter(element => {
      const style = getComputedStyle(element);
      if (style.position === 'fixed' || style.display === 'none') return false;
      const rect = element.getBoundingClientRect();
      return rect.left < -1 || rect.right > width + 1;
    });
    console.group(`[NDP mobile overflow audit] ${offenders.length} offender(s)`);
    offenders.forEach(element => console.log(element, element.getBoundingClientRect()));
    console.groupEnd();
    return offenders;
  };

  window.ndpAuditOverflow = auditOverflow;
  if (new URLSearchParams(location.search).get('debug-overflow') === '1') {
    addEventListener('load', () => setTimeout(auditOverflow, 250), { once: true });
  }

  syncMode();
})();
