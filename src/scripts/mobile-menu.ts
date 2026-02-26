function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (!btn || !sidebar || !overlay) return;

  function toggle() {
    sidebar!.classList.toggle('open');
    btn!.classList.toggle('open');
    overlay!.classList.toggle('visible');
  }

  btn.addEventListener('click', toggle);
  overlay.addEventListener('click', toggle);

  // Close on nav link click (mobile)
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768 && sidebar!.classList.contains('open')) {
        toggle();
      }
    });
  });
}

initMobileMenu();
document.addEventListener('astro:after-swap', initMobileMenu);
