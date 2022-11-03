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

## ⚠️ Before Starting ⚠️

### Structure 🧩

The project as been structured as an [NX monorepo](https://nx.dev) :

```
├── 📁 apps
├── 📁 libs
  ├── 📁 bee-q
  ├── 📁 bee-q-react
  ├── ...
├── 📁 tools
├── package.json
├── package-lock.json
```

where:

- **[libs/bee-q](./libs/bee-q/):** core library (source for all the elements/components implemented)
- **[libs/bee-q-react](./libs/bee-q-react):** react specific wrapper for Bee-Q core library

### Dependencies 📡

A recent version (>=16) of [`NodeJS`](https://nodejs.org/en/download/)

> *Note that you will need to use npm 7 or higher.*

## Usage

The Bee-Q components are published to the NPM package manager registry. You can use the `@bee-q/core` or the `@bee-q/react` package depending on the technology stack of your project. Make sure the follow the usage instructions for each package:
- 📘 [How to use the `@bee-q/core` package](libs/bee-q/README.md)
- 📕 [How to use the `@bee-q/react` package](libs/bee-q-react/README.md)

> *More [output targets](https://stenciljs.com/docs/overview) integration will be added later (e.g. Angular, Vue, Svelte)*

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



## Contributing 💻

💥  If you are in the mood and want to help 🙂, please read carefully our [Contributing Guidelines](./CONTRIBUTING.md) and Development Standards.

## Documentation 📖

### StencilJs

Need help? Check out the Stenciljs docs here (https://stenciljs.com/).

### Tailwind CSS

We use Tailwind CSS for the components style, please take a look at their documentation here: (https://tailwindcss.com/docs/)
