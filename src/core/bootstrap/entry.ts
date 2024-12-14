import { Bot } from "grammy";
import setupLogger from "@/features/logger/setup";
import setupProcessEvents from "../helpers/setupProcessEvents";

export default async function entry() {
  const token = process.env.BOT_TOKEN;

  const logger = await setupLogger();

  if (!token) {
    logger.error("BOT_TOKEN is not defined");
    throw new Error("BOT_TOKEN is not defined");
  }

  const bot = new Bot(token);

  bot.catch((err) => {
    logger.error(`Error: ${err.message}`);
    throw err;
  });

  bot.on("message:text", (ctx) => {
    logger.info(
      `Message by ${ctx.message.from.first_name} ${
        ctx.message.from.last_name || ""
      }(id: ${ctx.message.from.id}): ${ctx.message.text} ${
        ctx.message.forward_origin ? "forwarded" : ""
      }`
    );
    ctx.reply("Echo: " + ctx.message.text);
  });

  bot.start();
  logger.info("Bot successfully started");

  setupProcessEvents(logger);
}
