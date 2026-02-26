// Bibtex popover toggle + copy — single global listener
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;

  // Toggle popover
  if (target.closest('.pub-bibtex-btn')) {
    e.stopPropagation();
    const card = target.closest('.pub-card');
    if (!card) return;
    const popover = card.querySelector('.pub-bibtex-popover') as HTMLElement;
    if (!popover) return;

    const isOpen = popover.style.display === 'block';

    // Close all popovers first
    document.querySelectorAll('.pub-bibtex-popover').forEach(p => {
      (p as HTMLElement).style.display = 'none';
    });

    // Toggle this one
    if (!isOpen) popover.style.display = 'block';
    return;
  }

  // Copy button
  if (target.closest('.pub-bibtex-copy')) {
    e.stopPropagation();
    const btn = target.closest('.pub-bibtex-copy') as HTMLElement;
    const popover = btn.closest('.pub-bibtex-popover');
    if (!popover) return;
    const code = popover.querySelector('.pub-bibtex-code');
    if (!code) return;

    navigator.clipboard.writeText(code.textContent || '').then(() => {
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
    });
    return;
  }

  // Click outside closes all popovers
  if (!target.closest('.pub-bibtex-popover')) {
    document.querySelectorAll('.pub-bibtex-popover').forEach(p => {
      (p as HTMLElement).style.display = 'none';
    });
  }
});
