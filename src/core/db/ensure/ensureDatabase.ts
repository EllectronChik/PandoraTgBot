import { Logger } from "bs-logger";
import doesDatabaseExist from "./helpers/doesDatabaseExist";
import tryRestoreDatabase from "./helpers/tryRestoreDatabase";
import createDatabase from "./helpers/createDatabase";

export default async function ensureDatabase(
  databasePath: string,
  logger: Logger
) {
  if (await doesDatabaseExist(databasePath, logger)) {
    return;
  }

  if (await tryRestoreDatabase(logger, databasePath)) {
    return;
  }

  createDatabase(logger, databasePath);
}
