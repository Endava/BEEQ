const { resolve } = require('path');

/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    tailwindcss: {
      config: resolve(__dirname, 'tailwind.config.ts'),
    },
    autoprefixer: {},
  },
};
