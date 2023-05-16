/**
 * @see: https://share.cleanshot.com/zvXbCj2b
 * Currently there's an issue that avoid loading external assets on Zeroheight.
 * This file will allow loading SVG assets from `@bee-q/core/dist/bee-q/svg` folder inside the code preview.
 */

const proxyFetch = {
  apply(target, _thisArg, args) {
    if (args[0].startsWith('/svg/')) {
      return import(`./node_modules/@bee-q/core/dist/bee-q${args[0]}`).then(
        (e) => new Response(atob(e.default.replace('data:image/svg+xml;base64,', ''))),
      );
    }
    return target(...args);
  },
};

if (!window.proxied) {
  window.proxied = true;
  window.fetch = new Proxy(fetch, proxyFetch);
}
