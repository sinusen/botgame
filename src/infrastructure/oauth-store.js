// oauth-store.js - Persists authentication for different Slack workspaces

const pool = require("./db-clientpool");

const set = async (id, accessToken) => {
  const client = await pool.connect();

  const query = {
    text: `INSERT INTO 
            db.workspace_users (id,access_token)
          VALUES
            ($1,$2)`,
    values: [id, accessToken],
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

const get = async (id) => {
  const client = await pool.connect();

  const query = {
    text: `SELECT
            access_token
          FROM 
            db.workspace_users
          WHERE
            id = $1
          ORDER BY
            pk DESC LIMIT 1`,
    values: [id],
  };

  try {
    const res = await client.query(query);

    if (res.rowCount === 0) {
      return null;
    }
    console.log(JSON.parse(res.rows[0].access_token));
    return JSON.parse(res.rows[0].access_token);
  } catch (err) {
    console.error(err);
    return {
      error: true,
    };
  } finally {
    client.release();
  }
};

module.exports = { get, set };
