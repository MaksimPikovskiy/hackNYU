import { system_prompt_recommendations } from "@/lib/constants";
import { OpenRouter } from "@openrouter/sdk";

const client = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return new Response("Missing prompt", { status: 400 });
        }

        const response = await client.chat.send({
            model: "google/gemini-2.5-flash-image",
            messages: [
                {
                    role: "system",
                    content: system_prompt_recommendations,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            stream: false,
        });

        const rawContent = response.choices?.[0]?.message?.content;
        const text = Array.isArray(rawContent) ? rawContent.join("") : rawContent ?? "";

        return new Response(text, { status: 200 });
    } catch (err) {
        console.error("OpenRouter API error:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}