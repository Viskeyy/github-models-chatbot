import createModelClient from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';
import { createSseStream } from '@azure/core-sse';

const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN as string;
const endpoint = 'https://models.inference.ai.azure.com';

export const requestToAzure = async (modelName: string) => {
    const client = createModelClient(endpoint, new AzureKeyCredential(token));

    const response = await client.path('/chat/completions').post({
        body: {
            model: modelName,
            stream: true,
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Why the sky blue?' },
            ],
        },
    }).asNodeStream();

    const stream = response.body;
    if (!stream) {
        throw new Error('The response stream is undefined');
    }
    if (response.status !== '200') {
        throw new Error(`Failed to get chat completions, http operation failed with ${response.status}`);
    }

    const sseStream = createSseStream(stream as any);

    return sseStream;
};

