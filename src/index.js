const { App, LogLevel } = require("@slack/bolt");
const { startGame, playGame, NUMBER_OF_TURNS } = require("./game");
const database = require("./infrastructure/oauth-store");
const slackMessages = require("./slack-messages");

const logLevel =
  process.env.PRODUCTION === "true" ? LogLevel.INFO : LogLevel.DEBUG;

// Initializes the Slack app
//Enables OAuth support which make the application distributable to
//multiple workspaces
//https://slack.dev/bolt-js/concepts#authenticating-oauth
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.SLACK_STATE_SECRET,
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
      return await database.set(installation.team.id, installation);
    },
    fetchInstallation: async (InstallQuery) => {
      return await database.get(InstallQuery.teamId);
    },
    storeOrgInstallation: async (installation) => {
      return await database.set(installation.enterprise.id, installation);
    },
    fetchOrgInstallation: async (InstallQuery) => {
      return await database.get(InstallQuery.enterpriseId);
    },
  },
  logLevel,
});

//Pattern to filter incoming commands and messages
const START_PATTERN = new RegExp(`^start$`, "i");
const RESTART_PATTERN = new RegExp(`^restart$`, "i");
const NUMBER_MATCH = new RegExp(`^[0-9]|10$`);

// Listens to incoming command
app.command(process.env.SLASH_COMMAND, async ({ command, ack, say }) => {
  let gameResponse = null;

  // Acknowledge command request
  await ack();

  switch (true) {
    case START_PATTERN.test(command.text):
      console.debug("Matched start");
      gameResponse = await startGame(command.user_id);
      break;
    case RESTART_PATTERN.test(command.text):
      console.debug("Matched restart");
      gameResponse = await startGame(command.user_id, true);
      break;
    default:
      console.debug("Invalid command", command.text);
      await say(slackMessages.invalidCommand);
      break;
  }
  if (gameResponse) {
    console.debug("Game start response", gameResponse);
    const { noResponse, message } = slackifyGameStart(
      command.user_id,
      gameResponse
    );
    console.debug("Slackify game start response", { noResponse, message });
    if (noResponse) {
      return;
    }
    await say(message);
  }
});

// Listens to incoming messages
app.message(async ({ message, say }) => {
  let gameResponse = null;
  switch (true) {
    case NUMBER_MATCH.test(message.text):
      console.debug("Matched number");
      gameResponse = await playGame(message.user, Number(message.text));
      break;
  }
  if (gameResponse) {
    const { noResponse, message } = slackifyGameRun(gameResponse);
    if (noResponse) {
      return;
    }
    await say(message);
  }
});

function slackifyGameStart(userId, response) {
  if (response.error) {
    return {
      noResponse: true,
      message: null,
    };
  }
  if (response.gameInProgress) {
    return {
      noResponse: false,
      message: slackMessages.inProgressAlert,
    };
  }
  return {
    noResponse: false,
    message: slackMessages.startMessage(userId, NUMBER_OF_TURNS),
  };
}

function slackifyGameRun(response) {
  if (response.error) {
    return {
      noResponse: true,
      message: null,
    };
  }
  if (response.correctResult) {
    return {
      noResponse: false,
      message: slackMessages.winMessage,
    };
  }
  if (response.gameOver) {
    return {
      noResponse: false,
      message: slackMessages.loseMessage(response.gameSecret),
    };
  }
  if (response.isGreater) {
    return {
      noResponse: false,
      message: slackMessages.goLower,
    };
  }
  return {
    noResponse: false,
    message: slackMessages.goHigher,
  };
}

//Function to display any message to slack
(async () => {
  //Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
