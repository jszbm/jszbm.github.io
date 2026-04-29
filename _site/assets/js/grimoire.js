// ── GRIMOIRE PORTFOLIO — Main JS ─────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. EMBER PARTICLE CANVAS ────────────────────────────────
  const canvas = document.getElementById('canvas-bg');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x   = Math.random() * W;
        this.y   = init ? Math.random() * H : H + 5;
        this.r   = Math.random() * 1.5 + 0.4;
        this.vy  = -(Math.random() * 0.4 + 0.15);
        this.vx  = (Math.random() - 0.5) * 0.25;
        this.a   = 0;
        this.maxA = Math.random() * 0.7 + 0.2;
        this.life = 0;
        this.maxLife = Math.random() * 300 + 200;
        // gold or cold-star colour
        this.gold = Math.random() > 0.35;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        const t = this.life / this.maxLife;
        this.a = t < 0.15 ? this.maxA * (t / 0.15)
               : t > 0.75 ? this.maxA * (1 - (t - 0.75) / 0.25)
               : this.maxA;
        if (this.life >= this.maxLife) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.a;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.gold ? '#c9a036' : '#e0d4b0';
        ctx.fill();
        if (this.gold && this.r > 1) {
          ctx.shadowColor = '#c9a036';
          ctx.shadowBlur  = 6;
          ctx.fill();
        }
        ctx.restore();
      }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle());

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    };
    loop();
  }

  // ── 2. MOBILE NAV TOGGLE ────────────────────────────────────
  const ham = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (ham && navLinks) {
    ham.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      ham.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });
    // Close when a link is clicked
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        ham.textContent = '☰';
      });
    });
  }

  // ── 3. AUDIO PLAYER ─────────────────────────────────────────
  let currentAudio = null;
  let currentTrackEl = null;

  document.querySelectorAll('.audio-track').forEach(track => {
    const btn  = track.querySelector('.audio-track__play');
    const bar  = track.querySelector('.audio-track__progress-bar');
    const prog = track.querySelector('.audio-track__progress');
    const time = track.querySelector('.audio-track__time');
    const src  = track.dataset.src;
    if (!btn || !src) return;

    let audio = null;

    const fmt = (s) => {
      const m = Math.floor(s / 60);
      const ss = Math.floor(s % 60).toString().padStart(2, '0');
      return `${m}:${ss}`;
    };

    const stop = () => {
      if (audio) { audio.pause(); audio.currentTime = 0; }
      track.classList.remove('playing');
      btn.textContent = '▶';
      if (bar) bar.style.width = '0%';
      if (time) time.textContent = '0:00';
    };

    btn.addEventListener('click', () => {
      // Stop any currently playing track
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        if (currentTrackEl) {
          currentTrackEl.classList.remove('playing');
          currentTrackEl.querySelector('.audio-track__play').textContent = '▶';
        }
      }

      if (!audio) {
        audio = new Audio(src);
        audio.addEventListener('timeupdate', () => {
          if (!audio.duration) return;
          const pct = (audio.currentTime / audio.duration) * 100;
          if (bar) bar.style.width = pct + '%';
          if (time) time.textContent = fmt(audio.currentTime);
        });
        audio.addEventListener('ended', stop);
      }

      if (audio.paused) {
        audio.play().catch(() => {});
        track.classList.add('playing');
        btn.textContent = '⏸';
        currentAudio = audio;
        currentTrackEl = track;
      } else {
        audio.pause();
        track.classList.remove('playing');
        btn.textContent = '▶';
      }
    });

    // Seek on progress bar click
    if (prog && audio) {
      prog.addEventListener('click', (e) => {
        if (!audio.duration) return;
        const r = prog.getBoundingClientRect();
        audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
      });
    }
  });

  // ── 4. SCREENSHOT LIGHTBOX ──────────────────────────────────
  const overlay  = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  const lbCap    = document.getElementById('lb-caption');
  const lbClose  = document.getElementById('lb-close');
  const lbPrev   = document.getElementById('lb-prev');
  const lbNext   = document.getElementById('lb-next');

  if (overlay && lbImg) {
    let images = [];
    let current = 0;

    const show = (i) => {
      current = (i + images.length) % images.length;
      lbImg.src = images[current].src;
      if (lbCap) lbCap.textContent = images[current].caption || '';
    };

    document.querySelectorAll('[data-lightbox]').forEach(el => {
      el.addEventListener('click', () => {
        const group = el.dataset.lightbox;
        images = Array.from(
          document.querySelectorAll(`[data-lightbox="${group}"]`)
        ).map(e => ({ src: e.dataset.src || e.src, caption: e.dataset.caption || '' }));
        const idx = images.findIndex(img => img.src === (el.dataset.src || el.src));
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        show(idx >= 0 ? idx : 0);
      });
    });

    const close = () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      lbImg.src = '';
    };

    lbClose?.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    lbPrev?.addEventListener('click', () => show(current - 1));
    lbNext?.addEventListener('click', () => show(current + 1));

    document.addEventListener('keydown', e => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  // ── 5. SCROLL REVEAL ────────────────────────────────────────
  if ('IntersectionObserver' in window) {
    const style = document.createElement('style');
    style.textContent = `
      .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
      .reveal.in { opacity: 1; transform: none; }
    `;
    document.head.appendChild(style);

    const targets = document.querySelectorAll(
      '.game-card, .discipline-card, .timeline-item, .contact-link'
    );
    targets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });

    targets.forEach(el => obs.observe(el));
  }

  // ── 6. ACTIVE NAV LINK ──────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a[href^="#"]');
  const onScroll = () => {
    let active = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 90) active = s.id;
    });
    navAs.forEach(a => {
      a.classList.toggle('active-nav', a.getAttribute('href') === '#' + active);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

});
