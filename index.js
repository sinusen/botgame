const { App } = require("@slack/bolt");
const randomGuessGame = require("./random-guess-game");
const { createGame, retrieveGame, updateGame } = require("./dataStore");

//Global constants
const NUMBER_OF_TURNS = 3;
const BOT_NAME = "Guess_game";

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

//Regular expressions
const START_PATTERN = new RegExp(`^start$`, "i");
const RESTART_PATTERN = new RegExp(`^restart$`, "i");
const NUMBER_MATCH = new RegExp(`^[0-9]|10$`);

// Listens to incoming messages
app.command("/guessgame", async ({ command, ack, say }) => {
  let responseText = null;
  // Acknowledge command request
  await ack();
  switch (true) {
    case START_PATTERN.test(command.text):
      console.log("Matched start");
      responseText = await startGame(command.user_id);
      await say(responseText);
      break;
    case RESTART_PATTERN.test(command.text):
      console.log("Matched restart");
      responseText = await createNewGame(command.user_id);
      await say(responseText);
      break;
    default:
      await say("Invalid Entry");
      break;
  }
});

app.message(async ({ message, say }) => {
  switch (true) {
    case NUMBER_MATCH.test(message.text):
      console.log("Matched number");
      const response = await playGame(message.user, Number(message.text));
      if (!response.userNotFound) {
        await say(response.message);
      }
      break;
  }
});

//Function to start the game
async function startGame(userId) {
  const { userExists, userGameStatus } = await retrieveGame(userId);
  if (userExists && !userGameStatus.gameOver) {
    return `User already has a game in progress. Use the restart command to start a new game.`;
  }
  return createNewGame(userId);
}

//Function to create a new game
async function createNewGame(userId) {
  const game = new randomGuessGame(NUMBER_OF_TURNS);
  const storeReturn = await createGame(game, userId);

  if (storeReturn.status) {
    return `Welcome <@${userId}> to the guess game. The rules of the game are simple. I,the computer will think of a number between 1 and 10.\
    You will be given ${NUMBER_OF_TURNS} chances to guess the number. If you guess a number higher than what I thought, I will say higher. If you guess a number\
    lower than I thought, I will say lower. May be I will give a few more hints to make it easier for you. Let us start the game now. `;
  } else {
    return `Error starting game. Please try again later`;
  }
}

//Function to play the game
async function playGame(userId, userGuess) {
  const { error, userExists, userGameStatus } = await retrieveGame(userId);

  if (error || !userExists || userGameStatus.gameOver) {
    return {
      userNotFound: true,
      message: null,
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
      userNotFound: false,
      message: "Please try again later",
    };
  }

  //Interpret game response and build user message
  return buildUserMessage(game.gameSecret, game.status);
}

//Function to create a game object
function reconstructGame({ gameSecret, remainingTries }) {
  return new randomGuessGame(remainingTries, () => gameSecret);
}

//Function to interpret game response
function buildUserMessage(gameSecret, { correctResult, gameOver, isGreater }) {
  if (correctResult === true) {
    return {
      userNotFound: false,
      message: "Right guess. You are the winner.",
    };
  }
  if (gameOver) {
    return {
      userNotFound: false,
      message: `Sorry. The guessed number was ${gameSecret}. I am the winner.`,
    };
  }
  if (isGreater) {
    return {
      userNotFound: false,
      message: "The number I have in mind is lower.",
    };
  } else {
    return {
      userNotFound: false,
      message: "The number I have in mind is larger.",
    };
  }
}

//Function to display any message to slack
(async () => {
  //Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
