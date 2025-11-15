import { streamText } from "ai"
import 'dotenv/config';

export const promptAI = async (prompt: string/*, info: JSON*/) => {
    const result = streamText({
        model: "google/gemini-2.5-flash-lite",
        prompt: prompt,
        api
    })

    let generatedText = ""
    for await (const textPart of result.textStream) {
        generatedText += textPart
    }

    const resultWithText = result as unknown as { text: string; usage: string; finishReason: string }
    resultWithText.text = generatedText

    return resultWithText

}