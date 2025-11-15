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

// ===== theme toggle (dark by default + remembers choice) - DESKTOP & MOBILE
const themeBtn = $('#themeToggle');
const themeBtnMobile = $('#themeToggleMobile');
const saved = localStorage.getItem('theme');

// Set initial theme
if (!saved) {
  document.body.classList.add('dark');
  localStorage.setItem('theme','dark');
} else if (saved === 'dark') {
  document.body.classList.add('dark');
} else {
  document.body.classList.remove('dark');
}

// Update button text function
function updateThemeButtons() {
  const isDark = document.body.classList.contains('dark');
  const icon = isDark ? '🌞' : '🌙';
  const text = isDark ? 'Light' : 'Dark';
  
  if (themeBtn) themeBtn.textContent = `${icon} ${text}`;
  if (themeBtnMobile) themeBtnMobile.innerHTML = `${icon} <span class="theme-text">${text} Mode</span>`;
}

// Initialize buttons
updateThemeButtons();

// Toggle theme function
function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeButtons();
}

// Desktop button
themeBtn?.addEventListener('click', toggleTheme);

// Mobile button
themeBtnMobile?.addEventListener('click', () => {
  toggleTheme();
  // Close mobile menu after theme change
  menu?.classList.remove('open');
  burger?.setAttribute('aria-expanded', 'false');
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

// ===== tap-to-flip (Skills + Projects)
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return; // allow links on back side
    card.classList.toggle('flipped');
  });
});

// ===== blog tag filter
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

// ===== custom cursor
const cursor = document.querySelector('.cursor');
if (cursor) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // Enlarge on hover (links, buttons, etc.)
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}
