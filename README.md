# Guess game bot for slack

## Setup

Set the following environment variables
`DB_CONNECTION_STRING`, `SLACK_BOT_TOKEN` and `SLACK_SIGNING_SECRET`

> [Create a slack application](https://api.slack.com/apps?new_app=1) to get the `SLACK_BOT_TOKEN` and `SLACK_SIGNING_SECRET`.

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
