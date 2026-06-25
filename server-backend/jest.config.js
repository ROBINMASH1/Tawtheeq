module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFilesAfterEnv: ['./tests/setup.js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
};
