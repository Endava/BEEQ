const { resolve } = require('path');

/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {
      config: resolve(__dirname, 'tailwind.config.ts'),
    },
    autoprefixer: {},
  },
};
