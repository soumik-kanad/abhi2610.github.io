function updateThemeIcons() {
  const theme = document.documentElement.getAttribute('data-theme');
  document.getElementById('theme-sun')?.classList.toggle('active', theme === 'light');
  document.getElementById('theme-moon')?.classList.toggle('active', theme === 'dark');
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcons();
}

function initTheme() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  // Prevent stacking listeners on persisted element
  if (!toggle.dataset.bound) {
    toggle.addEventListener('click', toggleTheme);
    toggle.dataset.bound = '1';
  }

  updateThemeIcons();
}

// Set theme on incoming document BEFORE swap — prevents light flash
document.addEventListener('astro:before-swap', (e: any) => {
  const saved = localStorage.getItem('theme');
  if (saved) {
    e.newDocument.documentElement.setAttribute('data-theme', saved);
  }
});

// Run on initial load and after view transitions
initTheme();
document.addEventListener('astro:after-swap', () => {
  updateThemeIcons();
  initTheme();
});
