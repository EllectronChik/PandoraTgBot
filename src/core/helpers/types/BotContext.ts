import { Context } from "grammy";
import SessionData from "./SessionData";

export default interface BotContext extends Context {
  session: SessionData;
}
