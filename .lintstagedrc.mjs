export default {
  // Global prettier
  '*.{js,json,ts,tsx,scss}': 'prettier --write --config ./.prettierrc',
  // Bee-q linters
  'libs/bee-q/src/**/*.*': 'npm run test:spec -- --findRelatedTests',
};
