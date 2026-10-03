/* ==========================================================================
   Thor Photography
   1. Config  2. Helpers  3. Film scenes  4. Gallery + lightbox
   5. Form, contact, menu  6. Motion (Lenis, GSAP, ScrollTrigger)
   ========================================================================== */
(() => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. CONFIG — everything you are likely to edit lives here
     ------------------------------------------------------------------------ */
  const CONFIG = {
    // Contact details. Leave a value empty ("") to hide that link.
    email: 'rohitbohara.xvi@gmail.com',
    whatsapp: '917990089139',   // digits only, with country code
    instagram: 'https://www.instagram.com/igthorsir',

    // Sound. Leave soundFile empty to use the built-in ambient tone, or add your
    // own music file (e.g. 'assets/audio/ambient.mp3') and it loops instead.
    soundFile: '',
    soundVolume: 0.5,     // 0 to 1

    // Booking form. Paste a Formspree or Web3Forms endpoint URL here.
    // If empty, the form opens a pre-filled email to the address above.
    formEndpoint: '',

    // Film scenes. Export frames with the ffmpeg commands in BUILD-PLAN.md,
    // then set the counts to the number of files in each folder.
    scenes: {
      1: { path: 'assets/frames/scene-1', count: 120, mobilePath: 'assets/frames/scene-1-m', mobileCount: 60, poster: 'assets/posters/scene-1.webp' },
      2: { path: 'assets/frames/scene-2', count: 120, mobilePath: 'assets/frames/scene-2-m', mobileCount: 60, poster: 'assets/posters/scene-2.webp' },
      3: { path: 'assets/frames/scene-3', count: 120, mobilePath: 'assets/frames/scene-3-m', mobileCount: 60, poster: 'assets/posters/scene-3.webp' }
    },

    // Selected work, imported from instagram.com/igthorsir and
    // instagram.com/thor.fotography on 3 Oct 2026.
    //   video  optional: path to a film in assets/video/ (adds a play mark and
    //          opens a player in the full-screen viewer)
    //   title  a plain description of the photograph, not the Instagram caption
    //   place  optional
    //   exif   optional exposure line, e.g. '85mm  f/1.8  1/200  ISO 400'
    //   src    image file in assets/work/
    //   w, h   pixel size of that file (keeps the layout steady while loading)
    //   cat    'portraits' | 'events' | 'cinematic'
    //   size   'tall' | 'mid' | 'low'  (height in the contact sheet)
    //   video  optional path or URL to a film; adds a play mark
    work: [
      { src: 'assets/work/01.jpg', w: 1500, h: 2000, title: 'Chintamani visarjan', place: 'Chinchpokli, Mumbai', cat: 'events', size: 'tall', exif: '' },
      { src: 'assets/work/18.jpg', w: 1440, h: 1920, title: 'Golden hour portrait', place: '', cat: 'portraits', size: 'mid', exif: '' },
      { src: 'assets/work/17.jpg', w: 1500, h: 2000, title: 'Clock tower at night', place: '', cat: 'cinematic', size: 'tall', exif: '' },
      { src: 'assets/work/02.jpg', w: 1600, h: 2000, title: 'Mumbai cha Raja', place: 'Ganesh Galli, Mumbai', cat: 'events', size: 'mid', exif: '' },
      { src: 'assets/work/14.jpg', w: 1350, h: 1688, title: 'Street vendor at night', place: 'Mumbai', cat: 'portraits', size: 'tall', exif: '' },
      { src: 'assets/work/06.jpg', w: 1440, h: 810, title: 'Bandra-Worli Sea Link', place: 'Mumbai', cat: 'cinematic', size: 'low', exif: '' },
      { src: 'assets/work/19.jpg', w: 1440, h: 1534, title: 'Gudi Padwa performer', place: '', cat: 'events', size: 'mid', exif: '' },
      { src: 'assets/work/03.jpg', w: 1440, h: 1920, title: 'Child portrait', place: '', cat: 'portraits', size: 'tall', exif: '' },
      { src: 'assets/work/16.jpg', w: 1500, h: 2000, title: 'Street at night', place: 'Mumbai', cat: 'cinematic', size: 'mid', exif: '' },
      { src: 'assets/work/13.jpg', w: 1600, h: 2000, title: 'Ganpati idol', place: '', cat: 'events', size: 'tall', exif: '' },
      { src: 'assets/work/12.jpg', w: 1440, h: 1800, title: 'Silhouette in neon light', place: '', cat: 'cinematic', size: 'mid', exif: '' },
      { src: 'assets/work/20.jpg', w: 1080, h: 1440, title: 'Gudi Padwa portrait', place: '', cat: 'events', size: 'tall', exif: '' },
      { src: 'assets/work/04.jpg', w: 1440, h: 1920, title: 'Toddler portrait', place: '', cat: 'portraits', size: 'mid', exif: '' },
      { src: 'assets/work/15.jpg', w: 1157, h: 1447, title: 'Night street', place: 'Mumbai', cat: 'cinematic', size: 'tall', exif: '' },
      { src: 'assets/work/07.jpg', w: 1440, h: 1920, title: 'Diwali portrait', place: '', cat: 'events', size: 'mid', exif: '' },
      { src: 'assets/work/05.jpg', w: 1440, h: 1920, title: 'Cat at golden hour', place: '', cat: 'cinematic', size: 'tall', exif: '' }
    ]
  };

  /* ------------------------------------------------------------------------
     2. HELPERS
     ------------------------------------------------------------------------ */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const label = (item) => item.place ? `${item.title}, ${item.place}` : item.title;
  const pad = (n, len) => String(n).padStart(len, '0');
  const mix = (c1, c2, t) => `rgb(${c1.map((v, i) => Math.round(lerp(v, c2[i], t))).join(',')})`;

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HAS_GSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const MOTION = HAS_GSAP && !REDUCED;
  const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isMobile = () => window.innerWidth < 768;

  let lenis = null;

  /* ------------------------------------------------------------------------
     3. FILM SCENES — image sequence on canvas, with a drawn stand-in
        until real frames exist
     ------------------------------------------------------------------------ */
  const STAND_IN = {
    // Scene 1: lens rings and a key light, with one flash near the end
    1(ctx, w, h, p) {
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
      const kx = w * (0.8 - 0.22 * p), ky = h * 0.4, kr = h * (0.6 + 0.25 * p);
      let g = ctx.createRadialGradient(kx, ky, 0, kx, ky, kr);
      g.addColorStop(0, 'rgba(216,195,160,0.24)'); g.addColorStop(1, 'rgba(216,195,160,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const px = w * (0.26 + 0.1 * p), py = h * 0.52, pr = h * 0.14;
      g = ctx.createRadialGradient(px, py, 0, px, py, pr);
      g.addColorStop(0, 'rgba(255,170,96,0.28)'); g.addColorStop(1, 'rgba(255,170,96,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const cx = w * (0.7 - 0.06 * p), cy = h * 0.46, r = h * (0.44 - 0.26 * p);
      for (let i = 0; i < 5; i++) {
        ctx.beginPath(); ctx.arc(cx, cy, r * (1 - i * 0.17), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(216,195,160,${0.26 - i * 0.035})`;
        ctx.lineWidth = Math.max(1, h * 0.002); ctx.stroke();
      }
      g = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.22, 0, cx, cy, r * 0.5);
      g.addColorStop(0, 'rgba(242,239,234,0.16)'); g.addColorStop(1, 'rgba(242,239,234,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2); ctx.fill();
      const flash = Math.max(0, 1 - Math.abs(p - 0.88) / 0.05);
      if (flash > 0) { ctx.fillStyle = `rgba(242,232,214,${0.5 * flash})`; ctx.fillRect(0, 0, w, h); }
    },
    // Scene 2: dusk falling to night over a curved bay of street lamps
    2(ctx, w, h, p) {
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, mix([46, 30, 22], [3, 5, 12], p));
      sky.addColorStop(0.62, mix([190, 122, 62], [16, 24, 48], p));
      sky.addColorStop(0.64, mix([40, 26, 18], [4, 6, 12], p));
      sky.addColorStop(1, '#000');
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
      const n = 54;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const on = clamp((p - (0.3 + t * 0.35)) / 0.08, 0, 1);
        if (!on) continue;
        const x = w * (0.4 + 0.72 * t - 0.12 * p);
        const y = h * (0.66 - 0.1 * Math.sin(t * Math.PI * 0.85));
        const r = h * lerp(0.022, 0.005, t);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(255,214,150,${0.85 * on})`);
        g.addColorStop(0.6, `rgba(255,190,120,${0.35 * on})`);
        g.addColorStop(1, 'rgba(255,190,120,0)');
        ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
        ctx.fillStyle = `rgba(255,200,130,${0.1 * on})`;
        ctx.fillRect(x - r * 0.3, y + r, r * 0.6, h * 0.12 * (1 - t * 0.6));
      }
    },
    // Scene 3: a framed print arriving on a gallery wall under one spotlight
    3(ctx, w, h, p) {
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.47;
      const fh = h * lerp(0.2, 0.6, p), fw = fh * 0.8;
      let g = ctx.createRadialGradient(cx, cy - fh * 0.7, 0, cx, cy, fh * 1.3);
      g.addColorStop(0, `rgba(216,195,160,${0.08 + 0.2 * p})`); g.addColorStop(1, 'rgba(216,195,160,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      g = ctx.createLinearGradient(0, cy - fh / 2, 0, cy + fh / 2);
      g.addColorStop(0, '#4a3625'); g.addColorStop(1, '#120d09');
      ctx.fillStyle = g; ctx.fillRect(cx - fw / 2, cy - fh / 2, fw, fh);
      ctx.strokeStyle = `rgba(216,195,160,${0.25 + 0.45 * p})`;
      ctx.lineWidth = Math.max(1, h * 0.003);
      ctx.strokeRect(cx - fw / 2, cy - fh / 2, fw, fh);
    }
  };

  function createFilm(section) {
    const id = section.dataset.scene;
    const cfg = CONFIG.scenes[id];
    const canvas = $('canvas', section);
    const ctx = canvas.getContext('2d');
    const note = $('.film__note', section);
    const mobile = isMobile();
    const path = mobile ? cfg.mobilePath : cfg.path;
    let count = mobile ? cfg.mobileCount : cfg.count;
    const frames = [];
    const state = { p: REDUCED ? 0.6 : 0 };
    let mode = 'stand-in';   // 'stand-in' | 'poster' | 'frames'
    let last = -1;
    let started = false;

    const ready = (img) => img && img.complete && img.naturalWidth > 0;

    function cover(img) {
      const w = canvas.width, h = canvas.height;
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    }

    function draw() {
      if (!canvas.width) return;
      if (mode === 'stand-in') { STAND_IN[id](ctx, canvas.width, canvas.height, state.p); return; }
      let i = mode === 'poster' ? 0 : Math.round(state.p * (count - 1));
      while (i > 0 && !ready(frames[i])) i--;
      if (!ready(frames[i]) || i === last) return;
      last = i;
      cover(frames[i]);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(section.clientWidth * dpr);
      canvas.height = Math.round(section.clientHeight * dpr);
      last = -1;
      draw();
    }

    function loadRest() {
      for (let i = 1; i < count; i++) {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => { last = -1; draw(); };
        img.src = `${path}/${pad(i + 1, 4)}.webp`;
        frames[i] = img;
      }
    }

    function start() {
      if (started) return;
      started = true;
      const first = new Image();
      first.onload = () => {
        frames[0] = first; mode = 'frames'; note.hidden = true; last = -1; draw();
        if ('requestIdleCallback' in window) requestIdleCallback(loadRest); else setTimeout(loadRest, 200);
      };
      first.onerror = () => {
        const poster = new Image();
        poster.onload = () => { frames[0] = poster; count = 1; mode = 'poster'; last = -1; draw(); };
        poster.onerror = () => { note.hidden = false; };
        poster.src = cfg.poster;
      };
      first.src = `${path}/0001.webp`;
    }

    resize();
    window.addEventListener('resize', resize);

    if (id === '1' || !('IntersectionObserver' in window)) start();
    else {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { start(); io.disconnect(); }
      }, { rootMargin: '200% 0px' });
      io.observe(section);
    }

    return { section, state, draw };
  }

  const films = {};
  $$('.film').forEach((s) => { films[s.dataset.scene] = createFilm(s); });

  /* ------------------------------------------------------------------------
     4. GALLERY + LIGHTBOX
     ------------------------------------------------------------------------ */
  const track = $('[data-work-track]');
  const filters = $$('.filter');
  let afterFilter = () => {};

  CONFIG.work.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = `frame frame--${item.size || 'mid'}`;
    li.dataset.cat = item.cat;
    li.innerHTML = `
      <button class="frame__btn" type="button" data-index="${i}" aria-label="View ${label(item)}">
        <img src="${item.src}" alt="${label(item)}" width="${item.w}" height="${item.h}" loading="lazy" decoding="async">
        ${item.video ? '<span class="frame__play" aria-hidden="true"></span>' : ''}
      </button>
      <p class="frame__caption"><span>${label(item)}</span><span class="frame__exif">${item.exif || ''}</span></p>`;
    track.appendChild(li);
  });

  function applyFilter(cat) {
    filters.forEach((b) => {
      const on = b.dataset.filter === cat;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    $$('.frame', track).forEach((li) => { li.hidden = !(cat === 'all' || li.dataset.cat === cat); });
    afterFilter();
  }
  filters.forEach((b) => b.addEventListener('click', () => applyFilter(b.dataset.filter)));

  const lightbox = $('.lightbox');
  const lbMedia = $('[data-lb-media]');
  const lbTitle = $('[data-lb-title]');
  const lbExif = $('[data-lb-exif]');
  let lbList = [];
  let lbPos = 0;

  function showSlide(pos) {
    lbPos = (pos + lbList.length) % lbList.length;
    const item = CONFIG.work[lbList[lbPos]];
    lbMedia.innerHTML = '';
    let el;
    if (item.video) {
      el = document.createElement('video');
      el.src = item.video; el.controls = true; el.playsInline = true; el.poster = item.src;
    } else {
      el = document.createElement('img');
      el.src = item.src; el.alt = `${label(item)}`;
    }
    lbMedia.appendChild(el);
    lbTitle.textContent = `${label(item)}`;
    lbExif.textContent = item.exif || '';
  }

  track.addEventListener('click', (e) => {
    const btn = e.target.closest('.frame__btn');
    if (!btn) return;
    lbList = $$('.frame:not([hidden]) .frame__btn', track).map((b) => Number(b.dataset.index));
    showSlide(lbList.indexOf(Number(btn.dataset.index)));
    if (lightbox.showModal) lightbox.showModal(); else lightbox.setAttribute('open', '');
    if (lenis) lenis.stop();
  });
  $('[data-lb-close]').addEventListener('click', () => lightbox.close());
  $('[data-lb-prev]').addEventListener('click', () => showSlide(lbPos - 1));
  $('[data-lb-next]').addEventListener('click', () => showSlide(lbPos + 1));
  lightbox.addEventListener('close', () => { lbMedia.innerHTML = ''; if (lenis) lenis.start(); });
  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') showSlide(lbPos - 1);
    if (e.key === 'ArrowRight') showSlide(lbPos + 1);
  });
  let touchX = null;
  lightbox.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showSlide(lbPos + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  /* ------------------------------------------------------------------------
     5. CONTACT LINKS, FORM, MENU, ANCHORS
     ------------------------------------------------------------------------ */
  const contactList = $('[data-contact]');
  const addContact = (label, href) => {
    const li = document.createElement('li');
    li.innerHTML = `<a class="link" href="${href}" ${href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${label}</a>`;
    contactList.appendChild(li);
  };
  if (CONFIG.email) addContact(CONFIG.email, `mailto:${CONFIG.email}`);
  if (CONFIG.whatsapp) addContact('WhatsApp', `https://wa.me/${CONFIG.whatsapp}`);
  if (CONFIG.instagram) addContact('Instagram', CONFIG.instagram);
  $$('[data-instagram]').forEach((a) => {
    if (CONFIG.instagram) { a.href = CONFIG.instagram; a.target = '_blank'; a.rel = 'noopener'; }
    else a.hidden = true;
  });

  const form = $('[data-form]');
  const status = $('.form__status', form);
  const submitBtn = $('button[type="submit"]', form);

  function validateField(input) {
    const field = input.closest('.field');
    const error = $('.field__error', field);
    const bad = input.required && !input.value.trim();
    field.classList.toggle('is-invalid', bad);
    input.setAttribute('aria-invalid', String(bad));
    if (error) error.hidden = !bad;
    return !bad;
  }
  $$('[required]', form).forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => { if (input.closest('.field').classList.contains('is-invalid')) validateField(input); });
  });

  const setStatus = (msg, error) => { status.textContent = msg; status.classList.toggle('is-error', !!error); };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const required = $$('[required]', form);
    const results = required.map(validateField);
    if (results.includes(false)) { required[results.indexOf(false)].focus(); return; }
    const data = new FormData(form);

    if (CONFIG.formEndpoint) {
      submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; setStatus('');
      try {
        const res = await fetch(CONFIG.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        setStatus('Enquiry sent. I will be in touch.');
      } catch (err) {
        setStatus('That did not send. Check your connection and try again, or email me directly.', true);
      }
      submitBtn.disabled = false; submitBtn.textContent = 'Send enquiry';
    } else if (CONFIG.email) {
      const body = `Name: ${data.get('name')}\nContact: ${data.get('contact')}\nType of shoot: ${data.get('type')}\nDate: ${data.get('date') || 'Not set'}\n\n${data.get('message')}`;
      window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Shoot enquiry from ' + data.get('name'))}&body=${encodeURIComponent(body)}`;
      setStatus('Your email app should open with the enquiry filled in.');
    } else {
      setStatus('The booking form is not connected yet. Add an email or form endpoint in script.js.', true);
    }
  });

  const nav = $('.nav');
  const menu = $('.menu');
  const toggle = $('.nav__toggle');
  function setMenu(open) {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
  }
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = a.getAttribute('href') === '#top' ? document.body : $(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (!menu.hidden) setMenu(false);
    if (a.dataset.filterLink) applyFilter(a.dataset.filterLink);
    if (lenis) lenis.scrollTo(a.getAttribute('href') === '#top' ? 0 : target, { duration: 1.4 });
    else target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
  });

  /* ------------------------------------------------------------------------
     5b. SOUND — browsers only allow audio after a click, tap or key press,
         so it starts from the "Enter with sound" button or the Sound toggle.
     ------------------------------------------------------------------------ */
  const Sound = (() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    const toggles = $$('[data-sound-toggle]');
    let ctx = null, master = null, music = null, on = false;
    const level = () => clamp(CONFIG.soundVolume, 0, 1);

    function build() {
      if (CONFIG.soundFile) {
        music = new Audio(CONFIG.soundFile);
        music.loop = true; music.volume = 0;
      }
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      if (CONFIG.soundFile) return;
      // Ambient tone: a low open fifth through a slowly breathing filter.
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass'; filter.frequency.value = 520; filter.Q.value = 0.6;
      filter.connect(master);
      [[55, 0.5, 'sine'], [82.41, 0.3, 'sine'], [110, 0.2, 'triangle'], [164.81, 0.1, 'triangle'], [220.6, 0.05, 'triangle']].forEach(([f, g, type], i) => {
        const osc = ctx.createOscillator(); osc.type = type; osc.frequency.value = f; osc.detune.value = i % 2 ? 6 : -6;
        const gain = ctx.createGain(); gain.gain.value = g;
        osc.connect(gain); gain.connect(filter); osc.start();
      });
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.06;
      const depth = ctx.createGain(); depth.gain.value = 240;
      lfo.connect(depth); depth.connect(filter.frequency); lfo.start();
    }

    function set(state) {
      on = state;
      if (on && !ctx && !music) build();
      if (ctx) {
        if (on) ctx.resume();
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(on ? level() * 0.3 : 0, ctx.currentTime, on ? 1.2 : 0.25);
      }
      if (music) {
        if (on) { music.volume = level(); music.play().catch(() => {}); } else music.pause();
      }
      toggles.forEach((b) => { b.setAttribute('aria-pressed', String(on)); b.textContent = on ? 'Sound on' : 'Sound off'; });
    }

    // Camera shutter: two short bursts of filtered noise
    function click() {
      if (!on || !ctx) return;
      [0, 0.07].forEach((delay, i) => {
        const len = Math.floor(ctx.sampleRate * 0.05);
        const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let n = 0; n < len; n++) data[n] = (Math.random() * 2 - 1) * Math.pow(1 - n / len, 3);
        const src = ctx.createBufferSource(); src.buffer = buffer;
        const band = ctx.createBiquadFilter(); band.type = 'bandpass'; band.frequency.value = i ? 1800 : 3200; band.Q.value = 1.2;
        const gain = ctx.createGain(); gain.gain.value = level() * 0.5;
        src.connect(band); band.connect(gain); gain.connect(ctx.destination);
        src.start(ctx.currentTime + delay);
      });
    }

    toggles.forEach((b) => b.addEventListener('click', () => set(!on)));
    document.addEventListener('visibilitychange', () => {
      if (!on) return;
      if (document.hidden) { if (ctx) ctx.suspend(); if (music) music.pause(); }
      else { if (ctx) ctx.resume(); if (music) music.play().catch(() => {}); }
    });
    return { set, click };
  })();

  /* ------------------------------------------------------------------------
     6. MOTION
     ------------------------------------------------------------------------ */
  const hud = $('.hud');
  const frameCount = $('[data-frame-count]');
  const progressBar = $('.progress__bar');
  const preloader = $('.preloader');

  function setPageProgress(p) {
    frameCount.textContent = pad(clamp(Math.round(p * 35) + 1, 1, 36), 3);
    progressBar.style.transform = `scaleX(${p})`;
  }

  // No animation library, or reduced motion: everything is visible and static.
  if (!MOTION) {
    if (preloader) preloader.remove();
    $('.film__scrim--full').style.opacity = 1;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPageProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  if (typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const mobile = isMobile();
  const pinLength = (desktop) => () => '+=' + window.innerHeight * (mobile ? 2 : desktop);
  const activeFilms = new Set();
  const filmToggle = (id) => (self) => {
    if (self.isActive) activeFilms.add(id); else activeFilms.delete(id);
    hud.classList.toggle('is-film', activeFilms.size > 0);
  };

  // Shutter blade, used at the act breaks
  const shutter = $('.shutter');
  gsap.set(shutter, { y: 0, yPercent: -101 });
  const fireShutter = () => { Sound.click(); return gsap.fromTo(shutter, { yPercent: -101 }, { yPercent: 101, duration: 0.7, ease: 'expo.inOut', overwrite: true }); };

  /* --- Page-load sequence -------------------------------------------------- */
  const heroLines = $$('.hero__title .line__inner');
  gsap.set(heroLines, { yPercent: 115 });
  gsap.set(['.hero__sub', '.hero__actions', '.hero__cue', '.nav'], { autoAlpha: 0 });
  if (lenis) lenis.stop();
  window.scrollTo(0, 0);

  const counter = { v: 0 };
  const preCount = $('[data-preload-count]');
  const enterBox = $('.preloader__enter');
  let entered = false;
  function enter(withSound) {
    if (entered) return;
    entered = true;
    Sound.set(withSound);
    Sound.click();
    gsap.timeline({ onComplete: () => { if (lenis) lenis.start(); } })
      .to(preloader, { yPercent: -100, duration: 0.7, ease: 'expo.inOut', onComplete: () => preloader.remove() })
      .to(heroLines, { yPercent: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12 }, '-=0.25')
      .to(['.nav', '.hero__sub', '.hero__actions', '.hero__cue'], { autoAlpha: 1, duration: 0.9, ease: 'power2.out', stagger: 0.08 }, '-=0.6');
  }
  $$('[data-enter]', preloader).forEach((b) => b.addEventListener('click', () => enter(b.dataset.enter === 'sound')));
  gsap.to(counter, {
    v: 36, duration: 1.1, ease: 'power2.inOut',
    onUpdate: () => { preCount.textContent = pad(Math.round(counter.v), 3); },
    onComplete: () => {
      enterBox.hidden = false;
      gsap.from(enterBox, { autoAlpha: 0, y: 12, duration: 0.6, ease: 'power2.out' });
      $('[data-enter="sound"]', enterBox).focus({ preventScroll: true });
    }
  });

  /* --- Scene 1: hero ------------------------------------------------------- */
  gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: pinLength(3), pin: true, scrub: 0.6, onToggle: filmToggle('1') }
  })
    .to(films[1].state, { p: 1, ease: 'none', duration: 1, onUpdate: films[1].draw }, 0)
    .to('.hero__cue', { opacity: 0, duration: 0.05 }, 0.02)
    .to('.hero__content', { autoAlpha: 0, y: -60, duration: 0.2, ease: 'power1.in' }, 0.6);

  /* --- Headings that rise from a mask -------------------------------------- */
  // ScrollTriggers are created in page order so pin spacing is measured correctly.
  const rise = (scope) => $$(`${scope} [data-rise]`).forEach((el) => {
    const inner = document.createElement('span');
    inner.className = 'rise';
    while (el.firstChild) inner.appendChild(el.firstChild);
    el.appendChild(inner);
    gsap.from(inner, { yPercent: 115, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  /* --- Stats --------------------------------------------------------------- */
  $$('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const o = { v: 0 };
    el.textContent = '0';
    gsap.to(o, { v: end, duration: 1.2, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(o.v); }, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  /* --- Mission: words brighten with scroll --------------------------------- */
  $$('[data-words]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map((w) => `<span class="word" aria-hidden="true">${w}</span>`).join(' ');
    gsap.fromTo($$('.word', el), { opacity: 0.2 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 48%', scrub: true } });
  });

  /* --- Pillar images open from the bottom ---------------------------------- */
  rise('.pillars');
  $$('[data-mask]').forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });

  /* --- Scene 2: story ------------------------------------------------------ */
  const storyLines = $$('.story__line');
  gsap.set(storyLines, { autoAlpha: 0, y: 24 });
  const storyTl = gsap.timeline({
    scrollTrigger: { trigger: '.story', start: 'top top', end: pinLength(3.5), pin: true, scrub: 0.6, onToggle: filmToggle('2') }
  }).to(films[2].state, { p: 1, ease: 'none', duration: 1, onUpdate: films[2].draw }, 0);
  storyLines.forEach((line, i) => storyTl.to(line, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.06 + i * 0.16));
  ScrollTrigger.create({ trigger: '.story', start: 'top 55%', onEnter: fireShutter });

  /* --- Selected work: horizontal contact sheet on desktop ------------------ */
  rise('.work');
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    const work = $('.work');
    work.classList.add('is-horizontal');
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const tween = gsap.to(track, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: { trigger: work, start: 'top top', end: () => '+=' + distance(), pin: true, scrub: 0.6, invalidateOnRefresh: true }
    });
    afterFilter = () => ScrollTrigger.refresh();
    requestAnimationFrame(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
    return () => { tween.kill(); work.classList.remove('is-horizontal'); gsap.set(track, { clearProps: 'transform' }); afterFilter = () => {}; };
  });

  /* --- Process: the line draws across -------------------------------------- */
  rise('.process');
  gsap.fromTo('.process__steps', { '--draw': 0 }, { '--draw': 1, duration: 1.4, ease: 'power3.inOut', scrollTrigger: { trigger: '.process__steps', start: 'top 80%', once: true } });

  /* --- Scene 3: final frame ------------------------------------------------ */
  const finalParts = ['.final__brand', '.final__line', '.final__actions'];
  gsap.set(finalParts, { autoAlpha: 0, y: 24 });
  gsap.timeline({
    scrollTrigger: { trigger: '.final', start: 'top top', end: pinLength(3), pin: true, scrub: 0.6, onToggle: filmToggle('3') }
  })
    .to(films[3].state, { p: 1, ease: 'none', duration: 0.72, onUpdate: films[3].draw }, 0)
    .to('.film__scrim--full', { opacity: 1, duration: 0.1 }, 0.66)
    .to(hud, { scale: 0.94, duration: 0.08, ease: 'power2.out' }, 0.7)
    .to(finalParts, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'power2.out', stagger: 0.06 }, 0.76)
    .to({}, { duration: 0.02 }, 0.98);
  ScrollTrigger.create({ trigger: '.final', start: 'top 55%', onEnter: fireShutter });

  rise('.book');

  /* --- Page progress, frame counter, navigation ---------------------------- */
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      setPageProgress(self.progress);
      nav.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > window.innerHeight * 0.5);
    }
  });

  /* --- Cursor and magnetic buttons (fine pointers only) -------------------- */
  if (FINE_POINTER) {
    const cursor = $('.cursor');
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3' });
    window.addEventListener('mousemove', (e) => { cursor.classList.add('is-on'); xTo(e.clientX); yTo(e.clientY); });
    document.addEventListener('mouseover', (e) => {
      const view = e.target.closest('.frame__btn');
      const other = !view && e.target.closest('a, button, input, select, textarea');
      cursor.classList.toggle('is-view', !!view);
      cursor.classList.toggle('is-hidden', !!other);
    });

    $$('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, { x: clamp((e.clientX - r.left - r.width / 2) * 0.25, -10, 10), y: clamp((e.clientY - r.top - r.height / 2) * 0.25, -10, 10), duration: 0.4, ease: 'power3.out' });
      });
      btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' }));
    });
  }

  /* --- Refresh once fonts are in ------------------------------------------- */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
