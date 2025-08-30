// ===== tiny helpers
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

// ===== theme toggle (remembers choice)
const themeBtn = $('#themeToggle');
const saved = localStorage.getItem('theme');

// dark by default
if (!saved) {
  document.body.classList.add('dark');
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

// ===== 3D tilt (for elements with .tilt)
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
