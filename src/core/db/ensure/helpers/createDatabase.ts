import { Logger } from "bs-logger";
import loggerMessages from "assets/messages/loggerMessages.json";
import isValidDirectoryPath from "@/shared/lib/validators/isValidDirectoryPath";
import formatMessage from "@/shared/lib/messages/formatMessage";
import { mkdir } from "fs/promises";
import sqlite3 from "sqlite3";
import path from "path";
import initializeDb from "../../initialize";

export default async function createDatabase(
  logger: Logger,
  databasePath: string
) {
  logger.info(loggerMessages.info.database.backup.not_found);
  if (!(await isValidDirectoryPath(databasePath, logger))) {
    logger.info(
      formatMessage(loggerMessages.info.database.creating.dir, {
        databasePath,
      })
    );
    await mkdir(databasePath);
  }

  logger.info(
    formatMessage(loggerMessages.info.database.creating.base, {
      databasePath,
    })
  );
  const db = new sqlite3.Database(path.join(databasePath, "database.sqlite"));

  try {
    initializeDb(db, logger);
  } catch (err) {
    throw err;
  } finally {
    db.close();
  }
}
