import { Bot } from "grammy";
import setupLogger from "@/features/logger/setup";
import setupProcessEvents from "../helpers/setupProcessEvents";
import path from "path";
import loggerMessages from "assets/messages/loggerMessages.json";
import chatMessages from "assets/messages/chatMessages.json";
import dotenv from "dotenv";
import backupJobManager from "../db/backup/backupJobManager";
import ensureDatabase from "../db/ensure/ensureDatabase";

export default async function entry() {
  dotenv.config();

  const token = process.env.BOT_TOKEN;

  const { logger, errorStream, infoStream } = await setupLogger();

  const databasePath = path.resolve(__dirname, "data");

  if (!token) {
    logger.error(loggerMessages.error.bot.token);
    throw new Error(loggerMessages.error.bot.token);
  }

  await ensureDatabase(databasePath, logger);

  backupJobManager.start(logger, databasePath);

  const bot = new Bot(token);

  bot.catch((err) => {
    logger.error(loggerMessages.error.unknown.error, { err });
    throw err;
  });

  bot.start();
  logger.info(loggerMessages.info.bot.started);

  bot.command("start", async (ctx) => {
    await ctx.reply(chatMessages.welcome_message_html, { parse_mode: "HTML" });
  });

  setupProcessEvents({ bot, errorStream, infoStream, logger });
}
