import { Logger } from "bs-logger";
import { access } from "fs/promises";
import path from "path";
import loggerMessages from "assets/messages/loggerMessages.json";

export default async function doesDatabaseExist(
  databasePath: string,
  logger: Logger
): Promise<boolean> {
  try {
    await access(path.join(databasePath, "database.sqlite"));
    logger.info(loggerMessages.info.database.exists);
    return true;
  } catch {
    return false;
  }
}
