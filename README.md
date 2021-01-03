# Guess game bot for slack

## Setup

Set the following environment variables
`DB_CONNECTION_STRING`, `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, `SLACK_SIGNING_SECRET` and `SLACK_STATE_SECRET`.

> [Create a slack application](https://api.slack.com/apps?new_app=1) to get the `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET` and `SLACK_SIGNING_SECRET`. `SLACK_STATE_SECRET` can be any random string. This [link](https://slack.dev/bolt-js/tutorial/getting-started) can provide detailed instructions on how to set up an app and add required permissions.<br>Scopes are used by the app to perform the necessary reads and writes on the workspace. The required scopes are automatically added when adding the following bot event subscriptions.
>
> ```
> message.channels
> message.groups
> message.im
> message.mpim
> ```
>
> The app should have the following `Bot Token Scopes`
>
> ```
> channels:history
> chat:write
> chat:write.public
> commands
> groups:history
> im:history
> mpim:history
> ```

Run the following command to clone the application and install the required dependencies.

```
git clone https://github.com/sinusen/botgame.git
cd botgame
npm install
```

The application requires a PostgreSQL database. To setup the database table, please execute the following command once.

```
npm run setup
```

To start the application run,

```
npm run start
```

> If you are planning to run the app from your local machine, you may need a program like `ngrok` to expose your local web server to the internet. By default the app listens on port `3000`.

## USAGE

Add the bot to the workspace by installing the application from the following link.
https://slackbotgame.herokuapp.com/slack/install

> You may need to add the bot to the Slack channel to play the game. Execute the following command in each workspace channel to add guessgame bot.
>
> ```
> /invite @guessgame
> ```

Execute the following slash command to run the game.

```
/guessgame start
```

Execute the following slash command to restart the game when the user already has a game in progress.

```
/guessgame restart
```

## DEPENDENCIES

[Bolt](https://slack.dev/bolt-js/tutorial/getting-started) library is used in this application to interact with the Slack workspace. The library is recommended by Slack and has methods to listen and respond to `events`, `commands`, `actions`, `shortcuts` etc. The Bolt library also automatically responds to the `challenge` request sent by Slack on the request url added to event subscription. The Bolt library also includes OAuth support which make the application distributable to multiple workspaces.

[node-postgres (pg)](https://node-postgres.com/) library is used for interacting with PostgreSQL database. The program uses pooling to hold a reusable pool of clients. `db-clientpool.js` in `src\infrastructure` holds the configuration for the pg-pool. The single pool object contained in `db-clientpool.js` is distributed across all files which need database connection.
