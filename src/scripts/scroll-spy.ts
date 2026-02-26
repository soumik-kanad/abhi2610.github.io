function setupScrollSpy() {
  const sections = document.querySelectorAll<HTMLElement>('.section-anchor');
  const subitems = document.querySelectorAll<HTMLElement>('.nav-subitem');
  if (sections.length === 0 || subitems.length === 0) return;

  // Map each section to its matching subitem (or fallback for pub years)
  function findSubitem(id: string): HTMLElement | null {
    let match = document.querySelector<HTMLElement>(`.nav-subitem[data-target="${id}"]`);
    if (!match && id.startsWith('pub-')) {
      match = document.querySelector<HTMLElement>('.nav-subitem[data-target="pub-2023"]');
    }
    return match;
  }

  // Build ordered list: section element + resolved subitem
  const targets: { el: HTMLElement; subitem: HTMLElement }[] = [];
  sections.forEach(section => {
    const sub = findSubitem(section.id);
    if (sub) targets.push({ el: section, subitem: sub });
  });

  if (targets.length === 0) return;

  function update() {
    const threshold = 120;

    // Find last section whose top has scrolled past threshold
    let activeIdx = 0;
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].el.getBoundingClientRect().top <= threshold) {
        activeIdx = i;
      }
    }

    subitems.forEach(s => s.classList.remove('active'));
    targets[activeIdx].subitem.classList.add('active');
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}

// Single global click handler — capture phase to run before ViewTransitions
document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest('a[href*="#"]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href) return;

  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return;
  const path = href.slice(0, hashIndex);
  const hash = href.slice(hashIndex + 1);
  if (!hash) return;

  // Same-page anchor: scroll without hash
  if (!path || path === window.location.pathname) {
    const target = document.getElementById(hash);
    if (target) {
      e.preventDefault();
      e.stopPropagation();
      // Immediately highlight clicked subitem
      const clickedSub = link.closest('.nav-subitem') || document.querySelector(`.nav-subitem[data-target="${hash}"]`);
      if (clickedSub) {
        document.querySelectorAll('.nav-subitem').forEach(s => s.classList.remove('active'));
        clickedSub.classList.add('active');
      }
      target.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    // Element not on this page — find parent nav item's href and navigate there
    const subitem = link.closest('.nav-subitems');
    const parentId = subitem?.getAttribute('data-parent');
    if (parentId) {
      const navItem = document.querySelector<HTMLAnchorElement>(`.nav-item[data-page="${parentId}"]`);
      if (navItem) {
        e.preventDefault();
        e.stopPropagation();
        sessionStorage.setItem('scrollTarget', hash);
        window.location.href = navItem.href;
        return;
      }
    }
    return;
  }

  // Cross-page anchor: store target, navigate clean
  e.preventDefault();
  e.stopPropagation();
  sessionStorage.setItem('scrollTarget', hash);
  window.location.href = path;
}, true);

// On page load, scroll to stored target or clean URL hash
function onPageReady() {
  // Handle stored scroll target from cross-page navigation
  const stored = sessionStorage.getItem('scrollTarget');
  if (stored) {
    sessionStorage.removeItem('scrollTarget');
    const el = document.getElementById(stored);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }

  // Clean any hash that snuck into the URL
  if (window.location.hash) {
    const hash = window.location.hash.slice(1);
    const el = document.getElementById(hash);
    if (el) {
      history.replaceState(null, '', window.location.pathname);
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }
}

setupScrollSpy();
onPageReady();
document.addEventListener('astro:after-swap', () => {
  setupScrollSpy();
  onPageReady();
});
