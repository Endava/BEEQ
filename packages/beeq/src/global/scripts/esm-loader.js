/**
 * This file will allow loading ESM modules in Zeroheight code resource
 * and other non-module-supporting sandboxes.
 *
 * The script extracts the version from its own CDN URL to load the matching ESM module.
 * Example URL: https://cdn.jsdelivr.net/npm/@beeq/core@1.12.2/dist/scripts/esm-loader.js
 */

(() => {
  const currentScript = document.currentScript;
  let version = 'latest';

  // Extract the version to load from the script's own CDN URL
  // Matches: @beeq/core@1.12.2 or @beeq/core@1.12.2-beta.1, etc.
  const versionMatch = currentScript?.src?.match(/@beeq\/core@([^/]+)/);
  if (versionMatch) version = versionMatch[1];

  const cdnUrl = `https://cdn.jsdelivr.net/npm/@beeq/core@${version}/dist/beeq/beeq.esm.js`;

  const script = document.createElement('script');
  script.type = 'module';
  script.src = cdnUrl;
  document.head.appendChild(script);
})();
