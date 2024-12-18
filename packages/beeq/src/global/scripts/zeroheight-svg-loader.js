/**
 * @see: https://share.cleanshot.com/zvXbCj2b
 * Currently there's an issue that avoid loading external assets on Zeroheight.
 * This file will allow loading SVG assets from a CDN inside the code preview.
 */

const proxyFetch = {
  apply(target, _thisArg, args) {
    const svgUrl = args[0];
    if (svgUrl.includes('/svg/')) {
      const svgName = svgUrl.substring(svgUrl.lastIndexOf('/') + 1);
      const newUrl = `https://cdn.jsdelivr.net/npm/@beeq/core/dist/beeq/svg/${svgName}`;
      return target(newUrl, args[1], args[2]);
    }
    return target(...args);
  },
};

if (!window.proxied) {
  window.proxied = true;
  window.fetch = new Proxy(fetch, proxyFetch);
}
