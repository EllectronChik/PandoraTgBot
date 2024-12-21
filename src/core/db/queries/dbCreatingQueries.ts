interface IQuery {
  [key: string]: {
    name: string;
    query: string;
  };
}

const dbCreatingQueries: IQuery = {
  users: {
    name: "Users",
    query: `
        CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL UNIQUE,
          admin BOOLEAN DEFAULT 0,
          subscription_level INTEGER DEFAULT 1,
          status INTEGER DEFAULT 0,
          tag_id INTEGER,
          FOREIGN KEY (tag_id) REFERENCES user_tag (id)
        );
      `,
  },
  user_tag: {
    name: "UserTag",
    query: `
        CREATE TABLE user_tag (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tag TEXT NOT NULL UNIQUE
        );
        `,
  },
  connection_tokens: {
    name: "ConnectionTokens",
    query: `
        CREATE TABLE connection_tokens (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          token_hash TEXT NOT NULL UNIQUE,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
      `,
  },
  trust_tokens: {
    name: "TrustTokens",
    query: `
        CREATE TABLE trust_tokens (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          token_hash TEXT NOT NULL UNIQUE,
          issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
      `,
  },
  user_mail_subscriptions: {
    name: "UserMailSubscriptions",
    query: `
        CREATE TABLE user_mail_subscriptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          mail_type_id INTEGER NOT NULL,
          UNIQUE(user_id, mail_type_id),
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (mail_type_id) REFERENCES mail_types (id) ON DELETE CASCADE
        );
      `,
  },
  mail_types: {
    name: "MailTypes",
    query: `
        CREATE TABLE mail_types (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          is_active BOOLEAN DEFAULT 1
        );
      `,
  },
  messages: {
    name: "Messages",
    query: `
        CREATE TABLE messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          message_title TEXT NOT NULL,
          message_body TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `,
  },
  mailings: {
    name: "Mailings",
    query: `
        CREATE TABLE mailings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          mailing_title TEXT NOT NULL,
          mailing_body TEXT NOT NULL,
          mail_type_id INTEGER NOT NULL,
          scheduled_at DATETIME,
          FOREIGN KEY (mail_type_id) REFERENCES mail_types (id) ON DELETE CASCADE
        );
      `,
  },
  messagesImages: {
    name: "MessagesImages",
    query: `
        CREATE TABLE messages_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          message_id INTEGER NOT NULL,
          image_link TEXT NOT NULL,
          FOREIGN KEY (message_id) REFERENCES messages (id) ON DELETE CASCADE
        );
      `,
  },
  mailingsImages: {
    name: "MailingsImages",
    query: `
        CREATE TABLE mailings_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          mailing_id INTEGER NOT NULL,
          image_link TEXT NOT NULL,
          FOREIGN KEY (mailing_id) REFERENCES mailings (id) ON DELETE CASCADE
        );
      `,
  },
};

export default dbCreatingQueries;
