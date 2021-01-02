const {
  randomNumberGeneratorInInterval,
} = require("../src/random-number-functions");

test("Lowest possible value is always start of the range", () => {
  const startOfRange = 1;
  const endOfRange = 10;
  const rangeManipulator = () => 1e-9;

  const number = randomNumberGeneratorInInterval(
    startOfRange,
    endOfRange,
    rangeManipulator
  );

  expect(number).toBe(startOfRange);
});

test("Highest possible value is always end of the range", () => {
  const startOfRange = 1;
  const endOfRange = 10;
  const rangeManipulator = () => 1 - 1e-9;

  const number = randomNumberGeneratorInInterval(
    startOfRange,
    endOfRange,
    rangeManipulator
  );

  expect(number).toBe(endOfRange);
});
