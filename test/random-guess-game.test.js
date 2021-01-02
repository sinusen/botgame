const RandomGuessGame = require("../src/random-guess-game");

test("Correct guess responds with positive status and sets game as over", () => {
  const numberOfTries = 1;
  const secret = 5;
  const secretGenerator = () => secret;
  const game = new RandomGuessGame(numberOfTries, secretGenerator);

  const correctGuess = 5;
  const status = game.checkGuess(correctGuess);

  expect(status.gameOver).toBe(true);
  expect(status.correctResult).toBe(true);
});

test("Wrong guess when retries are available responds with negative status and does not set game as over", () => {
  const numberOfTries = 5;
  const secret = 5;
  const secretGenerator = () => secret;
  const game = new RandomGuessGame(numberOfTries, secretGenerator);

  const wrongGuess = 6;
  const status = game.checkGuess(wrongGuess);

  expect(status.gameOver).toBe(false);
  expect(status.correctResult).toBe(false);
});

test("Wrong guess for the last try responds with negative status and sets game as over", () => {
  const numberOfTries = 1;
  const secret = 5;
  const secretGenerator = () => secret;
  const game = new RandomGuessGame(numberOfTries, secretGenerator);

  const wrongGuess = 6;
  const status = game.checkGuess(wrongGuess);

  expect(status.gameOver).toBe(true);
  expect(status.correctResult).toBe(false);
});

test("Wrong larger guess when more than one retries are available responds with greater alert", () => {
  const numberOfTries = 2;
  const secret = 5;
  const secretGenerator = () => secret;
  const game = new RandomGuessGame(numberOfTries, secretGenerator);

  const wrongLargerGuess = 6;
  const status = game.checkGuess(wrongLargerGuess);

  expect(status.isGreater).toBe(true);
});

test("Wrong smaller guess when more than one retries are available responds with non greater alert", () => {
  const numberOfTries = 2;
  const secret = 5;
  const secretGenerator = () => secret;
  const game = new RandomGuessGame(numberOfTries, secretGenerator);

  const wrongSmallerGuess = 3;
  const status = game.checkGuess(wrongSmallerGuess);

  expect(status.isGreater).toBe(false);
});

test("Wrong guess reduce the remaining tries by 1", () => {
  const numberOfTries = 3;
  const secret = 5;
  const secretGenerator = () => secret;
  const game = new RandomGuessGame(numberOfTries, secretGenerator);

  const wrongGuess = 3;
  const status = game.checkGuess(wrongGuess);

  expect(status.remainingTries).toBe(numberOfTries - 1);
});
