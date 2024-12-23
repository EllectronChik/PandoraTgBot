import { Job, scheduleJob } from "node-schedule";
import { Logger } from "bs-logger";
import backupDatabase from "./backupDatabase";
import loggerMessages from "assets/messages/loggerMessages.json";

interface IJob {
  job: Job | null;
  start(logger: Logger, databasePath: string): void;
  stop(logger: Logger): void;
}

const backupJobManager: IJob = {
  job: null,

  start(logger: Logger, databasePath: string) {
    this.job = scheduleJob("0 0 * * *", async () => {
      await backupDatabase(logger, databasePath);
    });

    logger.info(loggerMessages.info.database.backup.job_started);
  },

  stop(logger: Logger) {
    if (this.job) {
      this.job.cancel();
      this.job = null;

      logger.info(loggerMessages.info.database.backup.job_stopped);
    }
  },
};

export default backupJobManager;
