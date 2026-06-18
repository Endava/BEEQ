import { useEffect, useRef } from 'react';

/**
 * CodeLivePreview
 *
 * Renders interactive HTML examples inside docs while keeping styling predictable.
 *
 * Rendering modes:
 * - shadow (default): fast, isolated from Mintlify styles, inherits CSS variables
 * - iframe: full document isolation for components that mutate global document state
 *
 * Why iframe mode exists:
 * Some components are designed for app layouts and mutate document.body classes.
 * In docs, that can cause page-level layout shifts. Iframe mode contains those side
 * effects inside the iframe document, so the parent docs page remains stable.
 *
 * @param {Object} props
 * @param {string} props.code - HTML snippet injected into preview runtime.
 * @param {React.ReactNode} props.children - Optional code tabs rendered below preview.
 * @param {string} [props.height] - Minimum preview height (for stable layout).
 * @param {boolean} [props.removePadding=false] - Whether to remove default padding from preview container.
 * @param {'shadow' | 'iframe'} [props.mode='shadow'] - Preview isolation strategy.
 */
export const CodeLivePreview = ({ code, children, height, removePadding = false, mode = 'shadow' }) => {
  const previewRef = useRef(null);

  // Constants are centralized so URLs and selectors are not duplicated.
  const BEEQ_ESM_URL = 'https://esm.sh/@beeq/core/dist/beeq/beeq.esm.js';
  const BEEQ_CSS_URL = 'https://esm.sh/@beeq/core/dist/beeq/beeq.css';
  const BEEQ_ICONS_URL = 'https://esm.sh/@beeq/core/dist/beeq/svg';

  /**
   * Ensures BEEQ web components are loaded in the parent document.
   * Needed for shadow mode only; iframe mode loads its own runtime internally.
   */
  const ensureParentBeeqRuntime = () => {
    if (document.querySelector('script[data-beeq-parent-runtime]')) return;

    const script = document.createElement('script');
    script.type = 'module';
    script.src = BEEQ_ESM_URL;
    script.dataset.beeqParentRuntime = BEEQ_ICONS_URL;
    document.head.appendChild(script);
  };

  /**
   * Executes inline and external scripts from injected markup.
   *
   * Why not rely on browser auto-execution from innerHTML:
   * Browsers do not execute inline scripts inserted via innerHTML.
   * We recreate script execution manually and pass previewRoot so snippets can
   * query only inside their sandbox.
   *
   * @param {Document | ShadowRoot} root - Container holding injected snippet.
   * @param {Window} runtimeWindow - Window where Function constructor should run.
   * @param {Document | ShadowRoot} previewRootArg - Value passed as previewRoot.
   * @param {string} [skipAttr] - Optional data-attribute used to skip internal scripts.
   */
  const executeSnippetScripts = (root, runtimeWindow, previewRootArg, skipAttr) => {
    root.querySelectorAll('script').forEach((oldScript) => {
      if (skipAttr && oldScript.hasAttribute(skipAttr)) return;

      if (oldScript.src) {
        const newScript = runtimeWindow.document.createElement('script');
        newScript.src = oldScript.src;
        oldScript.replaceWith(newScript);
        return;
      }

      runtimeWindow.Function('previewRoot', oldScript.textContent || '')(previewRootArg);
      oldScript.remove();
    });
  };

  /**
   * Keeps iframe visual mode aligned with parent docs mode.
   * This mirrors either explicit bq-mode or dark class from parent document.
   *
   * @param {Document} iframeDoc
   */
  const syncIframeMode = (iframeDoc) => {
    const root = document.documentElement;
    const explicitMode = root.getAttribute('bq-mode');
    const isDark = root.classList.contains('dark');
    const resolvedMode = explicitMode || (isDark ? 'dark' : 'light');

    iframeDoc.documentElement.setAttribute('bq-mode', resolvedMode);
    iframeDoc.body.setAttribute('bq-mode', resolvedMode);
  };

  // Parent runtime is only needed for shadow mode.
  useEffect(() => {
    if (mode === 'shadow') ensureParentBeeqRuntime();
  }, [mode]);

  /**
   * Main rendering effect.
   * Re-runs when code, mode, or height changes.
   */
  useEffect(() => {
    const container = previewRef.current;
    if (!container) return;

    if (removePadding) container.style.padding = '0';

    // We recreate preview surface on each change to avoid stale event handlers/state.
    container.innerHTML = '';

    if (mode === 'iframe') {
      const iframe = document.createElement('iframe');
      iframe.className = 'preview-iframe';
      iframe.style.width = '100%';
      iframe.style.border = '0';
      iframe.style.display = 'block';
      iframe.style.minHeight = height ?? '0px';
      iframe.setAttribute('title', 'Live code preview');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
      container.appendChild(iframe);

      const iframeDoc = iframe.contentDocument;
      const iframeWin = iframe.contentWindow;
      if (!iframeDoc || !iframeWin) return;

      // Build an isolated document for the preview.
      // Any body mutations from components are now contained inside this iframe.
      iframeDoc.open();
      iframeDoc.write(
        [
          '<!doctype html>',
          '<html>',
          '<head>',
          '  <meta charset="utf-8" />',
          '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
          '  <style>html,body{margin:0;padding:0;min-height:100%;}</style>',
          `  <link rel="stylesheet" href="${BEEQ_CSS_URL}" />`,
          `  <script type="module" src="${BEEQ_ESM_URL}" data-beeq-iframe-runtime="${BEEQ_ICONS_URL}"></script>`,
          '</head>',
          '<body>',
          code,
          '</body>',
          '</html>',
        ].join('\n'),
      );
      iframeDoc.close();

      // Initial mode sync and reactive sync for future parent mode changes.
      syncIframeMode(iframeDoc);
      const modeObserver = new MutationObserver(() => syncIframeMode(iframeDoc));
      modeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'bq-mode'],
      });

      // Re-execute snippet scripts with previewRoot as iframe document.
      executeSnippetScripts(iframeDoc, iframeWin, iframeDoc, 'data-beeq-iframe-runtime');

      // Cleanup observer to avoid leaks on rerender/unmount.
      return () => modeObserver.disconnect();
    }

    // Default shadow mode path.
    const shadowRoot = container.shadowRoot ?? container.attachShadow({ mode: 'open' });

    if (!shadowRoot.adoptedStyleSheets.length) {
      // One-time fix sheet for overlay-related parts in isolated previews.
      const fixSheet = new CSSStyleSheet();
      fixSheet.replaceSync(`
        bq-dropdown::part(panel),
        bq-panel::part(panel),
        bq-select::part(panel),
        bq-date-picker::part(panel) { z-index: 9999; }
        bq-tooltip::part(panel) { position: absolute; }
      `);
      shadowRoot.adoptedStyleSheets = [fixSheet];
    }

    // Inject styles + snippet markup.
    shadowRoot.innerHTML = [`<link rel="stylesheet" href="${BEEQ_CSS_URL}">`, code].join('');

    // Re-execute snippet scripts with previewRoot as shadow root.
    executeSnippetScripts(shadowRoot, window, shadowRoot);

    return undefined;
  }, [code, mode, height]);

  return (
    <div className="code-live-preview not-prose">
      {/* Preview surface. In shadow mode it hosts a ShadowRoot, in iframe mode it hosts an iframe. */}
      <div className="preview" ref={previewRef} style={{ minHeight: height }} />

      {/* Code tabs/source section */}
      {children && <div className="code">{children}</div>}
    </div>
  );
};
