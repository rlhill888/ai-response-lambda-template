import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDB } from "../dynamoDb/dynamodb.js";
export async function getAIPrompt() {
    try {
        const result = await dynamoDB.send(new GetCommand({
            TableName: process.env.AI_PROMPT_DYNAMO_DB_TABLE_NAME,
            Key: { promptId: "prompt" },
        }));
        return result.Item ?? null;
    }
    catch (error) {
        console.error("Error fetching AI prompt:", error);
        throw error;
    }
}
