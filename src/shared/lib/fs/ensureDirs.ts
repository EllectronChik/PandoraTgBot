import { existsSync, mkdirSync } from "fs";

export default function ensureDirs(dirs: string[]) {
  try {
    [...dirs].forEach((dir) => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
