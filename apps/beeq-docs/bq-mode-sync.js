// Sync Mintlify's .dark class with BEEQ's bq-mode attribute on <html>
(() => {
  const html = document.documentElement;

  function sync() {
    html.setAttribute('bq-mode', html.classList.contains('dark') ? 'dark' : 'light');
  }

  sync();

  new MutationObserver((mutations) => {
    for (const element of mutations) {
      if (element.attributeName === 'class') {
        sync();
        break;
      }
    }
  }).observe(html, { attributes: true, attributeFilter: ['class'] });
})();
