/** This file will allow loading ESM modules in Zeroheight code resource */

const url = new URL(document.currentScript.src);
const script = document.createElement('script');
script.type = 'module';
script.src = `${url.origin}/beeq/beeq.esm.js`;
document.head.appendChild(script);
