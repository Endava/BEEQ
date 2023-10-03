# BEEQ Icons: Custom plugin for downloading the icon SVGs

The `generate:icons` local executor will download the SVG files from the [Phosphor icons library](https://phosphoricons.com/) and place them into the Bee-Q assets.

## Running the executor

Although the executor is instantiated before the build and start scripts, it can be also triggered by executing the following in the command line:

```bash
  npx nx run beeq:generate-icons
```

While running we will see different outputs from each of the steps:

```bash
  - Download the Phosphor-icon library
  ✔ Download the Phosphor-icon library
  - Extract and copy all the SVG icon files into the icon component assets folder
  ✔ Extract and copy all the SVG icon files into the icon component assets folder
  - Generate the `icons-set.ts` helper file
  ✔ Generate the `icons-set.ts` helper file
```

## Options

The local executor needs certain options to work as expected, you can find all the options available in [this schema.d.ts file](./src/executors/generate-icons/schema.d.ts).

```ts
  assetsFolder: string; // Name of the assets folder inside the .zip package

  downloadPath: string; // Path where to save the downloaded .zip package

  extractToPath: string; // Path where to extract the .zip package

  fileName: string; // Name of .zip file to download

  helperFile: string; // Name of the .ts helper file to create listing all the available icons name

  outputDir: string; // Output directory where to put the .ts helperFile file created

  sourceDir: string; // Source directory from where to list all the SVG icon files available

  sourceUrl: string; // Url source from where to downlod the icon package

  svgFolder: string; // Name of the SVG folder inside of the .zip package
```

These options are set in the `generate-icons` target inside the [beeq/project.json file](../beeq/project.json):

```json
  "generate-icons": {
    "executor": "@bee-q/icons:generate",
    "outputs": ["{options.downloadPath}", "{options.extractToPath}", "{options.outputDir}"],
    "options": {
      "assetsFolder": "assets",
      "downloadPath": "packages/bee-q-icons/temp",
      "extractToPath": "packages/bee-q/src/components/icon/svg",
      "fileName": "master.zip",
      "helperFile": "icons-set.ts",
      "outputDir": "packages/bee-q/src/components/icon/helper",
      "sourceDir": "packages/bee-q/src/components/icon/svg/regular",
      "svgFolder": "web-master",
      "sourceUrl": "https://github.com/phosphor-icons/phosphor-icons/archive/refs/heads"
    }
  },
```

📖 For more details about Nx local executors, please take a look at their official documentation: https://nx.dev/recipes/executors/creating-custom-executors
