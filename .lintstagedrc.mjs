export default {
  // Global prettier
  '*.{js,json,md,ts,tsx,scss}': 'prettier --write --config ./.prettierrc',
  // Bee-q linters
  'libs/bee-q/src/**/*.*': 'npm run test -- --findRelatedTests',
};
