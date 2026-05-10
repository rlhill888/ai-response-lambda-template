export default interface ConversationAndMessages {
    body: string;
    conversationId: string;
    timeStamp: string;
    clientName: string;
    yofiSentMessage: boolean;
    yofiMemberWhoSentMessage?: string;
}