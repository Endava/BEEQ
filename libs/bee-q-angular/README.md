# Angular Wrapper for Bee-Q

An Angular-specific wrapper on top of Bee-Q web components that enables NG_VALUE_ACCESSORS and allows you to bind input events directly to a value accessor for seamless integration in Angular’s bi-directional data flow.

## Package installation

- install the package

```
npm install @bee-q/angular
```

- update the package

```
npm install @bee-q/angular@latest --save
```

if `@bee-q/core` package is installed you should update both

```
npm install @bee-q/core@latest @bee-q/angular@latest --save
```

## Setup

### Call `defineCustomElements`

The Bee-Q core package includes the main function that is used to load the components in the collection and makes Angular aware of the custom tags of the web components. That function is called defineCustomElements()and it needs to be called once during the bootstrapping of your application. One convenient place to do this is in the `main.ts` as such:

```ts
import { defineCustomElements } from '@uefa/design-system/dist/loader';

...

defineCustomElements(window);
```

If you need to support older versions of Microsoft Edge and Internet Explorer, you can apply the polyfills as follow:

```ts
import { applyPolyfills, defineCustomElements } from '@uefa/design-system/dist/loader';

...

// Aplied the polyfills for Edge/IE browser support
applyPolyfills().then(() => {
  defineCustomElements(window);
})
```

### Add Bee-Q styles and assets

> ❗️The icons SVG are shipped in a separate folder. Projects will need to include that folder in their build and try to make it in a certain way that it respond to: http://<domain>/svg

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

Bee-Q styles cand be also imported in your application main style file:

```css
@import '~@bee-q/core/dist/bee-q/bee-q.css';
```

### Add Bee-Q Angular module to your application module

You will be able to add Bee-Q web components into your app by adding the `BeeQModule` exported by `@bee-q/angular`:

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

> ❗️To enable two way binding and the use of [ngModel] within Bee-Q form components, you will need to add the Value Accessors in your module declarations, along with `@angular/forms`:

```ts
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BeeQModule, BooleanValueAccessor } from '@bee-q/angular';

import { AppComponent } from './app.component';

/** 💡 More Value Accessors will be exported later and should be included as well */
const VALUE_ACCESSORS = [BooleanValueAccessor];

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

  onTermsConditionsChange() {
    console.log('termsConditions', this.termsConditions);
  }
}
```
