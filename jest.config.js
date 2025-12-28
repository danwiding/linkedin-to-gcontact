export default {
  testEnvironment: 'jsdom',
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
