import { Logger } from "bs-logger";
import { Database } from "sqlite3";
import dbCreatingQueries from "./queries/dbCreatingQueries";
import dbIndexQueries from "./queries/dbIndexQueries";
import dbInitializeRowsQueries from "./queries/dbInitializeRowsQueries";
import loggerMessages from "assets/messages/loggerMessages.json";
import formatMessage from "@/shared/lib/messages/formatMessage";

export default function initializeDb(db: Database, logger: Logger) {
  try {
    db.serialize(() => {
      logger.info(loggerMessages.info.database.started);

      Object.keys(dbCreatingQueries).forEach((query) => {
        db.run(dbCreatingQueries[query].query);
        logger.info(
          formatMessage(loggerMessages.info.database.table_created, {
            tableName: dbCreatingQueries[query].name,
          })
        );
      });

      logger.info(loggerMessages.info.database.initialized);

      Object.keys(dbIndexQueries).forEach((query) => {
        db.run(dbIndexQueries[query]);
      });

      logger.info(loggerMessages.info.database.indexes_created);

      if (!process.env.ADMIN_ID) {
        logger.error(loggerMessages.error.database.admin.id_not_defined);
        throw new Error(loggerMessages.error.database.admin.id_not_defined);
      }

      if (!process.env.ADMIN_TRUST_TOKEN_HASH) {
        logger.error(
          loggerMessages.error.database.admin.trust_token_not_defined
        );
        throw new Error(
          loggerMessages.error.database.admin.trust_token_not_defined
        );
      }

      const initializeRowsQueries = dbInitializeRowsQueries();

      Object.keys(initializeRowsQueries).forEach((query) => {
        db.run(
          initializeRowsQueries[query].query,
          initializeRowsQueries[query].values
        );

        logger.info(
          formatMessage(loggerMessages.info.database.initial_row_inserted, {
            rowName: initializeRowsQueries[query].queryName,
          })
        );
      });
    });

    db.on("trace", (query) => {
      logger.debug(query);
    });
  } catch (error: unknown) {
    logger.error(
      formatMessage(loggerMessages.error.database.initialization, {
        message: error instanceof Error ? error.message : String(error),
      })
    );
    throw error;
  }
}
