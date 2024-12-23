import formatMessage from "@/shared/lib/messages/formatMessage";
import isValidDirectoryPath from "@/shared/lib/validators/isValidDirectoryPath";
import { cp, mkdir } from "fs/promises";
import path from "path";
import loggerMessages from "assets/messages/loggerMessages.json";
import { Logger } from "bs-logger";

export default async function backupDatabase(
  logger: Logger,
  databasePath: string
) {
  const backupPath = path.join(databasePath, "backups");
  try {
    if (!(await isValidDirectoryPath(backupPath))) {
      await mkdir(backupPath);
    }

    logger.info(
      formatMessage(loggerMessages.info.database.backup.creating, {
        backupPath,
      })
    );
    await cp(
      path.join(databasePath, "database.sqlite"),
      path.join(backupPath, `database_backup_${Date.now()}` + ".sqlite")
    );

    logger.info(
      formatMessage(loggerMessages.info.database.backup.created, {
        backupPath,
      })
    );
  } catch {
    logger.error(
      formatMessage(loggerMessages.error.database.backup.creating, {
        backupPath,
      })
    );
  }
}
