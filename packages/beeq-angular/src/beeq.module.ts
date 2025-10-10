// @ts-nocheck

/**
 * The directives folder containing the value accessors is generated dynamically
 * when compiling the `beeq` package.
 * ⚠️ Since this file won't change that much, it is safe to disable TypeScript checking.
 */

import { CommonModule, DOCUMENT } from '@angular/common';
import { APP_INITIALIZER, type ModuleWithProviders, NgModule, NgZone } from '@angular/core';
import { defineCustomElements } from '@beeq/core/dist/loader';

import { DIRECTIVES } from './directives';
import { BooleanValueAccessor } from './directives/boolean-value-accessor';
import { NumericValueAccessor } from './directives/number-value-accessor';
import { RadioValueAccessor } from './directives/radio-value-accessor';
import { SelectValueAccessor } from './directives/select-value-accessor';
import { TextValueAccessor } from './directives/text-value-accessor';

const DECLARATIONS = [
  ...DIRECTIVES,
  // ngModel Accessors
  BooleanValueAccessor,
  NumericValueAccessor,
  RadioValueAccessor,
  SelectValueAccessor,
  TextValueAccessor,
];

@NgModule({
  imports: [CommonModule],
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
})
export class BeeQModule {
  static forRoot(): ModuleWithProviders<BeeQModule> {
    return {
      ngModule: BeeQModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: () => defineCustomElements,
          multi: true,
          deps: [DOCUMENT, NgZone],
        },
      ],
    };
  }
}
