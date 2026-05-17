import Anthropic from "@anthropic-ai/sdk";
import { getSecret } from "../secrets/awsSecrets.js";

let _client: Anthropic | null = null;

export async function getAnthropicClient(): Promise<Anthropic> {
  if (_client) return _client;
  const secret = await getSecret(process.env.ANTHROPIC_SECRET_ARN!);
  _client = new Anthropic({ apiKey: secret.apiKey });
  return _client;
}