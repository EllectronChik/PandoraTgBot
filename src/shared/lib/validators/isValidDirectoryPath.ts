import { stat } from "fs/promises";

export default async function isValidDirectoryPath(
  targetPath: string
): Promise<boolean> {
  try {
    const stats = await stat(targetPath);
    return stats.isDirectory();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error getting file stats: ${err.message}`);
    } else {
      console.error(`Error getting file stats: ${err}`);
    }
    return false;
  }
}
