# React Wrapper for Bee-Q

A lightweight utility that wraps Bee-Q custom elements ("web components") so they can be used like native React components.

## Package installation

- install the package

```
npm install @bee-q/react
```

- update the package

```
npm install @bee-q/react@latest --save
```

if `@bee-q/core` package is installed you should update both

```
npm install @bee-q/core@latest @bee-q/react@latest --save
```

## Usage

```jsx
import React from 'react';
import { BqButton } from '@bee-q/react';

function App() {
  const handleButtonClick = (ev: CustomEvent) => {
    console.log(ev.detail);
  };

  return (
    <BqButton appearance="primary" onBqClick={handleButtonClick}>
      Click Me
    </BqButton>
  );
}

export default App;
```

## Why is this necessary?

React and custom elements don't play nicely together. The problem is best described by [Custom Elements Everywhere](https://custom-elements-everywhere.com/#react):

> **Handling data**
>
> React passes all data to Custom Elements in the form of HTML attributes. For primitive data this is fine, but the system breaks down when passing rich data, like objects or arrays. In these instances you end up with stringified values like some-attr="[object Object]" which can't actually be used.
>
> **Handling events**
>
> Because React implements its own synthetic event system, it cannot listen for DOM events coming from Custom Elements without the use of a workaround. Developers will need to reference their Custom Elements using a ref and manually attach event listeners with addEventListener. This makes working with Custom Elements cumbersome.

This utility solves these problems by exposing a native React component that maps properties and events to the underlying custom element. ✨
