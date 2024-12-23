import formatMessage from "@/shared/lib/messages/formatMessage";
import terminateProcess from "./terminateProcess";
import IProcess from "./types/Process";
import loggerMessages from "assets/messages/loggerMessages.json";

export default function setupProcessEvents({
  bot,
  errorStream,
  infoStream,
  logger,
}: IProcess) {
  let terminated = false;

  const terminate = () => {
    if (terminated) {
      console.error(loggerMessages.info.process.already_terminated);
      return;
    }
    terminated = true;
    terminateProcess({ bot, errorStream, infoStream, logger });
    console.log(loggerMessages.info.process.terminated);
  };

  process.on("uncaughtException", (err) => {
    logger.error(
      formatMessage(loggerMessages.error.unknown.exception, {
        message: `${typeof err === "string" ? err : err.message}`,
      })
    );
    logger.error(
      formatMessage(loggerMessages.error.unknown.stack, {
        stack: err.stack || loggerMessages.error.unknown.unknown_stack,
      })
    );
  });

  process.on("unhandledRejection", (reason, promise) => {
    logger.error(
      formatMessage(loggerMessages.error.unknown.rejection, {
        promise: JSON.stringify(promise),
        reason: JSON.stringify(reason),
      })
    );
  });

  process.on("exit", terminate);
  process.on("SIGINT", terminate);
  process.on("SIGTERM", terminate);
}
