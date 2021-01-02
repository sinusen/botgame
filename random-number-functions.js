const randomNumberGeneratorInInterval = (
  start,
  end,
  rangeManipulationFunction = Math.random
) => {
  return Math.floor(rangeManipulationFunction() * (end + 1 - start)) + start;
};

module.exports = { randomNumberGeneratorInInterval };
