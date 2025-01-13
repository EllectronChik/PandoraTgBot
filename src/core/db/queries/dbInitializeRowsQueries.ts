interface IQuery {
  [key: string]: {
    queryName: string;
    query: string;
    values: string[];
  };
}

function dbInitializeRowsQueries(): IQuery {
  return {
    createAdminUser: {
      queryName: "Admin User",
      query: `
      INSERT INTO users (external_id, admin, subscription_level, status)
      VALUES (?, 1, NULL, 0);
    `,
      values: [process.env.ADMIN_ID || "0"],
    },
    createAdminTrustToken: {
      queryName: "Admin Trust Token",
      query: `
        INSERT INTO trust_tokens (user_id, token_hash)
        VALUES ((SELECT id FROM users WHERE external_id = ?), ?);
    `,
      values: [
        process.env.ADMIN_ID || "0",
        process.env.ADMIN_TRUST_TOKEN_HASH || "0",
      ],
    },
    createRegistredTag: {
      queryName: "Registred Tag",
      query: `
        INSERT OR IGNORE INTO tag (tag) 
        VALUES ('registred');
      `,
      values: [],
    },
  };
}

export default dbInitializeRowsQueries;
