(() => {
  'use strict';

  const overlay = document.getElementById('ndp-transition');
  if (!overlay) return;

  const ARRIVAL_KEY = 'ndp-transition-arrival';
  const ARRIVAL_PARAM = 'ndp-transition';
  const TRANSITION_MS = 1800;
  const EXIT_PHASE_MS = 1480;
  const PROGRESS_MS = 1580;

  const canvas = overlay.querySelector('[data-ndp-wave]');
  const progressFill = overlay.querySelector('.ndp-progress-fill');
  const progressValue = overlay.querySelector('[data-ndp-progress-value]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let running = false;
  let arrived = false;
  let animationFrame = 0;
  let animationStart = 0;
  let canvasState = { width: 0, height: 0, dpr: 1, ctx: null };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const mix = (a, b, t) => Math.round(a + (b - a) * t);

  function colorAt(t) {
    const stops = [
      [0.00, [143, 57, 255]],
      [0.30, [95, 83, 255]],
      [0.52, [42, 151, 255]],
      [0.70, [33, 214, 239]],
      [1.00, [26, 229, 195]]
    ];
    for (let i = 0; i < stops.length - 1; i++) {
      const [p0, c0] = stops[i];
      const [p1, c1] = stops[i + 1];
      if (t <= p1) {
        const u = (t - p0) / (p1 - p0);
        return `rgb(${mix(c0[0], c1[0], u)},${mix(c0[1], c1[1], u)},${mix(c0[2], c1[2], u)})`;
      }
    }
    return 'rgb(26,229,195)';
  }

  function gaussian(x, center, width, amplitude) {
    const d = (x - center) / width;
    return amplitude * Math.exp(-0.5 * d * d);
  }

  function envelope(x) {
    return clamp(
      0.035 +
      gaussian(x, .075, .022, .12) +
      gaussian(x, .145, .030, .30) +
      gaussian(x, .260, .036, .82) +
      gaussian(x, .355, .030, .33) +
      gaussian(x, .505, .042, 1.00) +
      gaussian(x, .620, .030, .33) +
      gaussian(x, .745, .040, .82) +
      gaussian(x, .835, .026, .34) +
      gaussian(x, .925, .020, .16),
      0,
      1.08
    );
  }

  function sizeCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const ctx = canvas.getContext('2d', { alpha: true });
    canvasState = { width, height, dpr, ctx };
  }

  function drawWave(now) {
    const { width, height, ctx } = canvasState;
    if (!ctx || !width || !height) return;

    const t = (now - animationStart) / 1000;
    const calm = reduceMotion.matches;
    const bars = width < 900 ? 92 : 126;
    const centerY = height * .52;
    const usable = height * .43;
    const step = width / bars;
    const lineWidth = Math.max(1.4, step * .34);

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const baseline = ctx.createLinearGradient(0, 0, width, 0);
    baseline.addColorStop(0, 'rgba(126,62,255,.15)');
    baseline.addColorStop(.45, 'rgba(75,149,255,.75)');
    baseline.addColorStop(1, 'rgba(31,229,197,.38)');
    ctx.strokeStyle = baseline;
    ctx.lineWidth = Math.max(1, canvasState.dpr * .75);
    ctx.shadowBlur = 8 * canvasState.dpr;
    ctx.shadowColor = 'rgba(62,157,255,.35)';
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    for (let i = 0; i < bars; i++) {
      const xNorm = i / (bars - 1);
      const x = (i + .5) * step;
      const base = envelope(xNorm);
      const phase = i * .41;
      const breathing = calm
        ? .90 + .05 * Math.sin(t * 2.0 + phase)
        : .78 + .16 * Math.sin(t * 5.2 + phase) + .08 * Math.sin(t * 9.8 - phase * .37);
      const flicker = calm ? 0 : .035 * Math.sin(t * 19 + phase * 1.9);
      const pulse = 1 + (calm ? .025 : .09) * Math.sin(t * 2.4 - xNorm * 9.0);
      const amp = clamp(base * (breathing + pulse * .18) + flicker, .018, 1.12);
      const half = usable * amp;
      const color = colorAt(xNorm);

      // Faint persistence spike.
      ctx.strokeStyle = color.replace('rgb(', 'rgba(').replace(')', ',.17)');
      ctx.lineWidth = Math.max(1, lineWidth * .38);
      ctx.shadowBlur = 12 * canvasState.dpr;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.moveTo(x, centerY - half * 1.42);
      ctx.lineTo(x, centerY + half * 1.42);
      ctx.stroke();

      // Main rounded oscilloscope bar.
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 10 * canvasState.dpr;
      ctx.shadowColor = color;
      ctx.globalAlpha = .86;
      ctx.beginPath();
      ctx.moveTo(x, centerY - half);
      ctx.lineTo(x, centerY + half);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Moving sweep brightens a narrow part of the signal, imitating a live scan.
    if (!calm) {
      const sweep = ((t * .22) % 1) * width;
      const g = ctx.createLinearGradient(sweep - width * .08, 0, sweep + width * .08, 0);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(.5, 'rgba(158,247,255,.22)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(sweep - width * .08, height * .08, width * .16, height * .84);
    }

    ctx.restore();
  }

  function setProgress(raw) {
    const p = clamp(raw, 0, 1);
    if (progressFill) progressFill.style.transform = `scaleX(${p.toFixed(4)})`;
    if (progressValue) progressValue.textContent = `${Math.round(p * 100)}%`;
  }

  function animate(now) {
    if (!running || !overlay.classList.contains('is-active')) return;
    const elapsed = now - animationStart;
    setProgress(elapsed / PROGRESS_MS);
    drawWave(now);
    animationFrame = requestAnimationFrame(animate);
  }

  function startLiveAnimation() {
    cancelAnimationFrame(animationFrame);
    sizeCanvas();
    animationStart = performance.now();
    setProgress(0);
    animationFrame = requestAnimationFrame(animate);
  }

  function stopLiveAnimation() {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    setProgress(1);
  }

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

  const resize = () => {
    if (overlay.classList.contains('is-active')) sizeCanvas();
  };
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('orientationchange', resize, { passive: true });

  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    running = false;
    stopLiveAnimation();
    setProgress(0);
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
      setProgress(0);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.classList.add('is-active');
          startLiveAnimation();
        });
      });

      let target = href;
      try {
        const url = new URL(href, window.location.href);
        url.searchParams.set(ARRIVAL_PARAM, '1');
        target = url.href;
        sessionStorage.setItem(ARRIVAL_KEY, '1');
      } catch (_) {}

      window.setTimeout(() => {
        setProgress(1);
        overlay.classList.add('is-exiting');
      }, EXIT_PHASE_MS);

      window.setTimeout(() => {
        stopLiveAnimation();
        window.location.href = target;
      }, TRANSITION_MS);
    });
  });
})();
