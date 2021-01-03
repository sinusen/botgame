// setup-db.js - Database setup script. Creates database tables for handling game and workspace authentication data.
// Execute only once for a database.

const pool = require("./db-clientpool");

const createTables = async () => {
  const client = await pool.connect();

  const query = {
    text: `CREATE TABLE IF NOT EXISTS db.slack_users
    (
        pk serial,
        user_id character varying COLLATE pg_catalog."default" NOT NULL,
        game_secret integer,
        game_over boolean,
        remaining_tries integer,
        created_at bigint,
        CONSTRAINT slack_users_pkey PRIMARY KEY (pk)
    )
    
    TABLESPACE pg_default;
    CREATE TABLE IF NOT EXISTS db.workspace_users
    (
    pk serial,
    id character varying COLLATE pg_catalog."default" NOT NULL,
    access_token character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT workspace_users_pkey PRIMARY KEY (pk)
    )

    TABLESPACE pg_default;`,
  };
  try {
    const res = await client.query(query);
    console.log("DB setup successful");
  } catch (err) {
    console.error("DB setup error");
    console.error(err);
  } finally {
    client.release();
  }
  return;
};

createTables();
