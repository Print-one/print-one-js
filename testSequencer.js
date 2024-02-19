// eslint-disable-next-line @typescript-eslint/no-var-requires
const Sequencer = require("@jest/test-sequencer").default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    tests = [...tests];

    // Run Batch last
    const batch = tests.filter((test) =>
      test.path.toLowerCase().includes("batch"),
    );
    tests = tests.filter((test) => !test.path.toLowerCase().includes("batch"));

    return [...tests, ...batch];
  }
}

module.exports = CustomSequencer;
