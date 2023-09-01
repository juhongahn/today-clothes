import { NextRequest, NextResponse } from "next/server";
// import { OpenAIStream, OpenAIStreamPayload } from "../../_lib/openaiStream";
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import createPrompts, { createPromptDummy } from "../../_lib/createPrompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_AI_KEY,
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const {inputPrompt} = await req.json();
  const prompts = createPrompts(inputPrompt);
  const messages = createPromptDummy();
  messages.push({
    role: "user",
    content: prompts,
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 1,
    presence_penalty: 0,
    top_p: 1,
    frequency_penalty: 0,
    stream: true,
    max_tokens: 750,
    messages: messages,
  });

  // const stream = await OpenAIStream(payload);
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
