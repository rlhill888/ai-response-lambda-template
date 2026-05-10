import Ably from "ably";

export const ablyRest = new Ably.Rest(process.env.ABLY_API_KEY!);
export const YOFI_CHAT_CHANNEL = "yofi-chat-updates";