import OpenAI from "openai";
import { OPENAI_API_KEY, OPENAI_API_MODEL } from "$env/static/private";

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function chatCompletion(prompt: string): Promise<string> {
    const model = OPENAI_API_MODEL || "gpt-4o-mini";
    const completion = await client.chat.completions.create({
        model,
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt }
        ]
    });
    return completion.choices[0]?.message?.content?.trim() || "(no response)";
}

