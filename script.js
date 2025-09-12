// ===== helpers
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// ===== mobile menu
const burger = $('.hamburger');
const menu   = $('.nav-menu');
burger?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});
menu?.addEventListener('click', e => { if(e.target.matches('a')) menu.classList.remove('open'); });

// ===== theme toggle (dark by default + remembers choice)
const themeBtn = $('#themeToggle');
const saved = localStorage.getItem('theme');

if (!saved) {
  document.body.classList.add('dark');          // default to dark once
  localStorage.setItem('theme','dark');
} else if (saved === 'dark') {
  document.body.classList.add('dark');
} else {
  document.body.classList.remove('dark');
}

if (themeBtn) themeBtn.textContent = document.body.classList.contains('dark') ? '🌞 Light' : '🌙 Dark';

themeBtn?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  themeBtn.textContent = document.body.classList.contains('dark') ? '🌞 Light' : '🌙 Dark';
});

// ===== reveal-on-scroll
const revealEls = $$('.reveal');
const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
}, { rootMargin: '0px 0px -10% 0px' }) : null;

revealEls.forEach(el => io?.observe(el) || el.classList.add('revealed'));

// ===== 3D tilt (for .tilt)
function addTilt(el, max = 10){
  let rAF = null;
  const rect = () => el.getBoundingClientRect();
  const onMove = (e) => {
    const b = rect();
    const cx = b.left + b.width/2, cy = b.top + b.height/2;
    const dx = (e.clientX - cx) / (b.width/2);
    const dy = (e.clientY - cy) / (b.height/2);
    const rx = (-dy * max).toFixed(2);
    const ry = ( dx * max).toFixed(2);
    if (rAF) cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => {
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
  };
  const reset = () => { el.style.transform = ''; };
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', reset);
}
$$('.tilt').forEach(addTilt);
// ===== tap-to-flip (Skills + Projects) =====
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return; // allow links on back side
    card.classList.toggle('flipped');
  });
});

// ===== blog tag filter =====
(function(){
  const bar = document.getElementById('tagFilter');
  if (!bar) return;

  const chips = Array.from(bar.querySelectorAll('.tag-chip'));
  const cards = Array.from(document.querySelectorAll('.projects-grid .project'));

  function apply(tag) {
    chips.forEach(c => c.classList.toggle('active', c.dataset.tag === tag));

    cards.forEach(card => {
      const tags = (card.dataset.tags || "").toLowerCase().split(",");
      const show = (tag === "all") || tags.includes(tag.toLowerCase());
      card.style.display = show ? "" : "none";
    });
  }

  bar.addEventListener('click', e => {
    const btn = e.target.closest('.tag-chip');
    if (!btn) return;
    apply(btn.dataset.tag);
  });

  // default load
  apply("all");
})();

// ===== custom cursor =====
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// Enlarge on hover (links, buttons, etc.)
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('active'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

