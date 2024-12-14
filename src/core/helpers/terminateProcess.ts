import { Logger } from "bs-logger";
import { WriteStream } from "fs";
import { Bot } from "grammy";

interface TerminateProcess {
  bot: Bot;
  errorStream: WriteStream;
  infoStream: WriteStream;
  logger: Logger;
}

export default function terminateProcess(
  { bot, errorStream, infoStream, logger }: TerminateProcess,
  onExit?: () => void
) {
  bot.stop();
  errorStream.end();
  infoStream.end();
  logger.info("Bot successfully stopped");

  if (onExit) {
    onExit();
  }
}
