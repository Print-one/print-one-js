/**
 * @type {import("@jest/types").Config.ProjectConfig}
 */
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["{src,test}/**/*.(t|j)s(x|)"],
  coveragePathIgnorePatterns: ["node_modules", "test/", "dist/", ".spec.ts"],
  transformIgnorePatterns: ["/node_modules/", "/dist/"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  coverageReporters: ["text", "json", "html"],
  reporters: ["default", "github-actions"],
  testLocationInResults: true,
  setupFilesAfterEnv: ["jest-extended/all"],
};
