const randomGuessGame = require("./random-guess-game");
const prompt = require("prompt");

prompt.start();

var promptConfig = {
  properties: {
    guessedNumber: {
      description: "Enter your guess",
      type: "integer",
      pattern: /^([1-9]|10)$/,
      message: "Integers between 1 and 10",
      required: true,
    },
  },
};

var gameObj = new randomGuessGame(3);
console.log(gameObj.gameSecret);

console.log("Game started");

(async function () {
  while (!gameObj.status.gameOver) {
    let { guessedNumber } = await prompt.get(promptConfig);
    await gameObj.checkGuess(guessedNumber);
    if (gameObj.status.correctResult === true) {
      console.log("You are a winner");
      break;
    }
    if (!gameObj.status.gameOver) {
      if (gameObj.status.isGreater) {
        console.log("The number I have in mind is lower.");
      } else {
        console.log("The number I have in mind is larger.");
      }
    }
  }
})();
