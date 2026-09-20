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
  if (!story) return;

  const deck = story.querySelector('.story-copy-deck');
  const canvas = story.querySelector('.story-canvas');
  const stack = story.querySelector('.story-stage-stack');
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

  let stage = 0;
  let animating = false;
  let gesture = null;

  const clearInline = collection => collection.forEach(el => {
    el.style.removeProperty('opacity');
    el.style.removeProperty('transform');
    el.style.removeProperty('transition');
  });
  const setMotion = (el, transform, opacity, transition) => {
    if (!el) return;
    if (transform != null) el.style.setProperty('transform', transform, 'important');
    if (opacity != null) el.style.setProperty('opacity', String(opacity), 'important');
    if (transition != null) el.style.setProperty('transition', transition, 'important');
  };

  const updateMeta = () => {
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

  const finalize = next => {
    stage = Math.max(0, Math.min(meta.length - 1, next));
    clearInline(copies); clearInline(visuals);
    copies.forEach((el, i) => {
      const active = i === stage;
      el.classList.toggle('mobile-active', active);
      el.classList.remove('mobile-neighbor');
      el.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    visuals.forEach((el, i) => {
      const active = i === stage;
      el.classList.toggle('mobile-active', active);
      el.classList.toggle('is-visible', active);
      el.classList.remove('mobile-neighbor');
    });
    deck?.classList.remove('mobile-dragging');
    stack?.classList.remove('mobile-dragging');
    updateMeta();
    animating = false;
    gesture = null;
  };

  const setPair = (collection, from, to, dx, width, direction) => {
    const progress = Math.min(1, Math.abs(dx) / Math.max(1, width));
    const currentEl = collection[from];
    const targetEl = collection[to];
    if (!currentEl || !targetEl) return;
    const targetX = direction * width + dx;
    setMotion(currentEl, `translate3d(${dx}px,0,0) scale(${(1 - progress * .008).toFixed(4)})`, Math.max(.28, 1 - progress * .72));
    setMotion(targetEl, `translate3d(${targetX}px,0,0) scale(${(.99 + progress * .01).toFixed(4)})`, Math.min(1, .08 + progress * .92));
  };

  const prepareNeighbor = to => {
    copies[to]?.classList.add('mobile-neighbor');
    visuals[to]?.classList.add('mobile-neighbor');
  };

  const animateRelease = (from, to, dx, width, direction, commit, velocity) => {
    if (animating) return;
    animating = true;
    const progress = Math.min(1, Math.abs(dx) / width);
    const remaining = commit ? 1 - progress : progress;
    const speedFactor = Math.min(1.35, Math.max(.72, 1.05 - Math.abs(velocity) * .24));
    const duration = Math.max(170, Math.min(420, 340 * remaining * speedFactor + 110));
    const ease = 'cubic-bezier(.22,1,.36,1)';
    deck?.classList.remove('mobile-dragging');
    stack?.classList.remove('mobile-dragging');
    const lists = [copies, visuals];

    lists.forEach(collection => {
      const a = collection[from], b = collection[to];
      if (!a || !b) return;
      const transition = `transform ${duration}ms ${ease}, opacity ${duration}ms ${ease}`;
      if (commit) {
        setMotion(a, `translate3d(${-direction * Math.min(36, width * .08)}px,0,0) scale(.992)`, 0, transition);
        setMotion(b, 'translate3d(0,0,0) scale(1)', 1, transition);
      } else {
        setMotion(a, 'translate3d(0,0,0) scale(1)', 1, transition);
        setMotion(b, `translate3d(${direction * width}px,0,0) scale(.99)`, 0, transition);
      }
    });

    window.setTimeout(() => finalize(commit ? to : from), duration + 35);
  };

  const startGesture = event => {
    if (!mobile.matches || reduce.matches || animating || event.touches.length !== 1) return;
    const t = event.touches[0];
    const vw = document.documentElement.clientWidth;
    if (t.clientX < 26 || t.clientX > vw - 26) return; // do not fight iOS edge gestures
    gesture = { sx:t.clientX, sy:t.clientY, x:t.clientX, lastX:t.clientX, lastT:performance.now(), vx:0, mode:'pending', width:Math.max(1,(canvas || deck).getBoundingClientRect().width), from:stage, to:stage, direction:0, dx:0 };
  };

  const moveGesture = event => {
    if (!gesture || event.touches.length !== 1) return;
    const t = event.touches[0];
    const rawDx = t.clientX - gesture.sx;
    const dy = t.clientY - gesture.sy;
    if (gesture.mode === 'pending') {
      if (Math.abs(rawDx) < 7 && Math.abs(dy) < 7) return;
      if (Math.abs(dy) > Math.abs(rawDx) * 1.1) { gesture.mode = 'vertical'; return; }
      if (Math.abs(rawDx) <= Math.abs(dy) * 1.15) return;
      gesture.mode = 'horizontal';
      gesture.direction = rawDx < 0 ? 1 : -1;
      gesture.to = gesture.from + gesture.direction;
      if (gesture.to >= 0 && gesture.to < meta.length) prepareNeighbor(gesture.to);
      deck?.classList.add('mobile-dragging');
      stack?.classList.add('mobile-dragging');
    }
    if (gesture.mode !== 'horizontal') return;
    event.preventDefault();
    const now = performance.now();
    const dt = Math.max(1, now - gesture.lastT);
    gesture.vx = (t.clientX - gesture.lastX) / dt;
    gesture.lastX = t.clientX; gesture.lastT = now;

    let dx = rawDx;
    const atEdge = gesture.to < 0 || gesture.to >= meta.length;
    if (atEdge) dx *= .24; // soft edge resistance, no bounce
    gesture.dx = dx;
    if (!atEdge) {
      setPair(copies, gesture.from, gesture.to, dx, gesture.width, gesture.direction);
      setPair(visuals, gesture.from, gesture.to, dx, gesture.width, gesture.direction);
    } else {
      const el1 = copies[gesture.from], el2 = visuals[gesture.from];
      const edgeScale = 1 - Math.min(.006, Math.abs(dx)/gesture.width*.006);
      [el1,el2].forEach(el => setMotion(el, `translate3d(${dx}px,0,0) scale(${edgeScale})`, 1-Math.min(.16,Math.abs(dx)/gesture.width*.16))); 
    }
  };

  const endGesture = () => {
    if (!gesture) return;
    if (gesture.mode !== 'horizontal') { gesture = null; return; }
    const {from,to,dx,width,direction,vx} = gesture;
    if (to < 0 || to >= meta.length) {
      const duration = 220;
      [copies[from], visuals[from]].forEach(el => {
        if (!el) return;
        setMotion(el, 'translate3d(0,0,0) scale(1)', 1, `transform ${duration}ms cubic-bezier(.22,1,.36,1),opacity ${duration}ms cubic-bezier(.22,1,.36,1)`);
      });
      setTimeout(() => finalize(from), duration + 30); return;
    }
    const distance = Math.abs(dx);
    const velocity = Math.abs(vx);
    const commit = distance >= width * .22 || (velocity >= .48 && distance >= 18);
    animateRelease(from,to,dx,width,direction,commit,velocity);
  };

  const bindSwipe = el => {
    if (!el) return;
    el.addEventListener('touchstart', startGesture, {passive:true});
    el.addEventListener('touchmove', moveGesture, {passive:false});
    el.addEventListener('touchend', endGesture, {passive:true});
    el.addEventListener('touchcancel', () => { if (gesture) { const from=gesture.from; finalize(from); } }, {passive:true});
  };
  bindSwipe(canvas); bindSwipe(deck);

  const goTo = next => {
    if (!mobile.matches || reduce.matches || animating || next === stage || next < 0 || next >= meta.length) return;
    const direction = next > stage ? 1 : -1;
    const width = Math.max(1,(canvas || deck).getBoundingClientRect().width);
    prepareNeighbor(next);
    [copies[next], visuals[next]].forEach(el => setMotion(el, `translate3d(${direction*24}px,0,0) scale(.99)`, 0));
    requestAnimationFrame(() => animateRelease(stage,next,0,width,direction,true,0));
  };

  rails.forEach((el,i) => {
    el.setAttribute('role','button'); el.setAttribute('tabindex','0');
    el.addEventListener('click', () => goTo(i));
    el.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();goTo(i);} });
  });

  const syncMode = () => {
    closeNav();
    if (mobile.matches && !reduce.matches) finalize(Math.max(0,Math.min(meta.length-1,Number(story.dataset.storyStage)||0)));
    else {
      clearInline(copies); clearInline(visuals);
      copies.forEach(el => {el.classList.remove('mobile-active','mobile-neighbor'); el.style.removeProperty('visibility');});
      visuals.forEach(el => el.classList.remove('mobile-active','mobile-neighbor'));
      deck?.classList.remove('mobile-dragging'); stack?.classList.remove('mobile-dragging');
    }
  };

  mobile.addEventListener?.('change', syncMode);
  reduce.addEventListener?.('change', syncMode);
  addEventListener('orientationchange', () => setTimeout(syncMode, 80), {passive:true});
  syncMode();
})();
