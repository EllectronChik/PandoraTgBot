interface IQuery {
  [key: string]: string;
}

const dbIndexQueries: IQuery = {
  connectionTokensUserId: `
      CREATE INDEX idx_connection_tokens_user_id ON connection_tokens(user_id);
    `,
  trustTokensUserId: `
      CREATE INDEX idx_trust_tokens_user_id ON trust_tokens(user_id);
    `,
  userMailSubscriptionsUserId: `
      CREATE INDEX idx_user_mail_subscriptions_user_id ON user_mail_subscriptions(user_id);
    `,
  mailingsMailTypeId: `
      CREATE INDEX idx_mailings_mail_type_id ON mailings(mail_type_id);
    `,
  userMailSubscriptionsMailTypeId: `
      CREATE INDEX idx_user_mail_subscriptions_mail_type_id ON user_mail_subscriptions(mail_type_id);
    `,
  messagesImagesMessageId: `
      CREATE INDEX idx_messages_images_message_id ON messages_images(message_id);
    `,
  mailingsImagesMailingId: `
      CREATE INDEX idx_mailings_images_mailing_id ON mailings_images(mailing_id);
    `,
};
export default dbIndexQueries;
