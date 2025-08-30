// ===== Helpers
const $ = (sel, ctx=document) => ctx.querySelector(sel);

// ===== Mobile menu toggle
const burger = $('.hamburger');
const menu = $('.nav-menu');

burger?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});

// Close menu when a link is clicked (mobile)
menu?.addEventListener('click', (e) => {
  if (e.target.matches('a')) menu.classList.remove('open');
});

// ===== Theme toggle (light/dark)
const themeBtn = $('#themeToggle');
const saved = localStorage.getItem('theme');
if (saved === 'dark') document.body.classList.add('dark');

themeBtn?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  themeBtn.textContent = document.body.classList.contains('dark') ? '🌞 Light' : '🌙 Dark';
});

// Initialize label
if (themeBtn) {
  themeBtn.textContent = document.body.classList.contains('dark') ? '🌞 Light' : '🌙 Dark';
}
