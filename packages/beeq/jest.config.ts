import type { Config } from 'jest';

export default {
  displayName: 'beeq',
  preset: '../../jest.preset.ts',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/packages/beeq/tsconfig.spec.json',
    },
  },
  transformIgnorePatterns: ['/node_modules/(?!(jest)/)'],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/beeq',
  testTimeout: 10000,
  detectOpenHandles: true,
  forceExit: false,
} satisfies Config;
