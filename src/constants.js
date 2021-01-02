const inProgressAlert =
  'User already has a game in progress. Use the restart command ("/guessgame restart") to start a new game.';

function startMessage(userId, numberOfTurns) {
  return `Welcome <@${userId}> to the guess game. The rules of the game are simple. I,the computer will think of a number between 1 and 10.\
      You will be given ${numberOfTurns} chances to guess the number. If you guess a number higher than what I thought, I will say higher. If you \
      guess a number lower than I thought, I will say lower. May be I will give a few more hints to make it easier for you. \
      Let us start the game now. `;
}

function loseMessage(gameSecret) {
  return `Sorry. The guessed number was ${gameSecret}. I am the winner.`;
}

const winMessage = "Right guess. You are the winner.";

const goLower = "The number I have in mind is lower.";

const goHigher = "The number I have in mind is higher.";

module.exports = {
  inProgressAlert,
  startMessage,
  winMessage,
  loseMessage,
  goLower,
  goHigher,
};
