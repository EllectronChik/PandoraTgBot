import { Logger } from "bs-logger";
import { WriteStream } from "fs";
import { Bot } from "grammy";
import BotContext from "./BotContext";

export default interface IProcess {
  bot: Bot<BotContext>;
  errorStream: WriteStream;
  infoStream: WriteStream;
  logger: Logger;
}
