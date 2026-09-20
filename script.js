(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const navBtn = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('.nav-links');
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const smallScreen = window.matchMedia?.('(max-width: 780px)');

  let stored = null;
  try { stored = localStorage.getItem('nd-theme'); } catch (_) {}
  const systemLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    try { localStorage.setItem('nd-theme', theme); } catch (_) {}
    themeBtn?.setAttribute('aria-label', theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
  };

  applyTheme(stored || (systemLight ? 'light' : 'dark'));
  themeBtn?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  navBtn?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    navBtn.setAttribute('aria-expanded', String(Boolean(open)));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  requestAnimationFrame(() => root.classList.add('is-ready'));

  const heroDetails = {
    original: ['Исходная запись', 'Полуночный маршрут', 'ND-84F2-19A7 · мастер подтверждён'],
    sample: ['Связь с сэмплом', 'Барабанный фрагмент A', '12,4 с · источник подтверждён'],
    remix: ['Производное произведение', 'Полуночный маршрут / Сдвиг', '67% связи с источником · лицензировано'],
    ai: ['Лицензированное использование ИИ', 'Событие обучения модели', 'Условная лицензия · активна'],
    usage: ['Событие использования', 'Воспроизведение на платформе №74291', 'граф прав разрешён · готово к выплате']
  };

  document.querySelectorAll('[data-hero-node]').forEach(node => {
    const activate = () => {
      const info = heroDetails[node.dataset.heroNode];
      if (!info) return;
      document.querySelector('#hero-detail-kicker').textContent = info[0];
      document.querySelector('#hero-detail-title').textContent = info[1];
      document.querySelector('#hero-detail-copy').textContent = info[2];
    };
    node.addEventListener('click', activate);
    node.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  });

  const demoData = {
    original: { type:'ОРИГИНАЛ', title:'Полуночный маршрут', id:'ND-84F2-19A7', relation:'Исходная мастер-запись', rights:'4 участника', share:'100%', status:'Подтверждено' },
    sample: { type:'СЭМПЛ', title:'Стеклянные барабаны', id:'ND-43BC-0201', relation:'12,4 с из оригинала', rights:'2 участника', share:'18%', status:'Подтверждено' },
    remix: { type:'РЕМИКС', title:'Полуночный маршрут / Сдвиг', id:'ND-1AA3-8C71', relation:'Лицензированный ремикс', rights:'5 участников', share:'67%', status:'Подтверждено' },
    derivative: { type:'ПРОИЗВОДНОЕ', title:'Послеполуночный сигнал', id:'ND-991C-72D0', relation:'Производное от ремикса', rights:'3 участника', share:'42%', status:'С условиями' },
    ai: { type:'ИСПОЛЬЗОВАНИЕ ИИ', title:'Событие обучения модели', id:'EV-2026-11420', relation:'Машиночитаемая лицензия', rights:'Политика лицензии v2', share:'По факту использования', status:'Разрешено' }
  };

  document.querySelectorAll('[data-demo-node]').forEach(node => {
    const update = () => {
      const d = demoData[node.dataset.demoNode];
      if (!d) return;
      document.querySelector('#demo-type').textContent = d.type;
      document.querySelector('#demo-title').textContent = d.title;
      document.querySelector('#demo-id').textContent = d.id;
      document.querySelector('#demo-relation').textContent = d.relation;
      document.querySelector('#demo-rights').textContent = d.rights;
      document.querySelector('#demo-share').textContent = d.share;
      document.querySelector('#demo-status').textContent = d.status;
    };
    node.addEventListener('click', update);
    node.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); update(); }
    });
  });

  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.13, rootMargin: '0px 0px -7% 0px' })
    : null;

  document.querySelectorAll('[data-reveal]').forEach(el => {
    if (reduceMotion?.matches || !revealObserver) el.classList.add('is-visible');
    else revealObserver.observe(el);
  });

  const story = document.querySelector('[data-story]');
  const storyScroll = story?.querySelector('.story-scroll');
  const storyNumber = document.querySelector('#story-step-number');
  const storyCurrent = document.querySelector('#story-current');
  const storyResult = document.querySelector('#story-result');
  const storySystem = document.querySelector('#story-stage-system');
  const progressBars = [...document.querySelectorAll('.story-progress i')];
  const indexItems = [...document.querySelectorAll('.story-index span')];
  const copyPanels = [...document.querySelectorAll('.story-copy-panel[data-copy-stage]')];
  const visualPanels = [...document.querySelectorAll('.story-visual-panel[data-visual-stage]')];
  const railSteps = [...document.querySelectorAll('.story-rail-step[data-rail-stage]')];
  const storyCompact = window.matchMedia?.('(max-width: 680px)');

  const storyData = [
    { current: 'Аудиофайл → объект произведения', result: 'Звук → объект', system: 'SYSTEM / AUDIO OBJECT', color: '#8b5cf6' },
    { current: 'NDT → авторы / доли / лицензии', result: 'Объект → права', system: 'SYSTEM / RIGHTS PASSPORT', color: '#33d6ff' },
    { current: 'ADNA → similarity → verdict', result: 'Звук → идентичность', system: 'SYSTEM / FINGERPRINT ENGINE', color: '#2de2c4' },
    { current: 'Original → Sample / Remix / Derivative', result: 'ID → происхождение', system: 'SYSTEM / PROVENANCE GRAPH', color: '#f5b94c' },
    { current: 'Usage event → identified work', result: 'Использование → событие', system: 'SYSTEM / USAGE RESOLVER', color: '#f472b6' },
    { current: 'Rights graph → splits → amount', result: 'Событие → расчёт', system: 'SYSTEM / ROYALTY ENGINE', color: '#33d6ff' },
    { current: 'Royalty flow → rights holders', result: 'Расчёт → распределение', system: 'SYSTEM / CASCADE ROYALTY', color: '#f5b94c' },
    { current: 'Recipients → payment rail', result: 'Распределение → выплата', system: 'SYSTEM / PAYMENT LAYER', color: '#2de2c4' }
  ];

  const clamp01 = value => Math.max(0, Math.min(1, value));
  const smoothstep = (edge0, edge1, value) => {
    if (edge0 === edge1) return value < edge0 ? 0 : 1;
    const t = clamp01((value - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  };

  // A scene occupies a short plateau, then fully fades out before the next scene
  // becomes visible. The blank micro-interval prevents visual accumulation.
  const stageEnvelope = (phase, stage) => {
    const distance = Math.abs(phase - stage);
    if (distance <= .24) return 1;
    if (distance >= .49) return 0;
    return 1 - smoothstep(.24, .49, distance);
  };

  let currentStage = -1;
  const setStoryStage = (stage, force = false) => {
    if (!story || (!force && stage === currentStage)) return;
    currentStage = stage;
    story.dataset.storyStage = String(stage);
    const data = storyData[stage];
    if (!data) return;

    story.style.setProperty('--stage-accent', data.color);
    if (storyNumber) storyNumber.textContent = String(stage + 1).padStart(2, '0');
    if (storyCurrent) storyCurrent.textContent = data.current;
    if (storyResult) storyResult.textContent = data.result;
    if (storySystem) storySystem.textContent = data.system;

    progressBars.forEach((bar, i) => {
      bar.classList.toggle('is-active', i === stage);
      bar.classList.toggle('is-done', i < stage);
    });
    indexItems.forEach((item, i) => item.classList.toggle('active', i === stage));
    railSteps.forEach((item, i) => {
      item.classList.toggle('active', i === stage);
      item.classList.toggle('done', i < stage);
    });
    copyPanels.forEach((panel, i) => panel.setAttribute('aria-hidden', i === stage ? 'false' : 'true'));
  };

  const renderStoryPhase = progress => {
    if (!story || storyCompact?.matches || reduceMotion?.matches) return;
    const phase = clamp01(progress) * (storyData.length - 1);
    const active = Math.max(0, Math.min(storyData.length - 1, Math.round(phase)));
    setStoryStage(active);

    copyPanels.forEach((panel, i) => {
      const weight = stageEnvelope(phase, i);
      const direction = Math.sign(i - phase) || 1;
      panel.style.setProperty('--copy-opacity', weight.toFixed(4));
      panel.style.setProperty('--copy-y', `${(direction * (1 - weight) * 13).toFixed(2)}px`);
      panel.style.setProperty('--copy-scale', (0.994 + weight * .006).toFixed(4));
      panel.style.setProperty('--copy-blur', `${((1 - weight) * 2.2).toFixed(2)}px`);
      panel.style.pointerEvents = weight > .7 ? 'auto' : 'none';
    });

    visualPanels.forEach((panel, i) => {
      const weight = stageEnvelope(phase, i);
      const direction = Math.sign(i - phase) || 1;
      panel.style.setProperty('--panel-opacity', weight.toFixed(4));
      panel.style.setProperty('--panel-y', `${(direction * (1 - weight) * 12).toFixed(2)}px`);
      panel.style.setProperty('--panel-scale', (0.992 + weight * .008).toFixed(4));
      panel.style.setProperty('--panel-blur', `${((1 - weight) * 2.6).toFixed(2)}px`);
      panel.classList.toggle('is-visible', weight > .985);
    });
  };

  let storyTargetProgress = 0;
  let storyRenderedProgress = 0;
  let storyTweening = false;
  const tickStory = () => {
    if (!story || storyCompact?.matches || reduceMotion?.matches) {
      storyTweening = false;
      return;
    }
    const delta = storyTargetProgress - storyRenderedProgress;
    storyRenderedProgress += delta * .095;
    if (Math.abs(delta) < .00022) storyRenderedProgress = storyTargetProgress;
    renderStoryPhase(storyRenderedProgress);
    if (storyRenderedProgress !== storyTargetProgress) requestAnimationFrame(tickStory);
    else storyTweening = false;
  };
  const setStoryTarget = progress => {
    storyTargetProgress = clamp01(progress);
    if (!storyTweening) {
      storyTweening = true;
      requestAnimationFrame(tickStory);
    }
  };


  const hero = document.querySelector('.hero');
  const heroVisual = document.querySelector('[data-hero-visual]');
  const stackCards = [...document.querySelectorAll('.capability-card')];
  let ticking = false;

  const updateStackCards = () => {
    if (!stackCards.length || smallScreen?.matches || reduceMotion?.matches) {
      stackCards.forEach(card => { card.style.transform = ''; card.style.opacity = ''; });
      return;
    }
    let active = -1;
    stackCards.forEach((card, i) => {
      const stickyTop = 92 + i * 10;
      if (card.getBoundingClientRect().top <= stickyTop + 2) active = i;
    });
    stackCards.forEach((card, i) => {
      if (i < active) {
        const depth = Math.min(active - i, 4);
        card.style.transform = `scale(${1 - depth * 0.012})`;
        card.style.opacity = String(1 - depth * 0.08);
      } else {
        card.style.transform = '';
        card.style.opacity = '';
      }
    });
  };

  const onScrollFrame = () => {
    ticking = false;
    const y = window.scrollY || document.documentElement.scrollTop;
    header?.classList.toggle('is-compact', y > 36);

    if (hero && heroVisual && !reduceMotion?.matches) {
      const heroRect = hero.getBoundingClientRect();
      const heroProgress = Math.max(0, Math.min(1, -heroRect.top / Math.max(1, heroRect.height * .82)));
      const scale = 1 - heroProgress * .055;
      heroVisual.style.transform = `translateY(${heroProgress * 22}px) scale(${scale})`;
      heroVisual.style.opacity = String(1 - heroProgress * .42);
      heroVisual.style.filter = `blur(${heroProgress * 1.2}px)`;
    }

    if (story && storyScroll) {
      if (storyCompact?.matches || reduceMotion?.matches) {
        setStoryStage(0, true);
      } else {
        const rect = storyScroll.getBoundingClientRect();
        const viewport = window.innerHeight;
        const travel = Math.max(1, rect.height - viewport);
        const progress = clamp01(-rect.top / travel);
        setStoryTarget(progress);
      }
    }

    updateStackCards();
  };

  const requestScrollFrame = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScrollFrame);
    }
  };

  setStoryStage(0, true);
  renderStoryPhase(0);
  window.addEventListener('scroll', requestScrollFrame, { passive: true });
  window.addEventListener('resize', requestScrollFrame, { passive: true });
  reduceMotion?.addEventListener?.('change', requestScrollFrame);
  smallScreen?.addEventListener?.('change', requestScrollFrame);
  storyCompact?.addEventListener?.('change', requestScrollFrame);
  requestScrollFrame();
})();
