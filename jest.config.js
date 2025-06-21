export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/server/tests/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/server/$1"  
  },
  transform: {},
  globals: {
    "NODE_ENV": "test"
  }
};

