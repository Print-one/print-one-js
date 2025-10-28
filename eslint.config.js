/* eslint-disable @typescript-eslint/no-require-imports */
const { defineConfig, globalIgnores } = require("eslint/config");

const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const noRelativeImportPaths = require("eslint-plugin-no-relative-import-paths");
const unusedImports = require("eslint-plugin-unused-imports");
const sortKeysFix = require("eslint-plugin-sort-keys-fix");
const eslint = require("@eslint/js");
const eslintConfigPrettier = require("eslint-config-prettier/flat");
const tseslint = require("typescript-eslint");

module.exports = defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
    },

    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      eslintConfigPrettier,
    ],

    plugins: {
      "simple-import-sort": simpleImportSort,
      "no-relative-import-paths": noRelativeImportPaths,
      "unused-imports": unusedImports,
      "sort-keys-fix": sortKeysFix,
    },
  },
  globalIgnores(["**/node_modules", "**/lib", "**/package-lock.json"]),
  {
    files: ["src/**/*.ts"],

    rules: {
      "unused-imports/no-unused-imports": "error",
    },
  },
]);
