import { stat, unlink } from "fs/promises";
import formatMessage from "../messages/formatMessage";
import loggerMessages from "assets/messages/loggerMessages.json";

export default async function purgeEmptyLog(
  targetFilename: string
): Promise<void> {
  try {
    const stats = await stat(targetFilename);
    if (stats.size === 0) {
      await unlink(targetFilename);
    }
  } catch (err: unknown) {
    const formatedStatsError = (reason: string) => {
      console.error(
        formatMessage(loggerMessages.error.file.stats, {
          reason,
        })
      );
    };

    if (err instanceof Error) {
      const nodeError = err as NodeJS.ErrnoException;
      if (nodeError.code === "ENOENT") {
        console.log(
          formatMessage(loggerMessages.info.file.file_does_not_exist, {
            targetFilename,
          })
        );
      } else {
        formatedStatsError(err.message);
      }
    } else {
      formatedStatsError(String(err));
    }
  }
}
