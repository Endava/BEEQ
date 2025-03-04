import type { JSXBase } from '@stencil/core/internal';

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore: this imported file declaration is generated by the build process
// eslint-disable-next-line import-x/no-unresolved
import type { CustomElements } from '../cem/beeq';

declare module '@stencil/core' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace JSX {
    interface IntrinsicElements extends CustomElements {
      // Extend the global slot HTML element to include the id and class attributes
      slot: JSXBase.SlotAttributes & { id?: string; class?: string };
    }
  }
}

declare global {
  interface CustomStateSet {
    size: number;
    add(value: string): void;
    clear(): void;
    delete(value: string): boolean;
    entries(): IterableIterator<[string, string]>;
    forEach(callback: (value: string, key: string, set: CustomStateSet) => void): void;
    has(value: string): boolean;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
  }

  interface ElementInternals {
    states: CustomStateSet;
  }
}
