import { stat } from "fs/promises";
import formatMessage from "../messages/formatMessage";
import loggerMessages from "assets/messages/loggerMessages.json";

interface ILogger {
  error: (text: string) => void;
  info?: (text: string) => void;
  debug?: (text: string) => void;
}

type TLogger = ILogger | ((text: string) => void);

const adaptLogger = (logger: TLogger): ILogger =>
  typeof logger === "function" ? { error: logger } : logger;

export default async function isValidDirectoryPath(
  targetPath: string,
  logger: TLogger = console.error
): Promise<boolean> {
  const adaptedLogger = adaptLogger(logger);
  try {
    const stats = await stat(targetPath);
    return stats.isDirectory();
  } catch (err: unknown) {
    adaptedLogger.error(
      formatMessage(loggerMessages.error.file.check, {
        targetPath,
        reason: err instanceof Error ? err.message : String(err),
      })
    );
    return false;
  }
}
