import { createHmac } from "crypto";

export default function generateHash(
  unhashedString: string,
  min_length: number
) {
  if (!process.env.SECRET) {
    throw new Error("SECRET is not defined");
  }
  if (!unhashedString || unhashedString.length <= min_length) {
    throw new Error("unhashedString is too short");
  }
  return createHmac("sha256", process.env.SECRET)
    .update(unhashedString)
    .digest("hex");
}
