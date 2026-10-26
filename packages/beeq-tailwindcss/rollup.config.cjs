const { withNx } = require('@nx/rollup/with-nx');

module.exports = withNx(
  {
    main: "./src/index.ts",
    format: ["esm", "cjs"],
    deleteOutputPath: true,
    generateExportsField: true,
    outputPath: "../../dist/beeq-tailwindcss",
    tsConfig: "./tsconfig.lib.json",
    external: [
      "tailwindcss",
      "tailwindcss-theme-swapper"
    ],
    assets: [
      {
        "glob": "packages/beeq-tailwindcss/README.md",
        "input": ".",
        "output": "."
      }
    ]
  },
  {
    // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
    // e.g.
    // output: { sourcemap: true },
  }
);
