//game-store.js - Store, retrieve and update game records in PostgreSQL database

const pool = require("./db-clientpool");

const createRecord = async (dataObj, userId) => {
  const client = await pool.connect();

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
      error: false,
    };
  } catch (err) {
    console.error(err);
    return {
      error: true,
    };
  } finally {
    client.release();
  }
};

const retrieveRecord = async (user) => {
  const client = await pool.connect();

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
    client.release();
  }
};

const updateRecord = async (id, { status, gameSecret }) => {
  const client = await pool.connect();

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
      error: false,
    };
  } catch (err) {
    console.error(err);
    return {
      error: true,
    };
  } finally {
    client.release();
  }
};

module.exports = { createRecord, retrieveRecord, updateRecord };
