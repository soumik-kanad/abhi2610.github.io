// Update sidebar active state on ViewTransition navigation
// (sidebar uses transition:persist — DOM stays, only classes change)

function getActivePage(path: string): string {
  if (path === '/') return 'home';
  if (path.startsWith('/group')) return 'group';
  if (path.startsWith('/publications')) return 'publications';
  if (path.startsWith('/teaching')) return 'teaching';
  if (path.startsWith('/awards')) return 'awards';
  if (path.startsWith('/bio')) return 'home';
  return '';
}

function updateActiveNav() {
  const active = getActivePage(window.location.pathname);
  const navItems = document.querySelectorAll<HTMLElement>('.nav-item');

  navItems.forEach(item => {
    const page = item.getAttribute('data-page') || '';
    if (page === active) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

document.addEventListener('astro:after-swap', updateActiveNav);
updateActiveNav();
