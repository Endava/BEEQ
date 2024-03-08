import { Plugin } from 'vue';
import { applyPolyfills, defineCustomElements } from '@beeq/core/dist/loader';

export const BeeqVue: Plugin = {
  async install() {
    applyPolyfills().then(() => {
      // @stencil/vue-output-target does not support camelCase event names
      // so we are attaching a custom event listener to map camelCase to kebab-case event names
      const camelCaseToKebab = (str: string) => {
        return str
          .split(/(?=[A-Z])/)
          .join('-')
          .toLowerCase();
      };
      defineCustomElements(window, {
        ael: (el: any, eventName: string, cb: any, opts: any) =>
          el.addEventListener(camelCaseToKebab(eventName), cb, opts),
        rel: (el: any, eventName: string, cb: any, opts: any) =>
          el.removeEventListener(camelCaseToKebab(eventName), cb, opts),
        ce: (eventName: string, opts: any) => new CustomEvent(camelCaseToKebab(eventName), opts),
      } as any);
    });
  },
};
