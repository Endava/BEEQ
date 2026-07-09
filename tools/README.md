# BEEQ Icons: Custom plugin for downloading the icon SVGs

The `icons` local executor will download the SVG files from the [Phosphor icons library](https://phosphoricons.com/) and place them into the Bee-Q assets.

## Running the executor

Although the executor is instantiated by the `beeq:build-ci` pipeline, it can also be triggered from the command line:

```bash
  npx nx run beeq:icons
```

While running we will see different outputs from each of the steps:

```bash
  - Download the Phosphor-icon library
  ✔ Download the Phosphor-icon library
  - Extract and copy all the SVG icon files into the icon component assets folder
  ✔ Extract and copy all the SVG icon files into the icon component assets folder
```

## Options

The local executor needs these options to work as expected. You can find the source of truth in [schema.d.ts](./src/executors/icons/schema.d.ts).

```ts
  assetsFolder: string; // Name of the assets folder inside the .zip package

  downloadPath: string; // Path where to save the downloaded .zip package

  extractToPath: string; // Path where to extract the .zip package

  fileName: string; // Name of .zip file to download

  sourceUrl: string; // Base URL from where to download the icon archive

  sourceRef: string; // Immutable source ref (tag or commit SHA)

  svgFolder: string; // Name of the SVG folder inside of the .zip package

  metadataFile?: string; // Marker file stored in extractToPath (default: .icons-meta.json)

  skipIfUpToDate?: boolean; // Skip download/extract when metadata + SVGs are already valid

  force?: boolean; // Ignore metadata and force download/extract

  minSvgCount?: number; // Sanity check for extracted icons (default: 1)
```

These options are set in the `icons` target inside the [beeq/project.json file](../packages/beeq/project.json):

```json
  "icons": {
    "executor": "@bee-q/tools:icons",
    "outputs": ["{options.extractToPath}"],
    "options": {
      "assetsFolder": "assets",
      "downloadPath": "tmp",
      "extractToPath": "packages/beeq/src/components/icon/svg",
      "fileName": "v2.1.0.zip",
      "sourceRef": "v2.1.0",
      "svgFolder": "core-2.1.0",
      "sourceUrl": "https://github.com/phosphor-icons/core/archive/refs/tags"
    }
  },
```

📖 For more details about Nx local executors, please take a look at their official documentation: https://nx.dev/recipes/executors/creating-custom-executors
