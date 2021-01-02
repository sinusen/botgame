const client = require("./dbClient");

const createTable = async () => {
  client.connect();

  const query = {
    text: `CREATE TABLE db.slack_users
    (
        pk serial,
        user_id character varying COLLATE pg_catalog."default" NOT NULL,
        game_secret integer,
        game_over boolean,
        remaining_tries integer,
        created_at bigint,
        CONSTRAINT slack_users_pkey PRIMARY KEY (pk)
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
    client.end();
  }
};

createTable();
