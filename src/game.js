const randomGuessGame = require("./random-guess-game");
const {
  createGame,
  retrieveGame,
  updateGame,
} = require("./infrastructure/data-store");

//Global constants
const NUMBER_OF_TURNS = 3;

async function startGame(userId, forceStart = false) {
  if (!forceStart) {
    const { error, userExists, userGameStatus } = await retrieveGame(userId);
    if (error) {
      return {
        error: true,
        gameInProgress: null,
        numberOfTurns: NUMBER_OF_TURNS,
      };
    }
    if (userExists && !userGameStatus.gameOver) {
      return {
        error: false,
        gameInProgress: true,
        numberOfTurns: NUMBER_OF_TURNS,
      };
    }
  }
  return createNewGame(userId);
}

async function createNewGame(userId) {
  const game = new randomGuessGame(NUMBER_OF_TURNS);
  const storeReturn = await createGame(game, userId);

  if (storeReturn.status) {
    return {
      error: false,
      gameInProgress: false,
      numberOfTurns: NUMBER_OF_TURNS,
    };
  } else {
    return {
      error: true,
      gameInProgress: false,
      numberOfTurns: NUMBER_OF_TURNS,
    };
  }
}

//Function to play the game
async function playGame(userId, userGuess) {
  const { error, userExists, userGameStatus } = await retrieveGame(userId);

  if (error || !userExists || userGameStatus.gameOver) {
    return {
      error: true,
      userNotFound: true,
    };
  }

  //Creates a game with the retrieved data
  const game = reconstructGame(userGameStatus);

  //Checks the user guess against the game secret
  game.checkGuess(userGuess);

  //Saves the game to database
  const updateResponse = await updateGame(userGameStatus.id, game);
  if (!updateResponse.status) {
    return {
      error: true,
      userNotFound: false,
    };
  }

  return {
    error: false,
    userNotFound: false,
    gameSecret: game.gameSecret,
    ...game.status,
  };
}

//Function to create a game object
function reconstructGame({ gameSecret, remainingTries }) {
  return new randomGuessGame(remainingTries, () => gameSecret);
}

module.exports = { startGame, playGame };
