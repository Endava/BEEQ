# Angular Wrapper for BEEQ

An Angular-specific wrapper on top of BEEQ web components that enables NG_VALUE_ACCESSORS and allows you to bind input events directly to a value accessor for seamless integration in Angular’s bi-directional data flow.

## Package installation

> [!TIP]
>  Please always refer to the [official BEEQ documentation](https://www.beeq.design/3d466e231/p/359a26-for-developers/b/08eb89) for more information about the installation.

- install the package

```
npm install @beeq/{core,angular}
```

> [!NOTE]
> Make sure that you have installed the `@beeq/core` package.

## Setup

### Call `defineCustomElements`

The BEEQ core package includes the main function that is used to load the components in the collection and makes Angular aware of the custom tags of the web components. That function is called `defineCustomElements()` and it is handled by the `@beeq/angular` wrapper itself. Yet, **if you need to support older versions of Microsoft Edge and Internet Explorer, you can apply the polyfills as follow**:

```ts
// main.ts

import { applyPolyfills, defineCustomElements } from '@beeq/core/dist/loader';

...

// Apply the polyfills for Edge/IE browser support
applyPolyfills().then(() => {
  defineCustomElements(window);
})
```

### Add BEEQ styles and assets

> [!TIP]
>  BEEQ uses SVG icons and these assets are shipped in a separate folder. You can use the `setBasePath` method to set the path to the icons. Make sure that your project bundle the icons in a way that they are accessible from the browser.

You can move the icons from the node_modules folder to your assets folder and set the path like this:

```json
/** angular.json */
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "Angular-Project": {
      ...
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            ...
            "assets": [
              "src/favicon.ico",
              "src/assets",
              {
                "glob": "**/*",
                "input": "node_modules/@beeq/core/dist/beeq/svg",
                "output": "assets/svg/"
              }
            ],
            "styles": [
              "src/styles.scss",
              "node_modules/@beeq/core/dist/beeq/beeq.css"
            ],
            ...
          }
		}
      }
    }
  }
}
```

```js
// main.ts
import { setBasePath } from '@beeq/core';

setBasePath('/assets/svg/');
```

But you can also use a different icons library or a CDN (*no need to move the icons to your assets folder via angular.json*):

```js
import { setBasePath } from '@beeq/core';

// Using heroicons library
setBasePath('https://cdn.jsdelivr.net/npm/heroicons@2.1.5/24/outline');
```

> [!CAUTION]
> When using a different icons library, make sure you use the correct icon names provided by the library or the CDN.

BEEQ styles can be also imported into your application's main style file:

```css
@import '~@beeq/core/dist/beeq/beeq.css';
```

### Add the BEEQ Angular module to your application module

You will be able to add BEEQ web components to your app by adding the `BeeQModule` exported by `@beeq/angular`:

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BeeQModule } from '@beeq/angular';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BeeQModule.forRoot(), BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [],
})
export class AppModule {}
```

### NgModel and two-way data binding

To enable two-way binding and the use of [ngModel] within BEEQ form components, you will need to add the Value Accessors in your module declarations, along with `@angular/forms`.

> [!CAUTION]
> *Please notice that* **you might need to disable** `aot` *for enabling two-way data binding**. Details: https://github.com/ionic-team/stencil-ds-output-targets/issues/317*

```ts
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BeeQModule.forRoot(), BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [],
})
export class AppModule {}
```

> 🙋🏼‍♂️ If you are using `@beeq/angular` v1.0.1 or below, **you also need to import the values accessors**, as shown below:

```ts
...
import { BeeQModule, BooleanValueAccessor, TextValueAccessor } from '@beeq/angular';
...
const VALUE_ACCESSORS = [BooleanValueAccessor, TextValueAccessor];

@NgModule({
  declarations: [AppComponent, ...VALUE_ACCESSORS],
  imports: [BeeQModule.forRoot(), BrowserModule, FormsModule],
  ...
})
export class AppModule {}
```

### Usage

```html
<!-- Angular component template -->

<bq-checkbox name="userTermsConditions" [(ngModel)]="termsConditions" (bqChange)="onTermsConditionsChange()">
  Yes, I agree with the Terms & Conditions
</bq-checkbox>

<bq-slider
  min="0"
  max="100"
  type="range"
  debounce-time="250"
  [(ngModel)]="sliderValue"
  (bqChange)="onSliderChange()"
></bq-slider>
```

```ts
/** Angular component typescript */
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  termsConditions = true;
  sliderValue = [20, 75];

  onTermsConditionsChange() {
    console.log('The terms and conditions value changed!', this.termsConditions);
  }

  onSliderChange() {
    console.log('Slider value changed!', this.sliderValue);
  }
}
```

### Using BEEQ components in Angular standalone

You can also use BEEQ components in Angular standalone. To do so, you will need to import the components from `@beeq/angular/standalone` and use them as you would use any other Angular component.

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BqButton, BqCard, BqInput } from '@beeq/angular/standalone';

@Component({
  selector: 'app-component',
  standalone: true,
  imports: [BqButton, BqCard, BqInput],
  template: `
    <bq-card>
      <bq-input name="email" [value]="emailValue" (bqChange)="onInputChange($event)">
        <label slot="label">Your email</label>
      </bq-input>
      <bq-button>Subscribe me!</bq-button>
    </bq-card>
  `,
  styles: [],
  schemas: [],
})
export class AppComponent2 {
  emailValue = 'BEEQ Design System';

  onInputChange(event: CustomEvent<{ value: string }>) {
    console.log('emailValue', event.detail.value);
  }
}
```
