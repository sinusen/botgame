// const client = require("./db-client");
const { Client } = require("pg");

config = {
  connectionString: process.env.DB_CONNECTION_STRING,
  max: 20,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
};

const createGame = async (dataObj, userId) => {
  const client = new Client(config);
  await client.connect();

  const query = {
    text: `INSERT INTO 
            db.slack_users (user_id,game_secret,game_over,remaining_tries,created_at)
          VALUES
            ($1,$2,$3,$4,$5)`,
    values: [
      userId,
      dataObj.gameSecret,
      dataObj.status.gameOver,
      dataObj.status.remainingTries,
      Date.now(),
    ],
  };

  try {
    const res = await client.query(query);
    return {
      status: true,
    };
  } catch (err) {
    console.error(err);
    return {
      status: false,
      errorText: err,
    };
  } finally {
    client.end();
  }
};

const retrieveGame = async (user) => {
  const client = new Client(config);
  await client.connect();

  const query = {
    text: `SELECT
            *
          FROM 
            db.slack_users
          WHERE
            user_id = $1
          ORDER BY
            created_at DESC LIMIT 1`,
    values: [user],
  };

  try {
    const res = await client.query(query);

    if (res.rowCount === 0) {
      return {
        error: false,
        userExists: false,
        userGameStatus: null,
      };
    }
    const userData = res.rows[0];

    return {
      error: false,
      userExists: true,
      userGameStatus: {
        id: userData.pk,
        userId: userData.user_id,
        gameSecret: userData.game_secret,
        gameOver: userData.game_over,
        remainingTries: userData.remaining_tries,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      error: true,
      userExists: null,
      userGameStatus: null,
    };
  } finally {
    client.end();
  }
};

const updateGame = async (id, { status, gameSecret }) => {
  const client = new Client(config);
  await client.connect();

  const query = {
    text: `UPDATE 
            db.slack_users
          SET game_secret = $2,
              game_over = $3,
              remaining_tries = $4
          WHERE
            pk = $1
          RETURNING *;`,
    values: [id, gameSecret, status.gameOver, status.remainingTries],
  };

  try {
    const res = await client.query(query);
    return {
      status: true,
    };
  } catch (err) {
    console.error(err);
    return {
      status: false,
      errorText: err,
    };
  } finally {
    client.end();
  }
};

module.exports = { createGame, retrieveGame, updateGame };
