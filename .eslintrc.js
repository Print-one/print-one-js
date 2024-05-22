/*eslint sort-keys-fix/sort-keys-fix: "warn"*/

module.exports = {
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  ignorePatterns: ["**/node_modules", "**/lib", "**/package-lock.json"],
  overrides: [
    {
      files: ["src/**/*.ts"],
      rules: {
        "no-relative-import-paths/no-relative-import-paths": [
          "warn",
          { prefix: "~", rootDir: "src" },
        ],
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "simple-import-sort",
    "no-relative-import-paths",
    "unused-imports",
    "sort-keys-fix",
  ],
  root: true,
};
