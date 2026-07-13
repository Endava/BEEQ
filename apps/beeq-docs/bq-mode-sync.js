/**
 * Sync Mintlify's .dark class with BEEQ's bq-mode attribute on <html>
 * and manage the page-load guard overlay for the landing page.
 *
 * !Note: This file is included as a <script> in index.mdx by Mintlify, not imported as a module.
 */

(() => {
  const html = document.documentElement;

  /* -------------------------------------------------------------------------- */
  /*                               Dark-mode sync                               */
  /* -------------------------------------------------------------------------- */

  // Keep BEEQ's bq-mode attribute in sync with Mintlify's .dark class.
  function syncDarkMode() {
    html.setAttribute('bq-mode', html.classList.contains('dark') ? 'dark' : 'light');
  }

  syncDarkMode();

  // attributeFilter ensures only class changes trigger this callback.
  new MutationObserver(syncDarkMode).observe(html, { attributes: true, attributeFilter: ['class'] });

  /* -------------------------------------------------------------------------- */
  /*                               Page-load guard                              */
  /* -------------------------------------------------------------------------- */

  // #bq-page-guard is a plain <div> in the index.mdx SSR HTML, visible
  // from the very first paint. Once BEEQ registers:
  //   1. Fade the guard out (first load).
  //   2. Add `bq-loaded` to <html> so the CSS rule
  //      `.bq-loaded #bq-page-guard { display: none }` instantly
  //      suppresses the guard on any future client-side navigation.

  let revealed = false;

  function revealPage() {
    if (revealed) return;
    revealed = true;

    requestAnimationFrame(() => {
      document.getElementById('bq-page-guard')?.classList.add('bq-page-guard--out');
    });
    // After the 0.4 s CSS transition, mark <html> as loaded.
    setTimeout(() => html.classList.add('bq-loaded'), 450);
  }

  if (typeof customElements === 'undefined') {
    // Custom elements not supported — reveal immediately.
    revealPage();
  } else if (customElements.get('bq-button')) {
    // BEEQ already registered (e.g. client-side navigation) — skip the fade.
    html.classList.add('bq-loaded');
  } else {
    customElements.whenDefined('bq-button').then(revealPage);
    setTimeout(revealPage, 6000); // Safety: reveal within 6 s if BEEQ fails to load.
  }
})();
