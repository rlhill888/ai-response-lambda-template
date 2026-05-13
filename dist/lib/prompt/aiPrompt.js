export default function generatePrompt(AiPrompt) {
    const MessagingServiceExplanation = "You are a professional AI assistant for this business. Respond in a helpful, warm, and professional tone. Keep answers concise, accurate, and focused on helping the customer with their question or next step";
    const flatMessageExplanation = "Sometimes you will need to flag a message as needs human intervention. If for any of the reasons below you need to flag a message, it is very important that you make this response return EXACTLY this: $!$MESSAGE_NEEDS_HUMAN_INTERVENTION$!$";
    const finalPrompt = `${MessagingServiceExplanation} \n \n ${AiPrompt.AIResponsePrompt} \n \n ${flatMessageExplanation} \n \n ${AiPrompt.FlagUserInLoopRequirements}`;
    return finalPrompt;
}
