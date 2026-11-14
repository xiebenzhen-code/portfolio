const S = window.SITE;
const $ = s => document.querySelector(s);
const ext = u => /^https?:/.test(u) ? 'target="_blank" rel="noopener"' : '';

/* 没有剧照时的文字封面：小标签（可省）+ 大字标题 */
const tcover = (k, t) => `<span class="tcover">${k ? `<span class="k">${k}</span>` : ''}<b>${t}</b></span>`;

/* 复制文本：优先 Clipboard API，不可用时退回选中复制 */
async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch{
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try{ ok = document.execCommand('copy'); }finally{ ta.remove(); }
    return ok;
  }
}

/* 联系方式：邮箱只从 contact.email 取，其余来自 about.contact */
const CONTACTS = [['邮箱', S.contact.email, 'mailto:' + S.contact.email], ...S.about.contact];

/* 导航 */
$('#logo').textContent = S.name;
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('solid', scrollY > innerHeight * 0.75 - 68);
addEventListener('scroll', onScroll, {passive:true}); onScroll();
$('#menu').addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  $('#menu').setAttribute('aria-expanded', open);
});
$('#links').addEventListener('click', e => { if(e.target.closest('a')){ nav.classList.remove('open'); $('#menu').setAttribute('aria-expanded', false); } });
const secs = ['about','projects','strengths','contact'].map(id => document.getElementById(id));
const io = new IntersectionObserver(es => es.forEach(en => {
  if(en.isIntersecting) document.querySelectorAll('#links a').forEach(a => a.classList.toggle('cur', a.getAttribute('href') === '#' + en.target.id));
}), {rootMargin:'-45% 0px -50% 0px'});
secs.forEach(s => io.observe(s));

/* 1 首屏 */
const H = S.hero;
$('#hero-img').src = H.image;
$('#hero-roles').innerHTML = S.roles.map(r => `<span>${r}</span>`).join('');
$('#hero-title').innerHTML = H.title.map(t => `<span>${t}</span>`).join('');
$('#hero-sub').textContent = H.sub;
$('#hero-acts').innerHTML = `<a class="btn btn-primary" href="${H.primary[1]}">${H.primary[0]}</a><a class="btn btn-ghost" href="${H.secondary[1]}">${H.secondary[0]}</a>`;

/* 2 个人经历 */
const A = S.about;
$('#portrait').innerHTML = A.photo
  ? `<img src="${A.photo}" alt="${S.name}">`
  : `<div class="ph"><div><b>${(S.nameZh || S.name)[0]}</b><small>头像位置：在 content.js 填写 photo</small></div></div>`;
$('#about-title').textContent = A.title;
$('#about-text').innerHTML = A.text.map(t => `<p>${t}</p>`).join('');
$('#about-contact').innerHTML = CONTACTS.map(c => `<div><dt>${c[0]}</dt><dd>${
  c[2] ? `<a href="${c[2]}" ${ext(c[2])}>${c[1]}</a>`
       : `<button class="copy-id" type="button" data-copy="${c[1]}" aria-label="复制${c[0]}">${c[1]}<span>复制</span></button>`
}</dd></div>`).join('');
$('#tl').innerHTML = (S.timeline||[]).map(x => `<li><div class="t">${x.time}</div><div><h3>${x.title}</h3><div class="org">${x.org}</div><p>${x.desc}</p></div></li>`).join('');
$('#stats').innerHTML = A.stats.map(s => `<div class="stat"><b data-to="${s[0]}">${s[0]}</b><span class="u">${s[1]}</span><p>${s[2]}</p></div>`).join('');

/* 3 精选项目 */
$('#proj-grid').innerHTML = S.projects.map((p, i) => `
  <button class="proj${p.wide ? ' wide' : ''}" data-i="${i}" aria-haspopup="dialog">
    <div class="cover${p.coverPos ? ' cover--shot' : ''}">
      ${p.cover
        ? `<img src="${p.cover}" alt="${p.title}" loading="lazy"${p.coverPos ? ` style="object-position:${p.coverPos}"` : ''}>`
        : p.arch
          ? `<div class="arch"><div class="t">${p.title}</div><ol>${p.arch.map(a => `<li>${a}</li>`).join('')}</ol></div>`
          : tcover('', p.title)}
      <span class="kind">${p.kind}</span>
    </div>
    <div class="info">
      <span class="idx mono">${String(i + 1).padStart(2, '0')}</span>
      <h3>${p.title}</h3>
      <p>${p.line}</p>
      <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
    </div>
  </button>`).join('');

