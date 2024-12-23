import filesWithStats from "@/shared/lib/fs/filesWithStats";
import formatMessage from "@/shared/lib/messages/formatMessage";
import { Logger } from "bs-logger";
import { copyFile, readdir } from "fs/promises";
import path from "path";
import loggerMessages from "assets/messages/loggerMessages.json";

export default async function tryRestoreDatabase(
  logger: Logger,
  databasePath: string
): Promise<boolean> {
  const entries = await readdir(path.join(databasePath, "backups"));

  if (entries.length > 0) {
    const files = await filesWithStats(entries);

    const backups = files.sort((a, b) => b.time - a.time);
    if (backups.length > 0) {
      let tries = 0;
      const backup_cnt = process.env.BACKUP_CNT;
      while (tries < parseInt(backup_cnt || "3")) {
        try {
          await copyFile(
            path.join(databasePath, "backups", backups[tries].file),
            path.join(databasePath, "database.sqlite")
          );
          return true;
        } catch {
          logger.error(
            formatMessage(loggerMessages.error.database.backup.restore, {
              backupPath: backups[tries].file,
            })
          );
          tries++;
        }
      }
    }
  }

  return false;
}
