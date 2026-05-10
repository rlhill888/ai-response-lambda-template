import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "../dynamoDb/dynamodb.js";
import {  promptObj } from "../interfaces/prompt.js";


export async function getAIPrompt() {
    try {
        const result = await dynamoDB.send(
            new GetCommand({
                TableName: process.env.AI_PROMPT_DYNAMO_DB_TABLE_NAME as string,
                Key: { promptId: "prompt" },
            })
        );

        return result.Item as promptObj ?? null;
    } catch (error) {

        console.error("Error fetching AI prompt:", error);

        throw error;
    }
}