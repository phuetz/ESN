export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^react(.*)$': '<rootDir>/node_modules/react$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
