import { createHmac } from "crypto";

export default function generateHash(unhashedString: string) {
  if (!process.env.SECRET) {
    throw new Error("SECRET is not defined");
  }
  if (!unhashedString) {
    throw new Error("unhashedString is not defined");
  }
  return createHmac("sha256", process.env.SECRET)
    .update(unhashedString)
    .digest("hex");
}
