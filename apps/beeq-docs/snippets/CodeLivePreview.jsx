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
    script.src = 'https://esm.sh/@beeq/core@1.12.14-beta.0/dist/beeq/beeq.esm.js';
    script.dataset.beeq = 'https://esm.sh/@beeq/core/dist/beeq/svg';
    document.head.appendChild(script);
  }, []);

  // Execute any <script> tags inside the preview
  useEffect(() => {
    if (!previewRef.current) return;

    const scripts = previewRef.current.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      oldScript.replaceWith(newScript);
    });
  }, [code]);

  return (
    <div className="code-live-preview not-prose">
      {/* Live preview */}
      <div
        className="preview"
        ref={previewRef}
        // biome-ignore lint/style/useNamingConvention: `__html` is required for dangerouslySetInnerHTML
        // biome-ignore lint/security/noDangerouslySetInnerHtml: This is a controlled use of dangerouslySetInnerHTML for rendering code snippets in documentation.
        dangerouslySetInnerHTML={{ __html: code }}
        style={{ minHeight: height }}
      />

      {/* Code section — rendered via children (e.g. CodeGroup from MDX) */}
      {children && <div className="code">{children}</div>}
    </div>
  );
};
