export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: ['**/tests/unit/**/*.spec.js'],
  collectCoverageFrom: [
    '*.js',
    '!jest.config.js',
    '!playwright.config.ts',
  ],
};
