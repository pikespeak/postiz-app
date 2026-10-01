import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { compilerOptions } = require('./tsconfig.base.json');

const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: '<rootDir>/',
});

const transform: Config['transform'] = {
  '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  // ESM-only dependencies of the jsdom bundled with isomorphic-dompurify
  '^.+\\.m?js$': [
    'ts-jest',
    {
      tsconfig: {
        allowJs: true,
        isolatedModules: true,
        module: 'commonjs',
        target: 'es2022',
      },
    },
  ],
};

const esmOnlyPackages = [
  '@exodus',
  '@asamuzakjp',
  '@csstools',
  'parse5',
  'entities',
].join('|');

// Skip node_modules, except when the innermost package is one of the above.
const transformIgnorePatterns = [
  `/node_modules/(?!(?:${esmOnlyPackages})/)[^/]+/(?!.*node_modules/)`,
];

const config: Config = {
  projects: [
    {
      displayName: 'node',
      testEnvironment: 'node',
      rootDir: __dirname,
      testMatch: [
        '<rootDir>/apps/backend/src/**/*.spec.ts',
        '<rootDir>/apps/orchestrator/src/**/*.spec.ts',
        '<rootDir>/libraries/*/src/**/*.spec.ts',
      ],
      moduleNameMapper,
      transform,
      transformIgnorePatterns,
    },
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      rootDir: __dirname,
      // .spec.tsx needs apps/frontend/tsconfig.json to exclude it from next build first
      testMatch: ['<rootDir>/apps/frontend/src/**/*.spec.ts'],
      moduleNameMapper,
      transform,
      transformIgnorePatterns,
    },
  ],
  coverageProvider: 'v8',
  coverageReporters: ['text-summary', 'json-summary', 'lcov'],
  // Testable logic only. UI components and the social provider clients
  // are measured separately once they get their own tests.
  collectCoverageFrom: [
    'apps/backend/src/**/*.ts',
    'apps/orchestrator/src/activities/**/*.ts',
    'apps/frontend/src/**/*.ts',
    'libraries/*/src/**/*.ts',
    '!**/*.spec.ts',
    '!**/*.d.ts',
    '!**/main.ts',
    '!**/*.module.ts',
    '!libraries/nestjs-libraries/src/integrations/social/**',
  ],
  // Ratchet: add a module once it has tests, raise its numbers whenever
  // coverage goes up, never lower them. Target is 80% for every module.
  // "global" only covers files not matched by a module entry.
  coverageThreshold: {
    global: {
      lines: 0,
    },
    './libraries/helpers/src/utils/': {
      lines: 32,
    },
  },
};

export default config;
