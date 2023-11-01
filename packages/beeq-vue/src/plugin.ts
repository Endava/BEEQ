import { Plugin } from 'vue';
import { applyPolyfills, defineCustomElements } from '@bee-q/core/dist/loader';

export const BeeqVue: Plugin = {
  async install() {
    applyPolyfills().then(() => {
      defineCustomElements();
    });
  },
};
