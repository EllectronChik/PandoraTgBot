import { Logger } from "bs-logger";
import { WriteStream } from "fs";
import { Bot } from "grammy";

export default interface IProcess {
  bot: Bot;
  errorStream: WriteStream;
  infoStream: WriteStream;
  logger: Logger;
}
