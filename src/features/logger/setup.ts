import ensureDirs from "@/shared/lib/fs/ensureDirs";
import purgeEmptyLog from "@/shared/lib/logger/purgeEmptyLog";
import purgeOutdatedLog from "@/shared/lib/logger/purgeOutdatedLog";
import formatMessage from "@/shared/lib/messages/formatMessage";
import { createLogger, logLevelNameFor, LogLevels } from "bs-logger";
import { createWriteStream } from "fs";
import path from "path";
import loggerMessages from "assets/messages/loggerMessages.json";

export default async function setupLogger() {
  const errorLogPath = path.resolve(__dirname, "logs/errors");
  const infoLogPath = path.resolve(__dirname, "logs/info");

  const errorLogFilename = path.join(
    errorLogPath,
    `error_${new Date().toISOString()}.log`
  );

  const infoLogFilename = path.join(
    infoLogPath,
    `info_${new Date().toISOString()}.log`
  );

  ensureDirs([errorLogPath, infoLogPath]);

  const errorStream = createWriteStream(errorLogFilename, { flags: "a" });

  errorStream.on("finish", () => {
    purgeEmptyLog(errorLogFilename);
    purgeOutdatedLog(errorLogPath);
  });

  const infoStream = createWriteStream(infoLogFilename, { flags: "a" });

  infoStream.on("finish", () => {
    purgeOutdatedLog(infoLogPath);
  });

  const logger = createLogger({
    targets: [
      {
        stream: errorStream,
        minLevel: LogLevels.error,
        format: (log) => {
          const date = new Date(log.time);
          return `[${logLevelNameFor(
            log.context.logLevel
          )}][${date.toLocaleString()}]: ${log.message}`;
        },
      },
      {
        stream: infoStream,
        minLevel: LogLevels.info,
        format: (log) => {
          const date = new Date(log.time);
          return `[${logLevelNameFor(
            log.context.logLevel
          )}][${date.toLocaleString()}]: ${log.message}`;
        },
      },
      {
        stream: process.stdout,
        minLevel: LogLevels.info,
        format: (log) => {
          const date = new Date(log.time);
          return `[${logLevelNameFor(
            log.context.logLevel
          )}][${date.toLocaleString()}]: ${log.message}`;
        },
      },
    ],
  });

  const streamErrorLogger = (err: Error) =>
    logger.error(
      formatMessage(loggerMessages.error.stream, { message: err.message })
    );

  errorStream.on("error", streamErrorLogger);

  infoStream.on("error", streamErrorLogger);

  return { logger, errorStream, infoStream };
}
