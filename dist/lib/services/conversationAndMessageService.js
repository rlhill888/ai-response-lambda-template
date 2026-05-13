import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "../dynamoDb/dynamodb.js";
export async function createConversationMessage(conversationMessage) {
    const timeStamp = new Date().toISOString();
    const item = {
        ...conversationMessage,
        timeStamp,
    };
    try {
        await dynamoDB.send(new PutCommand({
            TableName: process.env.CONVERSATIONS_AND_MESSAGES_DYNAMO_DB_TABLE_NAME,
            Item: item,
            ConditionExpression: "attribute_not_exists(#conversationId) AND attribute_not_exists(#timeStamp)",
            ExpressionAttributeNames: {
                "#conversationId": "conversationId",
                "#timeStamp": "timeStamp",
            },
        }));
        return item;
    }
    catch (error) {
        console.error("Error creating conversation message:", error);
        throw error;
    }
}
