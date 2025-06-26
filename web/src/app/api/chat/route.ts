import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    messages,
    system: `You are a helpful assistant for an e-commerce parts store. 
    You can help customers find parts, answer questions about products, 
    and provide technical support. Be friendly and professional.`,
  });

  return result.toDataStreamResponse();
} 