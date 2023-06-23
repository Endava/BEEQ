import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { defineCustomElements } from '@bee-q/core/dist/loader';

import { DIRECTIVES } from './directives';

@NgModule({
  imports: [CommonModule],
  declarations: [...DIRECTIVES],
  exports: [...DIRECTIVES],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        return defineCustomElements();
      },
      multi: true,
    },
  ],
})
export class BeeQModule {
  static forRoot(): ModuleWithProviders<BeeQModule> {
    return {
      ngModule: BeeQModule,
    };
  }
}
