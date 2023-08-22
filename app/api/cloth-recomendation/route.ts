import { NextRequest, NextResponse } from "next/server";
import { OpenAIStream, OpenAIStreamPayload } from "../../_lib/openaiStream";
import createPrompts, { createPromptDummy } from "../../_lib/createPrompts";

export async function POST(req: NextRequest) {
  const {inputPrompt} = await req.json();
  const prompts = createPrompts(inputPrompt);
  const messages = createPromptDummy();
  messages.push({
    role: "user",
    content: prompts,
  });
  
  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: 1,
    presence_penalty: 0,
    top_p: 1,
    frequency_penalty: 0,
    stream: true,
    max_tokens: 1000,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
