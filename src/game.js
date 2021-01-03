const randomGuessGame = require("./random-guess-game");
const {
  createRecord,
  retrieveRecord,
  updateRecord,
} = require("./infrastructure/game-store");

//Global constants
const NUMBER_OF_TURNS = 3;

async function startGame(userId, forceStart = false) {
  if (!forceStart) {
    const { error, userExists, userGameStatus } = await retrieveRecord(userId);
    if (error) {
      return {
        error: true,
        gameInProgress: null,
      };
    }
    if (userExists && !userGameStatus.gameOver) {
      return {
        error: false,
        gameInProgress: true,
      };
    }
  }
  return createNewGame(userId);
}

async function createNewGame(userId) {
  const game = new randomGuessGame(NUMBER_OF_TURNS);
  const { error } = await createRecord(game, userId);

  if (error) {
    return {
      error: true,
      gameInProgress: false,
    };
  }
  return {
    error: false,
    gameInProgress: false,
  };
}

//Function to play the game
async function playGame(userId, userGuess) {
  const { error, userExists, userGameStatus } = await retrieveRecord(userId);

  if (error || !userExists || userGameStatus.gameOver) {
    return {
      error: true,
    };
  }

  //Creates a game with the retrieved data
  const game = reconstructGame(userGameStatus);

  //Checks the user guess against the game secret
  game.checkGuess(userGuess);

  //Saves the game to database
  const updateResponse = await updateRecord(userGameStatus.id, game);
  if (updateResponse.error) {
    return {
      error: true,
    };
  }

  return {
    error: false,
    gameSecret: game.gameSecret,
    ...game.status,
  };
}

//Function to create a game object
function reconstructGame({ gameSecret, remainingTries }) {
  return new randomGuessGame(remainingTries, () => gameSecret);
}

module.exports = { startGame, playGame, NUMBER_OF_TURNS };
