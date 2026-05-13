/**
 * A React component that renders a live preview of code snippets, supporting BEEQ web components and syncing with Mintlify's dark/light mode.
 *
 * @param {string} code - The HTML code to render in the live preview.
 * @param {ReactNode} children - Optional code section to render below the preview (e.g. for displaying the source code).
 * @param {string} height - Optional minimum height for the preview area (e.g. "200px").
 *
 * @example
 * ```mdx
 * <CodeLivePreview code={`
 *   <bq-button appearance="primary">
 *     Click me
 *     <bq-icon name="plus" slot="suffix"></bq-icon>
 *   </bq-button>`}>
 *   <CodeGroup>
 *     ```mdx HTML
 *     <bq-button appearance="primary">
 *       Click me
 *       <bq-icon name="plus" slot="suffix"></bq-icon>
 *     </bq-button>
 *     ```
 *
 *     ```mdx React
 *     import { BqButton, BqIcon } from "@beeq/react";
 *
 *     <BqButton appearance="primary">
 *       Click me
 *       <BqIcon name="plus" slot="suffix" />
 *     </BqButton>
 *     ```
 *   </CodeGroup>
 * </CodeLivePreview>
 * ```
 */
export const CodeLivePreview = ({ code, children, height }) => {
  const previewRef = useRef(null);

  // Load BEEQ web components (once)
  useEffect(() => {
    if (document.querySelector('script[data-beeq]')) return;

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://esm.sh/@beeq/core@beta/dist/beeq/beeq.esm.js';
    script.dataset.beeq = 'https://esm.sh/@beeq/core/dist/beeq/svg';
    document.head.appendChild(script);
  }, []);

  // Attach a shadow root to the preview container and inject the code HTML.
  // The shadow root isolates Mintlify/Tailwind styles so BEEQ components and
  // any raw HTML elements in the preview always render with beeq.css only.
  // CSS custom properties (--bq-*) still inherit through the shadow boundary,
  // so design tokens and dark/light mode continue to work without changes.
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;

    // Attach shadow root once; reuse on subsequent code changes.
    const shadowRoot = el.shadowRoot ?? el.attachShadow({ mode: 'open' });

    // Inject beeq.css (for raw HTML elements) + the hidden="false" fix + user code.
    // Setting innerHTML replaces all shadow content; the browser uses the
    // cached beeq.css response on subsequent updates.
    shadowRoot.innerHTML = [
      '<link rel="stylesheet" href="https://esm.sh/@beeq/core@beta/dist/beeq/beeq.css">',
      // Fix: BEEQ components emit hidden="false" (string) when open=true.
      // The UA stylesheet treats any [hidden] as display:none, so we restore it.
      '<style>[hidden="false"] { display: block; }</style>',
      code,
    ].join('');

    // Re-execute any <script> blocks inside the injected HTML.
    // Inline scripts are executed via new Function so the shadow root can be
    // passed in as 'previewRoot' — document.currentScript is always null for
    // dynamically created script elements, so getRootNode() would throw.
    shadowRoot.querySelectorAll('script').forEach((oldScript) => {
      if (oldScript.src) {
        const newScript = document.createElement('script');
        newScript.src = oldScript.src;
        oldScript.replaceWith(newScript);
      } else {
        new Function('previewRoot', oldScript.textContent)(shadowRoot);
        oldScript.remove();
      }
    });
  }, [code]);

  return (
    <div className="code-live-preview not-prose">
      {/* Live preview — shadow root attached imperatively for full style isolation */}
      <div className="preview" ref={previewRef} style={{ minHeight: height }} />

      {/* Code section — rendered via children (e.g. CodeGroup from MDX) */}
      {children && <div className="code">{children}</div>}
    </div>
  );
};
