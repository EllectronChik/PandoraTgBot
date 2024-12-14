import terminateProcess from "./terminateProcess";
import IProcess from "./types/Process";

export default function setupProcessEvents({
  bot,
  errorStream,
  infoStream,
  logger,
}: IProcess) {
  let terminated = false;

  const terminate = () => {
    if (terminated) {
      console.error("Process already terminated");
      return;
    }
    terminated = true;
    terminateProcess({ bot, errorStream, infoStream, logger });
    console.log("Process terminated");
  };

  process.on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    logger.error(`Unhandled Rejection at ${promise}: ${reason}`);
  });

  process.on("exit", terminate);
  process.on("SIGINT", terminate);
  process.on("SIGTERM", terminate);
}
