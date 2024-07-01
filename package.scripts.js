/*eslint sort-keys-fix/sort-keys-fix: "warn"*/

module.exports = {
  scripts: {
    build: [
      "ts-patch install",
      "bsm clean",
      "tsc --project tsconfig.build.json",
    ],
    clean: "rimraf ./lib",
    format: {
      _default: "bsm ~.*",
      eslint: "eslint --fix .",
      packageJson: "prettier-package-json --write",
      prettier: "prettier --write .",
    },
    lint: {
      _default: "bsm ~.*",
      eslint: "eslint .",
      prettier: "prettier -c .",
      typescript: "tsc --noEmit",
    },
    test: {
      $env: "file:.env",
      _ci: "jest --runInBand --forceExit --detectOpenHandles",
      _default: "jest",
      coverage: {
        $alias: "cov",
        _default: "bsm test -- --coverage",
      },
    },
  },
};
