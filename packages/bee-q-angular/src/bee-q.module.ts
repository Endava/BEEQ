import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { defineCustomElements } from '@bee-q/core/dist/loader';

import { DIRECTIVES } from './directives';

@NgModule({
  imports: [CommonModule],
  declarations: [...DIRECTIVES],
  exports: [...DIRECTIVES],
})
export class BeeQModule {
  static forRoot(): ModuleWithProviders<BeeQModule> {
    defineCustomElements();
    return {
      ngModule: BeeQModule,
    };
  }
}
