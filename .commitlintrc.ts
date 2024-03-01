export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'test', 'docs', 'style', 'chore', 'perf', 'refactor', 'revert', 'ci', 'build', 'wip', 'release'],
    ],
  },
};
