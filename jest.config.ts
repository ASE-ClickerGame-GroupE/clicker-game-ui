import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  rootDir: './',
  preset: 'ts-jest',
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
  coverageDirectory: 'coverage',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {tsconfig: '<rootDir>/tsconfig.jest.json'}],
  }
};

export default config;
