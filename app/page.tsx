'use client';
import { Select } from '@/components/Select';
import { generateRandomId } from '@/utils/generateRandomId';
import { requestToAzure } from '@/utils/requestToAzure';
import { useState } from 'react';

type Message = {
    id: string;
    role: 'system' | 'user' | 'assistant';
    content: string;
};

const models = [
    { label: 'AI21-Jamba-Instruct', value: 'AI21-Jamba-Instruct' },
    { label: 'Mistral-large', value: 'Mistral-large' },
    { label: 'Mistral-large-2407', value: 'Mistral-large-2407' },
    { label: 'Mistral-nemo', value: 'Mistral-nemo' },
    { label: 'Mistral-small', value: 'Mistral-small' },
    { label: 'Phi-3-medium-128k-instruct', value: 'Phi-3-medium-128k-instruct' },
    { label: 'Phi-3-medium-4k-instruct', value: 'Phi-3-medium-4k-instruct' },
    { label: 'Phi-3-mini-128k-instruct', value: 'Phi-3-mini-128k-instruct' },
    { label: 'Phi-3-mini-4k-instruct', value: 'Phi-3-mini-4k-instruct' },
    { label: 'Phi-3-small-128k-instruct', value: 'Phi-3-small-128k-instruct' },
    { label: 'Phi-3-small-8k-instruct', value: 'Phi-3-small-8k-instruct' },
    { label: 'Phi-3.5-mini-instruct', value: 'Phi-3.5-mini-instruct' },
    { label: 'ai21-jamba-1.5-large', value: 'ai21-jamba-1.5-large' },
    { label: 'ai21-jamba-1.5-mini', value: 'ai21-jamba-1.5-mini' },
    { label: 'cohere-command-r', value: 'cohere-command-r' },
    { label: 'cohere-command-r-plus', value: 'cohere-command-r-plus' },
    { label: 'cohere-embed-v3-english', value: 'cohere-embed-v3-english' },
    { label: 'cohere-embed-v3-multilingual', value: 'cohere-embed-v3-multilingual' },
    { label: 'gpt-4o', value: 'gpt-4o' },
    { label: 'gpt-4o-mini', value: 'gpt-4o-mini' },
    { label: 'meta-llama-3-70b-instruct', value: 'meta-llama-3-70b-instruct' },
    { label: 'meta-llama-3-8b-instruct', value: 'meta-llama-3-8b-instruct' },
    { label: 'meta-llama-3.1-405b-instruct', value: 'meta-llama-3.1-405b-instruct' },
    { label: 'meta-llama-3.1-70b-instruct', value: 'meta-llama-3.1-70b-instruct' },
    { label: 'meta-llama-3.1-8b-instruct', value: 'meta-llama-3.1-8b-instruct' },
    { label: 'text-embedding-3-large', value: 'text-embedding-3-large' },
    { label: 'text-embedding-3-small', value: 'text-embedding-3-small' },
];
export default function Home() {
    const [currentModel, setCurrentModel] = useState('AI21-Jamba-Instruct');
    const [AIResponse, setAIResponse] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const sendToAI = async () => {
        setIsLoading(true);

        const response = await requestToAzure(currentModel);

        setMessages([...messages, { role: 'assistant', content: '', id: generateRandomId() }]);

        for await (const event of response) {
            if (event.data === '[DONE]') return;
            for (const choice of JSON.parse(event.data).choices) {
                setMessages((messages) => {
                    const lastMessage = messages[messages.length - 1];
                    const updatedMessage = {
                        ...lastMessage,
                        content: lastMessage.content + choice.delta.content ?? '',
                    };
                    return [...messages.slice(0, -1), updatedMessage];
                });
            }
        }

        setIsLoading(false);
    };

    return (
        <main>
            <Select options={models} placeholder='Select a model' onChange={(value) => setCurrentModel(value)} />
            <button onClick={sendToAI}>Request to Azure</button>
            <p>{AIResponse}</p>
            {messages.map((message, index) => (
                <div key={message.id}>
                    <p>{message.role}</p>
                    <p>{message.content}</p>
                </div>
            ))}
            <input type='text' onChange={(e) => setMessages([...messages, { role: 'user', content: e.target.value, id: generateRandomId() }])} />
        </main>
    );
}
