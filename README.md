# **Bee-Q**, a design system initiative by Endava.

This repository holds the source code of the web component present on the Bee-Q Design System.

## ⚠️ Before Starting ⚠️

### Structure 🧩

The project as beend structured as an [NX monorepo](https://nx.dev) :

```
├── 📁 apps
├── 📁 libs
  ├── 📁 components
  ├── ...
├── 📁 tools
├── package.json
├── package-lock.json
```

where:

- **[libs/components](./libs/components/):** core library (source for all the elements/components implemented)

### Dependencies 📡

A recent version (>=16) of [`NodeJS`](https://nodejs.org/en/download/)

> Note that you will need to use npm 6 or higher.

## Running the project 🏃‍

To develop/extend components on the Bee-Q Design System, clone this repo to a new directory:

```bash
git clone ssh://git@bitbucket.endava.com:7999/dsedv001/bee-q.git Bee-Q-Design-System
git checkout develop
cd Bee-Q-Design-System
```

### Installation ⚙️

Simply run:

```bash
npm ci
# Make sure to build first the project before starting it
nx build:components
nx serve components
```

Start coding 😃!

### Build 📦

For a Production build, just run:

```bash
nx build:components
```

## Contributing 💻

💥  If you are in the mood and want to help 🙂, please read carefully our Contributing Guidelines and Development Standards.

## Documentation 📖

### StencilJs

Need help? Check out the Stenciljs docs here (https://stenciljs.com/).

### Tailwind CSS

We use Tailwind CSS for the components style, please take a look at their documentation here: (https://tailwindcss.com/docs/)
