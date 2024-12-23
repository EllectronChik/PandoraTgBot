interface IQuery {
  [key: string]: string;
}

const dbAdminQueries: IQuery = {
  createAdminUser: `
    INSERT INTO users (user_id, admin, subscription_level, status, tag_id)
    VALUES (?, 1, NULL, 0, NULL);
  `,
  createAdminTrustToken: `
      INSERT INTO trust_tokens (user_id, token_hash)
      VALUES ((SELECT id FROM users WHERE user_id = ?), ?);
  `,
};

export default dbAdminQueries;
