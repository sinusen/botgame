// random-guess-game.js - Game engine

const {
  randomNumberGeneratorInInterval,
} = require("./random-number-functions");

const START_OF_INTERVAL = 0;
const END_OF_INTERVAL = 10;

class RandomGuessGame {
  constructor(
    noOfTries = 3,
    secretGenerator = () =>
      randomNumberGeneratorInInterval(START_OF_INTERVAL, END_OF_INTERVAL)
  ) {
    this.status = {
      gameOver: false,
      correctResult: false,
      isGreater: false,
      remainingTries: noOfTries,
    };
    this.gameSecret = secretGenerator();
  }

  checkGuess(number) {
    if (this.status.gameOver) {
      return this.status;
    }
    this.status.remainingTries--;
    if (number === this.gameSecret) {
      this.status.correctResult = true;
      this.status.gameOver = true;
      return this.status;
    }
    if (this.status.remainingTries === 0) {
      this.status.gameOver = true;
      return this.status;
    }
    if (number > this.gameSecret) {
      this.status.isGreater = true;
    } else {
      this.status.isGreater = false;
    }
    return this.status;
  }
}

module.exports = RandomGuessGame;