/* 4 个人优势 */
$('#str-grid').innerHTML = S.strengths.map((s, i) => `
  <article class="str">
    <span class="n mono">${String(i + 1).padStart(2, '0')}</span>
    <h3>${s.title}</h3>
    <dl><div><dt>擅长</dt><dd>${s.good}</dd></div><div><dt>做法</dt><dd>${s.how}</dd></div><div><dt>解决</dt><dd>${s.solve}</dd></div></dl>
  </article>`).join('');

/* 5 页尾 */
const C = S.contact;
$('#end-title').innerHTML = C.title.map(t => `<span>${t}</span>`).join('');
$('#end-text').textContent = C.text;
$('#end-mail').textContent = C.email; $('#end-mail').href = 'mailto:' + C.email;
$('#copy').addEventListener('click', async e => {
  const btn = e.currentTarget;
  await copyText(C.email);
  btn.textContent = '已复制';
  setTimeout(() => { btn.textContent = '复制邮箱'; }, 2000);
});

/* 微信这类没有链接的联系方式：点一下复制 */
document.addEventListener('click', async e => {
  const b = e.target.closest('.copy-id');
  if(!b) return;
  const tag = b.querySelector('span');
  const label = tag ? tag.textContent : '';
  const ok = await copyText(b.dataset.copy);
  if(!tag) return;
  clearTimeout(b._t);
  tag.textContent = ok ? '已复制' : '复制失败';
  b._t = setTimeout(() => { tag.textContent = label; }, 1800);
});
$('#end-proj').innerHTML = S.projects.map((p, i) => `<a href="#projects" data-i="${i}">${p.title}</a>`).join('');
$('#end-contact').innerHTML = CONTACTS.map(c => c[2]
  ? `<a href="${c[2]}" ${ext(c[2])}>${c[0]}</a>`
  : `<button class="copy-id" type="button" data-copy="${c[1]}" aria-label="复制${c[0]}">${c[0]}：${c[1]}<span>复制</span></button>`).join('');
$('#copyr').textContent = `© ${new Date().getFullYear()} ${S.name} · ${S.domain}`;

/* 项目详情 */
const fig = (s, c) => `<figure><img src="${s}" alt="${c || ''}" loading="lazy">${c ? `<figcaption>${c}</figcaption>` : ''}</figure>`;

/* 视频块
   .mp4/.webm/.mov 直链 → 原生播放器
   B 站 / YouTube 播放器地址 → 嵌 iframe
   抖音等不支持嵌入的 → 封面 + 播放钮，点击去站外看（不会黑屏，也不占站点流量） */
