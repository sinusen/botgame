const { App } = require("@slack/bolt");
const { startGame } = require("./game");
const slackMessages = require("./constants");

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
  let response = null;

  // Acknowledge command request
  await ack();

  switch (true) {
    case START_PATTERN.test(command.text):
      console.log("Matched start");
      response = await startGame(command.user_id);
      break;
    case RESTART_PATTERN.test(command.text):
      console.log("Matched restart");
      response = await startGame(command.user_id, true);
      break;
    default:
      await say("Invalid Entry");
      break;
  }
  if (response) {
    await say(analyzeResponse(command.user_id, response));
  }
});

app.message(async ({ message, say }) => {
  switch (true) {
    case NUMBER_MATCH.test(message.text):
      console.log("Matched number");
      const response = await playGame(message.user, Number(message.text));
      break;
  }
  await say(analyzeResponse(command.user_id, response));
});

function analyzeResponse(userId, response) {
  if (!response.error) {
    if (response.gameInProgress) {
      return slackMessages.inProgressAlert;
    }
    if (!response.gameInProgress) {
      return slackMessages.startMessage(userId, response.numberOfTurns);
    }
    if (response.correctResult === true) {
      return slackMessages.winMessage;
    }
    if (response.gameOver) {
      return slackMessages.loseMessage(response.gameSecret);
    }
    if (response.isGreater) {
      return slackMessages.goLower;
    }
    if (response.isGreater === false) {
      return slackMessages.goHigher;
    }
  }
}

//Function to display any message to slack
(async () => {
  //Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
