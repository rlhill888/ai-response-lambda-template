import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "../dynamoDb/dynamodb.js";
export async function setConversationAsCurrentlyNotBeingRespondedByAi(conversationId, timeStamp) {
    try {
        const result = await dynamoDB.send(new UpdateCommand({
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: {
                conversationId,
                timeStamp,
            },
            UpdateExpression: "SET currentlyBeingRespondedByAi = :currentlyBeingRespondedByAi",
            ExpressionAttributeValues: {
                ":currentlyBeingRespondedByAi": false,
            },
            ReturnValues: "ALL_NEW",
        }));
        return result;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
export async function updateUserInterventionRequired(conversationId, timeStamp, userInterventionRequired) {
    try {
        const result = await dynamoDB.send(new UpdateCommand({
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: {
                conversationId,
                timeStamp,
            },
            UpdateExpression: "SET userInterventionRequired = :userInterventionRequired",
            ExpressionAttributeValues: {
                ":userInterventionRequired": userInterventionRequired,
            },
            ReturnValues: "ALL_NEW",
        }));
        return result;
    }
    catch (error) {
        console.error("Error updating user intervention required:", error);
        throw error;
    }
}
export async function updateConversationMostRecentMessage(conversationId, timeStamp, mostRecentMessage, setNewMessage) {
    try {
        const lastMessageTimeStamp = new Date().toISOString();
        const result = await dynamoDB.send(new UpdateCommand({
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: {
                conversationId,
                timeStamp,
            },
            UpdateExpression: setNewMessage
                ? "SET mostRecentMessage = :mostRecentMessage, lastMessageTimeStamp = :lastMessageTimeStamp, newMessage = :newMessage"
                : "SET mostRecentMessage = :mostRecentMessage, lastMessageTimeStamp = :lastMessageTimeStamp",
            ExpressionAttributeValues: setNewMessage
                ? {
                    ":mostRecentMessage": mostRecentMessage,
                    ":lastMessageTimeStamp": lastMessageTimeStamp,
                    ":newMessage": true,
                }
                : {
                    ":mostRecentMessage": mostRecentMessage,
                    ":lastMessageTimeStamp": lastMessageTimeStamp,
                },
            ReturnValues: "ALL_NEW",
        }));
        return result;
    }
    catch (error) {
        console.error("Error updating most recent message:", error);
        throw error;
    }
}
export async function setConversationAiResponseToggle(conversationId, timeStamp, aiAutoResponseToggle) {
    try {
        const result = await dynamoDB.send(new UpdateCommand({
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: {
                conversationId,
                timeStamp,
            },
            UpdateExpression: "SET aiAutoResponseToggle = :aiAutoResponseToggle",
            ExpressionAttributeValues: {
                ":aiAutoResponseToggle": aiAutoResponseToggle,
            },
            ReturnValues: "ALL_NEW",
        }));
        return result;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
