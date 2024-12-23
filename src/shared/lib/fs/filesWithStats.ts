import { stat } from "fs/promises";

export default async function filesWithStats(
  files: string[]
): Promise<{ file: string; time: number }[]> {
  return Promise.all(
    files.map(async (file) => ({
      file,
      time: (await stat(file)).mtime.getTime(),
    }))
  );
}
