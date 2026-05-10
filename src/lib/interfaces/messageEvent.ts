import Conversation from "./conversation.js";
import ConversationAndMessages from "./conversationAndMessages.js";

export interface messageEvent{
    conversationMessage: ConversationAndMessages;
    conversation: Conversation;
}