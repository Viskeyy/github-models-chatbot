'use client';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { generateRandomId } from '@/utils/generateRandomId';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

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
    const [currentModel, setCurrentModel] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const submitMessages = async (messages: Message[]) => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/requestAzure', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    modelName: currentModel,
                    messages: messages.map((message) => ({
                        role: message.role,
                        content: message.content,
                    })),
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error(error);
                throw new Error(error.message);
            }

            setMessages([...messages, { role: 'assistant', content: '', id: generateRandomId() }]);

            const reader = response.body?.getReader();
            if (!reader) throw new Error('Response body is not readable');

            let buffer = '';
            let assistantMessage = '';
            let pendingMessages: string[] = [];

            const processBuffer = () => {
                const lines = buffer.split('\n\n');
                buffer = lines.pop() ?? '';

                for (const line of lines) {
                    if (line.trim().startsWith('data: ')) {
                        const jsonStr = line.replace(/^data: /, '').trim();
                        if (jsonStr === '[DONE]') return;
                        try {
                            const data = JSON.parse(jsonStr);
                            for (const choice of data.choices) {
                                if (choice.delta?.content) {
                                    assistantMessage += choice.delta.content;
                                    pendingMessages.push(assistantMessage);
                                }
                            }
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                        }
                    }
                }
            };

            const processChunk = (chunk: string) => {
                buffer += chunk;
                processBuffer();
            };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = new TextDecoder().decode(value);
                processChunk(chunk);

                if (pendingMessages.length > 0) {
                    setMessages((prevMessages) => {
                        const lastMessage = prevMessages[prevMessages.length - 1];
                        const updatedMessage = {
                            ...lastMessage,
                            content: pendingMessages.join(''),
                        };
                        return [...prevMessages.slice(0, -1), updatedMessage];
                    });
                    pendingMessages = [];
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onInputSubmit = (role: 'user' | 'system') => (event: React.KeyboardEvent<HTMLInputElement>, inputValue: string) => {
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            const newMessage = { role: role, content: inputValue, id: generateRandomId() };

            if (role === 'user') {
                const tempMessages = messages[messages.length - 1]?.content === inputValue ? messages : [...messages, newMessage];
                setMessages(tempMessages);
                submitMessages(tempMessages);
            } else {
                setMessages([newMessage]);
                submitMessages([newMessage]);
            }
        }
    };

    useEffect(() => {
        if (messages.length >= 30) {
            alert(`You have reached the maximum number of messages, Please reload the page to clear the messages.`);
            window.location.reload();
        }
    }, [messages.length]);

    return (
        <main className='mx-auto w-[60vw] p-4'>
            <div className='sticky top-4 flex justify-between'>
                <Select
                    label='Changing the model will clear the dialog'
                    options={models}
                    placeholder='Select a model'
                    onChange={(value) => {
                        setCurrentModel(value);
                        setMessages([]);
                    }}
                />
                <div className='w-64'>
                    <Input label='Changing the prompt will clear the dialog' placeholder='Enter your prompt' onKeyDown={onInputSubmit('system')} />
                </div>
            </div>

            <div className='h-[calc(100vh-10rem)] overflow-y-scroll'>
                {messages.map((message) => (
                    <div key={message.id} className={`${message.role === 'user' ? 'text-right' : ''} p-4`}>
                        <p>{message.role}</p>
                        <Markdown>{message.content}</Markdown>
                    </div>
                ))}
            </div>

            <div className='sticky bottom-4 mx-auto w-3/4'>
                <Input label='The maximum number of messages is 30' onKeyDown={onInputSubmit('user')} placeholder='Send a message' disabled={isLoading} />
            </div>
        </main>
    );
}
