const { App } = require("@slack/bolt");
const { startGame, playGame } = require("./game");
const database = require("./infrastructure/workspace-store");
const slackMessages = require("./constants");

// Initializes your app with your bot token and signing secret
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: "my-state-secret",
  scopes: [
    "channels:history",
    "chat:write",
    "chat:write.public",
    "commands",
    "groups:history",
    "im:history",
    "mpim:history",
  ],
  installationStore: {
    storeInstallation: async (installation) => {
      // change the line below so it saves to your database
      console.log(installation);
      return await database.set(installation.team.id, installation);
    },
    fetchInstallation: async (InstallQuery) => {
      // change the line below so it fetches from your database
      console.log(InstallQuery);
      return await database.get(InstallQuery.teamId);
    },
    storeOrgInstallation: async (installation) => {
      // include this method if you want your app to support org wide installations
      // change the line below so it saves to your database
      console.log(installation);
      return await database.set(installation.enterprise.id, installation);
    },
    fetchOrgInstallation: async (InstallQuery) => {
      // include this method if you want your app to support org wide installations
      // change the line below so it fetches from your database
      console.log(InstallQuery);
      return await database.get(InstallQuery.enterpriseId);
    },
  },
});

//Regular expressions
const START_PATTERN = new RegExp(`^start$`, "i");
const RESTART_PATTERN = new RegExp(`^restart$`, "i");
const NUMBER_MATCH = new RegExp(`^[0-9]|10$`);

// Listens to incoming messages
app.command(process.env.SLASH_COMMAND, async ({ command, ack, say }) => {
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
    analyzeResponse(command.user_id, response, say);
  }
});

app.message(async ({ message, say }) => {
  let response = null;
  switch (true) {
    case NUMBER_MATCH.test(message.text):
      console.log("Matched number");
      response = await playGame(message.user, Number(message.text));
      break;
  }
  analyzeResponse(message.user, response, say);
});

async function analyzeResponse(userId, response, say) {
  if (!response.error) {
    if (response.gameInProgress) {
      await say(slackMessages.inProgressAlert);
    }
    if (response.gameInProgress === false) {
      await say(slackMessages.startMessage(userId, response.numberOfTurns));
    }
    if (response.correctResult) {
      await say(slackMessages.winMessage);
    }
    if (response.correctResult === false && response.gameOver) {
      await say(slackMessages.loseMessage(response.gameSecret));
    }
    if (response.isGreater && response.gameOver === false) {
      await say(slackMessages.goLower);
    }
    if (response.isGreater === false && response.gameOver === false) {
      await say(slackMessages.goHigher);
    }
  }
}

//Function to display any message to slack
(async () => {
  //Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
