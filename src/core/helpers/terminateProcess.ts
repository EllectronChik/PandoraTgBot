import backupJobManager from "../db/backup/backupJobManager";
import IProcess from "./types/Process";
import loggerMessages from "assets/messages/loggerMessages.json";

export default function terminateProcess(
  { bot, errorStream, infoStream, logger }: IProcess,
  onExit?: () => void
) {
  bot.stop();
  backupJobManager.stop(logger);
  logger.info(loggerMessages.info.bot.stopped);
  errorStream.end();
  infoStream.end();

  if (onExit) {
    onExit();
  }
}
