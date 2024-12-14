import IProcess from "./types/Process";

export default function terminateProcess(
  { bot, errorStream, infoStream, logger }: IProcess,
  onExit?: () => void
) {
  bot.stop();
  logger.info("Bot successfully stopped");
  errorStream.end();
  infoStream.end();

  if (onExit) {
    onExit();
  }
}
