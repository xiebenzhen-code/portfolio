/* ════════════════════════════════════════════════════════════
   动效：移植自 React Bits（reactbits.dev，MIT + Commons Clause）
   原组件为 React，这里按其源码逻辑改写为原生 JS，参数名尽量保持一致。
   Magnet · BlurText · DecryptedText · CountUp · SpotlightCard · Noise · ClickSpark
   ════════════════════════════════════════════════════════════ */
(function () {
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const onView = (el, fn, margin = '0px 0px -12% 0px') => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.disconnect(); fn(); } }), { rootMargin: margin });
    io.observe(el);
  };

  /* ── Magnet：弹簧物理跟随指针（stiffness 170 / damping 16 / mass 1） ── */
  const magnets = new Set();
  let pointer = null;
  function arbitrate() {
    let owner = null, best = Infinity;
    magnets.forEach(m => {
      m.near = null;
      if (!pointer) return;
      const r = m.el.getBoundingClientRect();
      const dx = pointer.x - (r.left + r.width / 2), dy = pointer.y - (r.top + r.height / 2);
      const out = Math.hypot(Math.max(0, Math.abs(dx) - r.width / 2), Math.max(0, Math.abs(dy) - r.height / 2));
      if (out <= m.o.padding && out < best) { best = out; owner = m; m.near = { dx, dy, out }; }
    });
    magnets.forEach(m => { m.owner = m === owner; m.wake(); });
  }
  function magnet(el, opt = {}) {
    if (REDUCE || !FINE) return;
    const o = Object.assign({ padding: 100, magnetStrength: 2, maxOffset: undefined, stiffness: 170, damping: 16, mass: 1 }, opt);
    const cur = { x: 0, y: 0 }, vel = { x: 0, y: 0 };
    let raf = 0, last = 0;
    const m = { el, o, owner: false, near: null };
    const frame = now => {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60; last = now;
      const t = { x: 0, y: 0 };
      if (m.owner && m.near) {
        const pull = 1 - smoothstep(o.padding * 0.5, o.padding, m.near.out);
        t.x = (m.near.dx / o.magnetStrength) * pull; t.y = (m.near.dy / o.magnetStrength) * pull;
        if (o.maxOffset) { const l = Math.hypot(t.x, t.y); if (l > o.maxOffset) { t.x *= o.maxOffset / l; t.y *= o.maxOffset / l; } }
      }
      let rest = true; const steps = Math.ceil(dt / (1 / 120));
      for (let i = 0; i < steps; i++) ['x', 'y'].forEach(k => {
        const f = o.stiffness * (t[k] - cur[k]) - o.damping * vel[k];
        vel[k] += (f / o.mass) * (dt / steps); cur[k] += vel[k] * (dt / steps);
      });
      ['x', 'y'].forEach(k => { if (Math.abs(t[k] - cur[k]) > 0.05 || Math.abs(vel[k]) > 0.05) rest = false; });
      if (rest) { cur.x = t.x; cur.y = t.y; vel.x = vel.y = 0; }
      el.style.transform = `translate3d(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px, 0)`;
      if (!rest) raf = requestAnimationFrame(frame); else last = 0;
    };
    m.wake = () => { if (!raf) raf = requestAnimationFrame(frame); };
    el.style.willChange = 'transform';
    magnets.add(m);
    if (magnets.size === 1) {
      addEventListener('pointermove', e => { if (e.pointerType !== 'touch') { pointer = { x: e.clientX, y: e.clientY }; arbitrate(); } }, { passive: true });
      addEventListener('scroll', arbitrate, { passive: true, capture: true });
      document.documentElement.addEventListener('pointerleave', () => { pointer = null; arbitrate(); });
    }
  }

  /* ── BlurText：逐字从模糊中落下（blur → 半清晰 → 清晰） ── */
  function blurText(el, opt = {}) {
    const o = Object.assign({ animateBy: 'letters', direction: 'top', delay: 200, stepDuration: 0.35, blur: 10, distance: 50, trigger: 'load' }, opt);
    const lines = [...el.children].length ? [...el.children] : [el];
    const pieces = [];
    lines.forEach(line => {
      const text = line.textContent;
      line.setAttribute('aria-label', text);
      const parts = o.animateBy === 'words' ? text.split(/(\s+)/) : [...text];
      line.innerHTML = parts.map(p => /^\s+$/.test(p) ? p : `<span aria-hidden="true" style="display:inline-block;will-change:transform,filter,opacity">${p}</span>`).join('');
      pieces.push(...line.querySelectorAll('span[aria-hidden]'));
    });
    if (REDUCE) return;
    const sign = o.direction === 'top' ? -1 : 1, d = o.distance;
    pieces.forEach(p => { p.style.opacity = 0; p.style.filter = `blur(${o.blur}px)`; });
    const run = () => pieces.forEach((p, i) => {
      p.animate([
        { filter: `blur(${o.blur}px)`, opacity: 0, transform: `translateY(${sign * d}px)` },
        { filter: `blur(${o.blur / 2}px)`, opacity: 0.5, transform: `translateY(${-sign * 5}px)`, offset: 0.5 },
        { filter: 'blur(0px)', opacity: 1, transform: 'translateY(0)' }
      ], { duration: o.stepDuration * 2000, delay: i * o.delay, easing: 'cubic-bezier(0.33,1,0.68,1)', fill: 'forwards' });
    });
    o.trigger === 'view' ? onView(el, run) : run();
  }

  /* ── DecryptedText：字符乱码后依次解出（speed 50ms / maxIterations 10） ── */
  function decrypt(el, opt = {}) {
    const o = Object.assign({ speed: 50, maxIterations: 10, sequential: true, revealDirection: 'start', animateOn: 'hover',
      characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+/<>' }, opt);
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    let timer = 0, running = false;
    const rand = () => o.characters[Math.floor(Math.random() * o.characters.length)];
    const run = () => {
      if (REDUCE || running) return; running = true;
      const revealed = new Set(); let iter = 0;
      const order = [...text].map((_, i) => i).filter(i => text[i].trim());
      if (o.revealDirection === 'end') order.reverse();
      clearInterval(timer);
      timer = setInterval(() => {
        if (o.sequential) { if (order.length) revealed.add(order.shift()); }
        else iter++;
        el.textContent = [...text].map((c, i) => (!c.trim() || revealed.has(i) || (!o.sequential && iter >= o.maxIterations)) ? c : rand()).join('');
        if ((o.sequential && !order.length) || (!o.sequential && iter >= o.maxIterations)) { clearInterval(timer); el.textContent = text; running = false; }
      }, o.speed);
    };
    if (o.animateOn === 'view') onView(el, run);
    else if (o.animateOn === 'load') run();
    else (o.hoverTarget || el).addEventListener('pointerenter', run);
  }

  /* ── CountUp：进入视口后从 0 数到目标值（easeOut） ── */
  function countUp(el, opt = {}) {
    const to = parseFloat(el.dataset.to ?? el.textContent);
    const o = Object.assign({ from: 0, duration: 2, delay: 0, separator: '' }, opt);
    const fmt = v => { const s = Math.round(v).toString(); return o.separator ? s.replace(/\B(?=(\d{3})+(?!\d))/g, o.separator) : s; };
    el.style.fontVariantNumeric = 'tabular-nums';
    if (REDUCE) { el.textContent = fmt(to); return; }
    el.textContent = fmt(o.from);
    onView(el, () => {
      const t0 = performance.now() + o.delay * 1000;
      const ease = t => 1 - Math.pow(1 - t, 3);
      const tick = now => {
        const t = clamp((now - t0) / (o.duration * 1000), 0, 1);
        el.textContent = fmt(o.from + (to - o.from) * ease(t));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* ── SpotlightCard：光斑跟随指针，边框随之亮起（smoothing 0.3） ── */
  function spotlight(card, opt = {}) {
    if (!FINE) return;
    const o = Object.assign({ spotlightColor: 'rgba(102,120,138,.28)', spotlightSize: 240, borderGlow: 0.9, smoothing: 0.3 }, opt);
    card.classList.add('fx-spot');
    const light = document.createElement('span'); light.className = 'fx-spot__light';
    const edge = document.createElement('span'); edge.className = 'fx-spot__edge';
    card.prepend(light); card.append(edge);
    const s = { x: 0, y: 0, p: 0 }, t = { x: 0, y: 0, p: 0 }; let raf = 0;
    const paint = () => {
      raf = 0;
      const k = REDUCE ? 1 : 1 - o.smoothing * 0.9;
      s.x += (t.x - s.x) * k; s.y += (t.y - s.y) * k; s.p += (t.p - s.p) * (REDUCE ? 1 : 0.18);
      const g = `radial-gradient(circle ${o.spotlightSize}px at ${s.x.toFixed(1)}px ${s.y.toFixed(1)}px, ${o.spotlightColor}, transparent 70%)`;
      light.style.background = g; light.style.opacity = s.p;
      edge.style.background = g.replace(o.spotlightColor, o.edgeColor || 'rgba(102,120,138,.9)'); edge.style.opacity = s.p * o.borderGlow;
      if (Math.abs(t.x - s.x) > 0.3 || Math.abs(t.y - s.y) > 0.3 || Math.abs(t.p - s.p) > 0.01) raf = requestAnimationFrame(paint);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(paint); };
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect(); t.x = e.clientX - r.left; t.y = e.clientY - r.top;
      if (!t.p) { s.x = t.x; s.y = t.y; } t.p = 1; wake();
    });
    card.addEventListener('pointerleave', () => { t.p = 0; wake(); });
  }

  /* ── Noise：胶片颗粒（256 平铺，24fps 抖动） ── */
  function noise(host, opt = {}) {
    const o = Object.assign({ opacity: 0.2, fps: 24, blendMode: 'overlay', contrast: 0.6, size: 1 }, opt);
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const ctx = c.getContext('2d'), img = ctx.createImageData(256, 256), d = img.data;
    let st = 1013904223 >>> 0;
    const rnd = () => { st = (st + 0x6d2b79f5) | 0; let t = Math.imul(st ^ (st >>> 15), 1 | st); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const range = 0.5 + o.contrast * 1.1;
    for (let i = 0; i < d.length; i += 4) { const v = clamp(0.5 + (rnd() + rnd() - 1) * range, 0, 1) * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
    ctx.putImageData(img, 0, 0);
    const layer = document.createElement('div');
    layer.className = 'fx-noise';
    Object.assign(layer.style, { backgroundImage: `url(${c.toDataURL()})`, backgroundSize: `${256 * o.size}px`, opacity: o.opacity, mixBlendMode: o.blendMode });
    host.appendChild(layer);
    if (REDUCE || !o.fps) return;
    let last = 0;
    const tick = now => {
      if (now - last > 1000 / o.fps) { last = now; layer.style.backgroundPosition = `${Math.floor(Math.random() * 256)}px ${Math.floor(Math.random() * 256)}px`; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ── ClickSpark：点击处迸出短线（8 条 / ease-out） ── */
  function clickSpark(el, opt = {}) {
    if (REDUCE) return;
    const o = Object.assign({ sparkColor: '#fff', sparkSize: 14, sparkRadius: 30, sparkCount: 8, sparkWidth: 2, duration: 500 }, opt);
    el.addEventListener('pointerdown', e => {
      const cv = document.createElement('canvas'), dpr = devicePixelRatio || 1, R = o.sparkRadius + o.sparkSize + 4;
      cv.width = cv.height = R * 2 * dpr;
      Object.assign(cv.style, { position: 'fixed', left: `${e.clientX - R}px`, top: `${e.clientY - R}px`, width: `${R * 2}px`, height: `${R * 2}px`, pointerEvents: 'none', zIndex: 100 });
      document.body.appendChild(cv);
      const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
      const t0 = performance.now(), ease = t => 1 - Math.pow(1 - t, 3);
      const draw = now => {
        const t = clamp((now - t0) / o.duration, 0, 1), k = ease(t);
        ctx.clearRect(0, 0, R * 2, R * 2);
        ctx.strokeStyle = o.sparkColor; ctx.lineWidth = o.sparkWidth; ctx.lineCap = 'round';
        for (let i = 0; i < o.sparkCount; i++) {
          const a = (2 * Math.PI * i) / o.sparkCount, dist = k * o.sparkRadius, len = o.sparkSize * (1 - k);
          ctx.beginPath();
          ctx.moveTo(R + dist * Math.cos(a), R + dist * Math.sin(a));
          ctx.lineTo(R + (dist + len) * Math.cos(a), R + (dist + len) * Math.sin(a));
          ctx.stroke();
        }
        t < 1 ? requestAnimationFrame(draw) : cv.remove();
      };
      requestAnimationFrame(draw);
    });
  }

  window.FX = { magnet, blurText, decrypt, countUp, spotlight, noise, clickSpark, REDUCE };
})();
