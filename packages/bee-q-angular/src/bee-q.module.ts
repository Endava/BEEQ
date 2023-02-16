import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { defineCustomElements } from '@bee-q/core/dist/loader';

import { DIRECTIVES } from './directives';

defineCustomElements();

@NgModule({
  imports: [CommonModule],
  declarations: [...DIRECTIVES],
  exports: [...DIRECTIVES],
})
export class BeeQModule {
  static forRoot(): ModuleWithProviders<BeeQModule> {
    return {
      ngModule: BeeQModule,
    };
  }
}