const isFile = src => /\.(mp4|webm|mov)(\?|#|$)/i.test(src);
/* B 站播放器对外站嵌入有校验，访客常见「无法正常播放」，比抖音更不稳定，一律用封面 + 跳转 */
const noEmbed = src => /douyin\.com|iesdouyin\.com|bilibili\.com|b23\.tv/i.test(src);

function videoBlock(b, ctx){
  if(noEmbed(b.video)){
    const poster = b.poster || (ctx && ctx.cover) || '';
    /* 没有封面就留纯色底 + 播放钮：详情里标题就在上方，再放一次会撞在一起 */
    return `<figure class="d-vfig"><a class="d-vout" href="${b.video}" target="_blank" rel="noopener">
      ${poster ? `<img src="${poster}" alt="${b.cap || '影片封面'}" loading="lazy">` : ''}
      <span class="d-vplay" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span>
      <span class="d-vlabel">${b.label || (/bilibili|b23\.tv/i.test(b.video) ? '在 B 站观看' : '在抖音观看')}</span>
      <span class="d-vsr">（在新标签页打开）</span>
    </a>${b.cap ? `<figcaption>${b.cap}</figcaption>` : ''}</figure>`;
  }
  const inner = isFile(b.video)
    ? `<video controls playsinline preload="none"${(b.poster || (ctx && ctx.cover)) ? ` poster="${b.poster || ctx.cover}"` : ''}><source src="${b.video}"></video>`
    : `<iframe src="${b.video}" title="${b.cap || '项目视频'}" loading="lazy"
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
         allowfullscreen></iframe>`;
  return `<figure class="d-vfig"><div class="d-video">${inner}</div>${b.cap ? `<figcaption>${b.cap}</figcaption>` : ''}</figure>`;
}

/* 设定图一排：{ row: [[src, 说明], …], ratio: '4/5' }；手机上变两列 */
function rowBlock(b){
  const n = Math.min(b.row.length, 4);
  return `<div class="d-row" style="--r:${b.ratio || '4/5'};--n:${n}">${b.row.map(x =>
    `<figure><img src="${x[0]}" alt="${x[1] || ''}" loading="lazy">${x[1] ? `<figcaption>${x[1]}</figcaption>` : ''}</figure>`).join('')}</div>`;
}

/* 多视频并排：{ videos: [{ video, cap, poster, label }, …] } */
function videosBlock(b, ctx){
  return `<div class="d-vgrid">${b.videos.map(v => videoBlock(v, ctx)).join('')}</div>`;
}

function block(b, ctx){
  if(b.h)     return `<h4>${b.h}</h4>`;
  if(b.p)     return b.p.map(t => `<p>${t}</p>`).join('');
  if(b.list)  return `<ul>${b.list.map(t => `<li>${t}</li>`).join('')}</ul>`;
  if(b.video) return videoBlock(b, ctx);
  if(b.videos) return videosBlock(b, ctx);
  if(b.img)   return fig(b.img, b.cap);
  if(b.pair) return `<div class="d-pair${b.frame ? ' d-pair--ui' : ''}">${b.pair.map(x => fig(x[0], x[1])).join('')}</div>`;
  if(b.row) return rowBlock(b);
  if(b.phones) return `<div class="d-phones">${b.phones.map(x =>
    `<figure><img src="${x[0]}" alt="${x[1] || ''}" loading="lazy"><figcaption>${x[1] || ''}</figcaption></figure>`).join('')}</div>`;
  if(b.flow) return `<div class="d-flow" role="img" aria-label="系统架构图">${b.flow.map(s => `<div><b>${s[0]}</b>${s.slice(1).map(x => `<span>${x}</span>`).join('')}</div>`).join('')}</div>${b.note ? `<p class="d-note">${b.note}</p>` : ''}`;
  return '';
}
const dlg = $('#detail');
const total = S.projects.length;
const at = i => (i + total) % total;
let current = -1, pushed = false, lastFocus = null;

/* 每个项目都有可分享的地址：#p/signal-map */
function indexFromHash(){
  const m = location.hash.match(/^#p\/([a-z0-9-]+)$/i);
  return m ? S.projects.findIndex(p => p.id === m[1]) : -1;
}

function navBlock(i){
  const prev = S.projects[at(i - 1)], next = S.projects[at(i + 1)];
  return `<nav class="d-nav" aria-label="切换项目">
    <a class="prev" href="#p/${prev.id}" data-i="${at(i - 1)}"><small>上一个</small><b>${prev.title}</b></a>
    <a class="next" href="#p/${next.id}" data-i="${at(i + 1)}"><small>下一个</small><b>${next.title}</b></a>
  </nav>`;
}

function openProject(i, fromHash = false){
  if(i < 0 || i >= total) return;
  const p = S.projects[i];
  if(!dlg.open) lastFocus = document.activeElement;
  current = i;
  $('#d-kind').textContent = `${String(i + 1).padStart(2, '0')} · ${p.kind}`;
  $('#d-body').innerHTML = `<h2 id="d-title">${p.title}</h2><p class="lead">${p.line}</p>
    <dl class="d-facts">${p.facts.map(f => `<div><dt>${f[0]}</dt><dd>${f[1]}</dd></div>`).join('')}</dl>
    ${p.body.map(x => block(x, p)).join('')}
    ${p.links ? `<div class="d-links">${p.links.map(l => `<a class="btn btn-primary" href="${l[1]}" target="_blank" rel="noopener">${l[0]}</a>`).join('')}</div>` : ''}
    ${navBlock(i)}`;
  dlg.scrollTop = 0;
  if(dlg.open){
    history.replaceState({ p: p.id }, '', '#p/' + p.id);
    return;
  }
  dlg.showModal();
  if(!fromHash){ history.pushState({ p: p.id }, '', '#p/' + p.id); pushed = true; }
  $('#d-close').focus({ preventScroll: true });
}

function closeProject(){
  if(!dlg.open) return;
  if(pushed){ pushed = false; history.back(); } else dlg.close();
}

/* 关闭时统一收尾：地址栏回退、焦点归位（ESC / 背景点按 / 按钮都走这里） */
dlg.addEventListener('close', () => {
  pushed = false;
  if(location.hash.startsWith('#p/')) history.replaceState(null, '', location.pathname + location.search);
  if(lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  current = -1;
});

document.addEventListener('click', e => {
  const b = e.target.closest('[data-i]');
  if(b){ e.preventDefault(); openProject(+b.dataset.i); }
});

$('#d-close').addEventListener('click', closeProject);
dlg.addEventListener('click', e => { if(e.target === dlg) closeProject(); });

/* 键盘：← → 切换项目；放大时方向键不切项目 */
addEventListener('keydown', e => {
  if(!dlg.open || document.querySelector('dialog.zoom[open]')) return;
  if(e.key === 'ArrowRight'){ e.preventDefault(); openProject(at(current + 1)); }
  if(e.key === 'ArrowLeft'){ e.preventDefault(); openProject(at(current - 1)); }
});

/* 浏览器前进 / 后退与地址同步 */
addEventListener('popstate', () => {
  const i = indexFromHash();
  if(i >= 0) openProject(i, true);
  else if(dlg.open) dlg.close();
});

/* 详情里点图放大（独立 dialog，才能盖在详情之上） */
function openZoom(src){
  const z = document.createElement('dialog');
  z.className = 'zoom';
  z.setAttribute('aria-label', '放大查看');
  z.innerHTML = `<button class="z-close" type="button">关闭 ✕</button><img src="${src}" alt="">`;
  /* 手机截图原图只有 430px 宽，放大时不超过原始像素，避免糊成一片 */
  const im = z.querySelector('img');
  const cap = () => { if(im.naturalWidth) im.style.maxWidth = im.naturalWidth + 'px'; };
  cap(); im.addEventListener('load', cap);
  /* 图片还没撑开时，打开它那一下的点击会落在背板上；先屏蔽 250ms，避免刚开就被自己关掉 */
  let armed = false;
  setTimeout(() => { armed = true; }, 250);
  z.addEventListener('click', e => {
    if(!armed) return;
    /* 点背板、点图片、点关闭钮都能退出（图片撑满屏幕时，边缘那一圈也是它自己） */
    if(e.target === z || e.target.tagName === 'IMG' || e.target.closest('.z-close')) z.close();
  });
  z.addEventListener('close', () => z.remove());
  document.body.appendChild(z);
  z.showModal();
}
dlg.addEventListener('click', e => {
  const img = e.target.closest('figure img');
  if(img && !img.closest('.d-vout')) openZoom(img.getAttribute('src'));
});
/* 放大层开着时按 ESC：只关放大层，别把整个详情一起关掉 */
dlg.addEventListener('cancel', e => {
  if(document.querySelector('dialog.zoom[open]')) e.preventDefault();
});

/* 打开带 #p/… 的链接时直接进入对应项目 */
const deep = indexFromHash();
if(deep >= 0) openProject(deep, true);

/* ═════════ 滚动进场 ═════════ */
(function reveal(){
  const sets = [
    ['.sec-head', 0],
    ['.about-grid', 60],
    ['.stats', 60],
    ['.proj-grid .proj', 70],
    ['.str-grid .str', 70],
    ['.end .lead', 0],
    ['.end .mail', 60],
    ['.end-cols', 60]
  ];
  const items = [];
  sets.forEach(([sel, step]) => {
    document.querySelectorAll(sel).forEach((el, i) => items.push([el, Math.min(i * step, 280)]));
  });
  if(FX.REDUCE || !('IntersectionObserver' in window)){
    items.forEach(([el]) => el.classList.add('rv', 'in'));
    return;
  }
  const io2 = new IntersectionObserver((es, obs) => es.forEach(en => {
    if(en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  items.forEach(([el, delay]) => {
    el.classList.add('rv');
    el.style.transitionDelay = delay + 'ms';
    io2.observe(el);
  });
})();

/* ═════════ React Bits 动效接入 ═════════ */
FX.noise(document.querySelector('.hero'), {opacity:.12});
FX.noise(document.querySelector('.end'), {opacity:.1});
FX.blurText($('#hero-title'), {animateBy:'letters', delay:45, distance:24});
FX.blurText($('#end-title'), {animateBy:'letters', delay:35, distance:20, trigger:'view'});
document.querySelectorAll('[data-decrypt]').forEach(el => FX.decrypt(el, {animateOn:'view', speed:45}));
FX.decrypt($('#logo'), {animateOn:'hover', speed:50, characters:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'});
document.querySelectorAll('.proj').forEach(card => FX.decrypt(card.querySelector('.idx'), {animateOn:'hover', hoverTarget:card, characters:'0123456789'}));
document.querySelectorAll('.stat b').forEach((el, i) => FX.countUp(el, {duration:2, delay:i * .12}));
document.querySelectorAll('.str').forEach(c => FX.spotlight(c, {spotlightColor:'rgba(255,252,246,.75)', edgeColor:'rgba(102,120,138,.9)', spotlightSize:260}));
document.querySelectorAll('.btn, .copy').forEach(b => {
  FX.magnet(b, {padding:60, magnetStrength:4, maxOffset:10});
  FX.clickSpark(b, {sparkColor: b.classList.contains('btn-primary') ? '#F1ECE3' : '#8F3A2C', sparkSize:9, sparkRadius:22, sparkCount:8, sparkWidth:1.5, duration:450});
});
