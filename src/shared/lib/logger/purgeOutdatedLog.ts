import isValidDirectoryPath from "@/shared/lib/validators/isValidDirectoryPath";
import { readdir, stat, unlink } from "fs/promises";
import path from "path";
import formatMessage from "../messages/formatMessage";
import loggerMessages from "assets/messages/loggerMessages.json";

export default async function purgeOutdatedLog(
  targetPath: string
): Promise<void> {
  const maxLogCnt = Number(process.env.MAX_LOG_CNT);

  if (!maxLogCnt || maxLogCnt <= 0) {
    console.error(formatMessage);
    return;
  }

  if (!(await isValidDirectoryPath(targetPath))) {
    console.log(
      formatMessage(loggerMessages.info.file.directory_does_not_exist, {
        targetPath,
      })
    );
    return;
  }

  try {
    const files = await readdir(targetPath);
    if (files.length > maxLogCnt) {
      const filesWithStats = await Promise.all(
        files.map(async (file) => ({
          file,
          time: (await stat(path.join(targetPath, file))).mtime.getTime(),
        }))
      );

      filesWithStats.sort((a, b) => a.time - b.time);

      const filesToPurge = filesWithStats.splice(0, maxLogCnt);

      for (const file of filesToPurge) {
        const filePath = path.join(targetPath, file.file);
        await unlink(filePath);
      }
    } else {
      console.log(
        formatMessage(loggerMessages.info.file.cnt, {
          cnt: files.length.toString(),
        })
      );
    }
  } catch (err: unknown) {
    console.error(
      formatMessage(loggerMessages.error.file.delete, {
        reason: err instanceof Error ? err.message : String(err),
      })
    );
  }
}
