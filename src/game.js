// game.js - Starts, manages and persists game status

const randomGuessGame = require("./random-guess-game");
const {
  createRecord,
  retrieveRecord,
  updateRecord,
} = require("./infrastructure/game-store");

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

async function playGame(userId, userGuess) {
  const { error, userExists, userGameStatus } = await retrieveRecord(userId);

  if (error || !userExists || userGameStatus.gameOver) {
    return {
      error: true,
    };
  }

  // Creates game object from persisted data
  const game = reconstructGame(userGameStatus);

  // Game play
  game.checkGuess(userGuess);

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

function reconstructGame({ gameSecret, remainingTries }) {
  return new randomGuessGame(remainingTries, () => gameSecret);
}

module.exports = { startGame, playGame, NUMBER_OF_TURNS };
