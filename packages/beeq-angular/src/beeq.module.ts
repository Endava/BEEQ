import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, NgZone } from '@angular/core';
import { defineCustomElements } from '@beeq/core/dist/loader';

import { DIRECTIVES } from './directives';

@NgModule({
  imports: [CommonModule],
  declarations: [...DIRECTIVES],
  exports: [...DIRECTIVES],
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
          deps: [NgZone],
        },
      ],
    };
  }
}
