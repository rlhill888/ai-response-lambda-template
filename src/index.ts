import type { Context } from "aws-lambda";
import { client } from "./lib/anthropicApi/anthropic.js";
import Conversation from "./lib/interfaces/conversation.js";
import EventInterface from "./lib/interfaces/EventInterface.js";
import aiPrompt from "./lib/prompt/aiPrompt.js";
import { createConversationMessage } from "./lib/services/conversationAndMessageService.js";
import type { SQSEvent } from "aws-lambda";
import { setConversationAiResponseToggle, setConversationAsCurrentlyNotBeingRespondedByAi, updateConversationMostRecentMessage, updateUserInterventionRequired } from "./lib/services/conversationService.js";
import { ablyRest, COMPANY_NAME_PLACEHOLDER_CHAT_CHANNEL } from "./lib/ably/ablyRest.js";
import { getAIPrompt } from "./lib/services/promptService.js";
import generatePrompt from "./lib/prompt/aiPrompt.js";

export async function handler(event: SQSEvent, context: Context) {

  try {

    console.log("Event:", event);
    console.log("Request ID:", context.awsRequestId);
    const body = JSON.parse(event.Records[0].body);
    // recieve event

    //client message already created in db

    // get all messages thread from event


    const messageThread = JSON.parse(body.messages)
    const conversation = JSON.parse(body.conversation) as Conversation

    // get ai prompt from db

    const prompt = await getAIPrompt()

    // generate ai response for message with the entire message thread
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: messageThread,
      system: generatePrompt(prompt)
    });

    // save response in db as COMPANY_NAME_PLACEHOLDER sender message
    const block = response.content[0];
    const reply = block.type === "text" ? block.text : "";
    if (reply === "$!$MESSAGE_NEEDS_HUMAN_INTERVENTION$!$") {

      const setConversationAsNotBeingRespondedToByAi = await setConversationAsCurrentlyNotBeingRespondedByAi(conversation.conversationId, conversation.timeStamp)
      const updateUserInterventionRequiredToTrue = await updateUserInterventionRequired(conversation.conversationId, conversation.timeStamp, true)
      const toggleMessageAiResponse = await setConversationAiResponseToggle(conversation.conversationId, conversation.timeStamp, false)

      const channel = ablyRest.channels.get(COMPANY_NAME_PLACEHOLDER_CHAT_CHANNEL);
      
      const publishAiResponding = await channel.publish("ai-responding-to-conversation-update", {
        update: "ai-responding-to-conversation-update",
        conversation,
        aiResponding: false,
        needsHumanIntervention: true,
        message: null,
        createdAt: new Date().toISOString(),
      });

      const publishResponse = await channel.publish("conversation-update-new-message", {
        update: "conversation-update-new-message",
        conversation,
        message: null,
        needsHumanIntervention: true,
        createdAt: new Date().toISOString(),
      });

    } else {
      const newMessage = await createConversationMessage({
        conversationId: conversation.conversationId,
        body: reply,
        clientName: conversation.clientName,
        COMPANY_NAME_PLACEHOLDERSentMessage: true,
        COMPANY_NAME_PLACEHOLDERMemberWhoSentMessage: "Jessica - Ai Chat Bot"
      })

      // set the conversation as not still currently being updated by ai

      const setConversationAsNotBeingRespondedToByAi = await setConversationAsCurrentlyNotBeingRespondedByAi(conversation.conversationId, conversation.timeStamp)


      const updateMostRecentMessageForConversation = await updateConversationMostRecentMessage(
        conversation.conversationId,
        conversation.timeStamp,
        reply,
        true
      )

      const channel = ablyRest.channels.get(COMPANY_NAME_PLACEHOLDER_CHAT_CHANNEL);

      const publishResponse = await channel.publish("conversation-update-new-message", {
        update: "conversation-update-new-message",
        conversation,
        message: newMessage,
        createdAt: new Date().toISOString(),
      });

      const publishAiResponding = await channel.publish("ai-responding-to-conversation-update", {
        update: "ai-responding-to-conversation-update",
        conversation,
        aiResponding: false,
        message: newMessage,
        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        message: `Successfully Generated new message`
      };

    }
  } catch (error) {
    console.log("Error with ai lambda")
    throw error

  }

}