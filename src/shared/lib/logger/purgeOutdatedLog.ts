import isValidDirectoryPath from "@/shared/lib/validators/isValidDirectoryPath";
import { readdir, stat, unlink } from "fs/promises";
import path from "path";

export default async function purgeOutdatedLog(
  targetPath: string
): Promise<void> {
  const maxLogCnt = Number(process.env.MAX_LOG_CNT);

  if (!maxLogCnt || maxLogCnt <= 0) {
    console.error(`MAX_LOG_CNT is not defined or invalid`);
    return;
  }

  if (!(await isValidDirectoryPath(targetPath))) {
    console.log(`Directory ${targetPath} does not exist`);
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
      console.log(`Files count: ${files.length}`);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error deleting files: ${err.message}`);
    } else {
      console.error(`Unknown error: ${err}`);
    }
  }
}
