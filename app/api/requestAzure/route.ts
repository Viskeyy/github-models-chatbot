import createModelClient from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN as string;
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT as string;

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const { modelName, messages } = await req.json();

    if (!modelName || !messages || !Array.isArray(messages)) {
        return new NextResponse(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
    }

    try {
        const client = createModelClient(AZURE_ENDPOINT, new AzureKeyCredential(GITHUB_TOKEN));

        const response = await client.path('/chat/completions').post({ body: { model: modelName, stream: true, messages } });

        if (response.status !== '200') return new NextResponse(JSON.stringify(response.body), { status: parseInt(response.status) });

        if (response.body) {
            return new NextResponse(response.body, { status: 200 });
        } else {
            return new NextResponse(JSON.stringify({ error: 'No response body' }), { status: 500 });
        }
    } catch (error) {
        console.error('Error in Azure API request:', error);
        return new NextResponse(JSON.stringify({ error }), { status: 500 });
    }
}
