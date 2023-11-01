# Angular Wrapper for BEEQ

An Angular-specific wrapper on top of BEEQ web components that enables NG_VALUE_ACCESSORS and allows you to bind input events directly to a value accessor for seamless integration in Angular’s bi-directional data flow.

## Package installation

- install the package

```
npm install @bee-q/angular
```

- update the package

```
npm install @bee-q/angular@latest
```

if the `@bee-q/core` package is added to your `package.json` should update both

```
npm install @bee-q/{core,angular}
```

## Setup

### Call `defineCustomElements`

The BEEQ core package includes the main function that is used to load the components in the collection and makes Angular aware of the custom tags of the web components. That function is called `defineCustomElements()` and it is handled by the `@bee-q/angular` wrapper itself. Yet, **if you need to support older versions of Microsoft Edge and Internet Explorer, you can apply the polyfills as follow**:

```ts
// main.ts

import { applyPolyfills, defineCustomElements } from '@bee-q/core/dist/loader';

...

// Apply the polyfills for Edge/IE browser support
applyPolyfills().then(() => {
  defineCustomElements(window);
})
```

### Add BEEQ styles and assets

> ❗️The icons SVG are shipped in a separate folder. Projects will need to include `node_modules/@bee-q/core/dist/bee-q/svg` in their build and try to make it in a certain way that it respond to: `http://<domain>/svg`

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
                "input": "node_modules/@bee-q/core/dist/bee-q/svg",
                "output": "/svg/"
              }
            ],
            "styles": [
              "src/styles.scss",
              "node_modules/@bee-q/core/dist/bee-q/bee-q.css"
            ],
            ...
          }
		}
      }
    }
  }
}
```

BEEQ styles can be also imported into your application's main style file:

```css
@import '~@bee-q/core/dist/bee-q/bee-q.css';
```

### Add the BEEQ Angular module to your application module

You will be able to add BEEQ web components to your app by adding the `BeeQModule` exported by `@bee-q/angular`:

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BeeQModule } from '@bee-q/angular';

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

> ❗️❗️ *Please notice that* **you might need to disable** `aot` *for enabling two-way data binding**. Details: https://github.com/ionic-team/stencil-ds-output-targets/issues/317*

```ts
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BeeQModule, BooleanValueAccessor, TextValueAccessor } from '@bee-q/angular';

import { AppComponent } from './app.component';

/** 💡 More Value Accessors will be exported later and should be included as well */
const VALUE_ACCESSORS = [BooleanValueAccessor, TextValueAccessor];

@NgModule({
  declarations: [AppComponent, ...VALUE_ACCESSORS],
  imports: [BeeQModule.forRoot(), BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [],
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
