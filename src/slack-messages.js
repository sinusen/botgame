// slack-messages.js - Collection of Slack bot responses

const inProgressAlert =
  'User already has a game in progress. Use the restart command ("/guessgame restart") to start a new game.';

function startMessage(userId, numberOfTurns) {
  return `Welcome <@${userId}> to the guess game. The rules of the game are simple. I, the computer will think of a number between 1 and 10.\
 You will be given ${numberOfTurns} chances to guess the number.\
 Let us start the game now.
 _Make sure that guessgame is added to your channel. To add enter "/invite @guessgame"._`;
}

function loseMessage(gameSecret) {
  return `Sorry. The guessed number was ${gameSecret}. I am the winner.`;
}

const winMessage = "Right guess. You are the winner.";

const goLower = "The number I have in mind is lower.";

const goHigher = "The number I have in mind is higher.";

const invalidCommand =
  'Please enter a valid command. The valid commands are "start" and "restart".';

module.exports = {
  inProgressAlert,
  startMessage,
  winMessage,
  loseMessage,
  goLower,
  goHigher,
  invalidCommand,
};
