import { Logger } from "bs-logger";
import terminateProcess from "./terminateProcess";

export default function setupProcessEvents(logger: Logger) {
  process.on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    logger.error(`Unhandled Rejection at ${promise}: ${reason}`);
  });

  process.on("exit", terminateProcess);
  process.on("SIGINT", terminateProcess);
  process.on("SIGTERM", terminateProcess);
}
