// src/routes/api/chat/+server.ts
import { json } from '@sveltejs/kit';
import { chatCompletion } from '$lib/server/api_llm/openai';

export async function POST({ request }) {
    const { message } = await request.json();
    if (!message || typeof message !== 'string') {
        return json({ error: 'Missing "message"' }, { status: 400 });
    }

    try {
        const reply = await chatCompletion(message);
        return json({ reply });
    } catch (e) {
        return json({ error: (e as Error).message }, { status: 500 });
    }
}
