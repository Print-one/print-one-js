/*eslint sort-keys-fix/sort-keys-fix: "warn"*/

module.exports = {
  scripts: {
    build: ["bsm clean", "tsc --project tsconfig.build.json"],
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
    postinstall: ["ts-patch install"],
    test: {
      $env: "file:.env",
      _ci: "jest --runInBand --forceExit --detectOpenHandles",
      _default: "jest",
      coverage: "bsm ~ -- --coverage",
    },
  },
};
