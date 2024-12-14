import { stat, unlink } from "fs/promises";

export default async function purgeEmptyLog(
  targetFilename: string
): Promise<void> {
  console.log(targetFilename);
  try {
    const stats = await stat(targetFilename);
    if (stats.size === 0) {
      await unlink(targetFilename);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      const nodeError = err as NodeJS.ErrnoException;
      if (nodeError.code === "ENOENT") {
        console.log(`File ${targetFilename} does not exist`);
      } else {
        console.error(`Error getting file stats: ${err.message}`);
      }
    } else {
      console.error(`Error getting file stats: ${err}`);
    }
  }
}
