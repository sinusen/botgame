# Guess game bot for slack

## Setup

Set the following environment variables
`DB_CONNECTION_STRING`, `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET` and `SLASH_COMMAND`

> [Create a slack application](https://api.slack.com/apps?new_app=1) to get the `SLACK_BOT_TOKEN` and `SLACK_SIGNING_SECRET`. This [link](https://slack.dev/bolt-js/tutorial/getting-started) can provide detailed instructions on how to set up an app and add required permissions.<br>Bot token(`xoxb`) and scopes are used by the app to perform the necessary reads and writes on the workspace. The required scopes are automatically added by adding the following bot event subscriptions.
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

Execute the following slash command to run the game.

```
/guessgame start
```

Execute the following slash command to restart the game when the user already has a game in progress.

```
/guessgame restart
```

## DEPENDENCIES

`Bolt` library is used in this application to interact with the Slack workspace. The library has methods to listen and respond to `events`, `commands`, `actions`, `shortcuts` etc.<br> By default Bolt uses `/slack/events` endpoint to listen to incoming requests. This endpoint should be appended to all request urls configured in Slack. The Bolt library also automatically responds to the `challenge` request sent by Slack on the request url added to event subscription.

`node-postgres (pg)` library is used for interfacing with PostgreSQL databasae. The program uses pooling to hold a reusable pool of clients. `db-client.js` in `src\infrastructure` holds the configuration for the pg-pool. The single pool object contained in `db-client.js` is distributed across all use files (only `data-store.js` in `src\infrastructure` in this case). `connect()`, `query()` and `release()` methods are used to create a client, run the query and release the client back to the pool.
