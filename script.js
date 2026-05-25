// ── NAV: scroll behaviour + mobile toggle ──
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.style.overflow = open ? 'hidden' : '';
});

allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  });
});

// ── COUNTDOWN ──
function updateCountdown() {
  const weddingDate = new Date('2026-09-19T12:00:00');
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    document.getElementById('countdown').innerHTML =
      '<p style="font-family:var(--font-serif);font-size:1.5rem;color:var(--gold-light);">Today is the day! 🎉</p>';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').textContent    = String(days).padStart(2, '0');
  document.getElementById('hours').textContent   = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ── LIGHTBOX ──
const lightbox   = document.getElementById('lightbox');
const lbImg      = document.getElementById('lbImg');
const lbClose    = document.getElementById('lbClose');
const lbPrev     = document.getElementById('lbPrev');
const lbNext     = document.getElementById('lbNext');
const lbBackdrop = document.getElementById('lbBackdrop');
const lbCounter  = document.getElementById('lbCounter');

// Collect only the real images (not aria-hidden duplicates)
const galleryImgs = Array.from(
  document.querySelectorAll('.gallery-row-inner img:not([aria-hidden])')
);

// Deduplicate by src so each photo appears once
const seen = new Set();
const uniqueImgs = galleryImgs.filter(img => {
  if (seen.has(img.src)) return false;
  seen.add(img.src);
  return true;
});

let current = 0;

function openLightbox(index) {
  current = index;
  lbImg.src = uniqueImgs[current].src;
  lbCounter.textContent = `${current + 1} / ${uniqueImgs.length}`;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  lbImg.src = '';
}

function showImage(index) {
  current = (index + uniqueImgs.length) % uniqueImgs.length;
  lbImg.classList.add('fading');
  setTimeout(() => {
    lbImg.src = uniqueImgs[current].src;
    lbCounter.textContent = `${current + 1} / ${uniqueImgs.length}`;
    lbImg.classList.remove('fading');
  }, 150);
}

uniqueImgs.forEach((img, i) => {
  img.addEventListener('click', () => openLightbox(i));
});

// Also wire up the aria-hidden duplicates to open the same image
document.querySelectorAll('.gallery-row-inner img[aria-hidden]').forEach(dup => {
  dup.addEventListener('click', () => {
    const idx = uniqueImgs.findIndex(img => img.src === dup.src);
    if (idx !== -1) openLightbox(idx);
  });
});

lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => showImage(current - 1));
lbNext.addEventListener('click', () => showImage(current + 1));

document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showImage(current - 1);
  if (e.key === 'ArrowRight') showImage(current + 1);
});

// ── SCROLL REVEAL: fade-in on scroll ──
// Only animate if IntersectionObserver is supported
if ('IntersectionObserver' in window) {
  const revealEls = document.querySelectorAll(
    '.schedule-card, .aso-card, .hotel-card, .story-text, .story-image-wrap'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px 0px 0px' }
  );

  revealEls.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}
