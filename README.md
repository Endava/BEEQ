<p align="center">
  <img
    width="500"
    src="https://user-images.githubusercontent.com/328492/189278210-da3353de-6ea2-4c97-9be3-b02ac6dd5997.jpg"
    alt="Bee-Q Design System logo"
  />
</p>

<h1 align="center">Bee-Q, a web component library initiative</h1>

<p align="center">This repository holds the source code of the web component present on the Bee-Q Design System.</p>

<p align="center">
  <a aria-label="license" href="./LICENSE">
    <img src="https://img.shields.io/badge/license-Apache%202.0-green" alt="">
  </a>
</p>

<div align="center">

| Package                                                          | Version                                                                                                            | Documentation                            |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| [`@bee-q/core`](https://www.npmjs.com/package/@bee-q/core)       | [![version](https://img.shields.io/npm/v/@bee-q/core/latest.svg)](https://www.npmjs.com/package/@bee-q/core)       | [README](./libs/bee-q/README.md)         |
| [`@bee-q/angular`](https://www.npmjs.com/package/@bee-q/angular) | [![version](https://img.shields.io/npm/v/@bee-q/angular/latest.svg)](https://www.npmjs.com/package/@bee-q/angular) | [README](./libs/bee-q-angular/README.md) |
| [`@bee-q/react`](https://www.npmjs.com/package/@bee-q/react)     | [![version](https://img.shields.io/npm/v/@bee-q/react/latest.svg)](https://www.npmjs.com/package/@bee-q/react)     | [README](./libs/bee-q-react/README.md)   |

</div>

## ⚠️ Before Starting ⚠️

### Structure 🧩

The project as been structured as an [NX monorepo](https://nx.dev) :

```
├── 📁 apps
├── 📁 libs
  ├── 📁 bee-q
  ├── 📁 bee-q-angular
  ├── 📁 bee-q-react
  ├── ...
├── 📁 tools
├── package.json
├── package-lock.json
```

where:

- **[libs/bee-q](./libs/bee-q/):** Core library (source for all the elements/components implemented)
- **[libs/bee-q-angular](./libs/bee-q-angular):** Angular specific wrapper for Bee-Q core library
- **[libs/bee-q-react](./libs/bee-q-react):** ReactJS specific wrapper for Bee-Q core library

### Dependencies 📡

We recommend the use of [Volta](https://volta.sh/) to manage Node and NPM versions. The [installation process](https://docs.volta.sh/guide/getting-started) is pretty straight forward, and as referenced in their official site:

> With Volta, you can select a Node engine once and then stop worrying about it. You can switch between projects and stop having to manually switch between Nodes.

Once you have Volta installed, whenever you change to the Bee-Q folder locally, it will switch to the right Node version pinned on the `package.json`:

```json
"volta": {
  "node": "16.18.1"
}
```
![CleanShot 2022-11-28 at 14 00 03](https://user-images.githubusercontent.com/328492/204272857-ef3b0b43-82d2-4631-92ef-b496c3bc197e.gif)

Volta is not mandatory, you can still use any Node/NPM setup that fits you most, just keep in mind that you'll need:
- [`NodeJS`](https://nodejs.org/en/download/) v16.x or higher
- [NPM](https://nodejs.org/en/knowledge/getting-started/npm/what-is-npm/) v8 or higher

## Usage

The Bee-Q components are published to the NPM package manager registry. You can use the `@bee-q/core` or any of the framework specific wrappers (`@bee-q/angular`, `@bee-q/react`) depending on the technology stack of your project. Make sure the follow the usage instructions for each package:

- 📘 [How to use the `@bee-q/core` package](libs/bee-q/README.md)
- 📗 [How to use the `@bee-q/angular` package](libs/bee-q-angular/README.md)
- 📕 [How to use the `@bee-q/react` package](libs/bee-q-react/README.md)

> _More [output targets](https://stenciljs.com/docs/overview) integration will be added later (e.g. Vue, Svelte)_

Feel free to [check our Storybook](https://develop--631f6f60ace2c23753595513.chromatic.com/) to see all the Bee-Q components released. There you can find all the component's API (properties, events, and methods exposed) along with the variations that each component allows.

## Running the project 🏃‍

To develop/extend components on the Bee-Q Design System, clone this repo to a new directory:

```bash
git clone git@github.com:dgonzalezr/bee-q.git Bee-Q-Design-System
git checkout develop
cd Bee-Q-Design-System
```

### Installation ⚙️

Simply run:

```bash
npm ci
# Make sure to build first the project before starting it
npm run build
npm start
```

Start coding 😃!

### Build 📦

For a Production build, just run:

```bash
npm run build
```

### Test 🧪

Bee-Q uses [Jest](https://jestjs.io/) for unit tests and Jest and [Puppeteer](https://pptr.dev/) for end-to-end tests.

You can run all the tests once, by executing:

```bash
npm run test
```

🚨 If you get an error similar to the one below, **try to checkout locally the `main` branch and run the tests again**.

```bash
fatal: Not a valid object name main
fatal: No such ref: 'main'
nx affected
```

### Generate component

Bee-q comes with a component generator that saves you time when creating the skeleton for a new component. In order to use the generator, you just need to run the following command and follow the instructions in your prompt CLI:

```bash
npm run g
```

## Contributing 💻

💥 If you are in the mood and want to help 🙂, please read carefully our [Contributing Guidelines](./CONTRIBUTING.md) and Development Standards.

❗️ When working on a bug fix, new feature, etc., please notice that we follow a [GitFlow workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). Make sure to [follow the instructions from the Contributing Branching Strategy guidelines](./CONTRIBUTING.md#branching-strategy) about how to create your branch when starting to work on a bug/hot fixing, new feature, etc.

## Documentation 📖

### StencilJs

Need help? Check out the Stenciljs docs here (https://stenciljs.com/).

### Tailwind CSS

We use Tailwind CSS for the components style, please take a look at their documentation here: (https://tailwindcss.com/docs/)
