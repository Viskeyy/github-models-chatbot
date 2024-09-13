import createModelClient from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN as string;
const AZURE_ENDPOINT = 'https://models.inference.ai.azure.com';

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const client = createModelClient(AZURE_ENDPOINT, new AzureKeyCredential(GITHUB_TOKEN));
        const { modelName, messages } = await req.json();

        const response = await client.path('/chat/completions').post({ body: { model: modelName, stream: true, messages } });

        if (response.status !== '200') return new NextResponse(JSON.stringify(response.body), { status: parseInt(response.status) });

        return new NextResponse(JSON.stringify(response.body), { status: 200 });
    } catch (error) {
        console.error('Error in Azure API request:', error);
        return new NextResponse(JSON.stringify({ error }), { status: 500 });
    }
}
