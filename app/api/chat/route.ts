import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || 'models/gemini-2.5-flash-lite';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/auto';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

type AppMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ProviderError = Error & {
  status?: number;
  statusCode?: number;
};

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

const SYSTEM_PROMPT = `You are an expert legal assistant specializing in Indian law. Your role is to:

1. Provide accurate information about Indian legal matters, including:
   - Constitutional law
   - Criminal law (IPC, CrPC, etc.)
   - Civil law
   - Corporate law
   - Family law
   - Property law
   - Consumer rights
   - Labor law

2. Help users understand legal concepts in simple, accessible language
3. Guide users on legal procedures and documentation
4. Suggest when professional legal consultation is necessary
5. Provide relevant case law references when applicable
6. Always mention that your advice is informational and not a substitute for professional legal counsel

Remember:
- Be precise and cite relevant sections of Indian laws when applicable
- Use simple language to explain complex legal concepts
- Always remind users to consult with a qualified lawyer for specific legal matters
- Be empathetic and professional
- If uncertain about something, acknowledge it and suggest consulting a legal professional`;

function isRetryableProviderError(error: unknown): boolean {
  const providerError = error as ProviderError;
  const statusCode = providerError?.status || providerError?.statusCode;
  return statusCode === 429 || statusCode === 500 || statusCode === 502 || statusCode === 503 || statusCode === 504;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Failed to process chat request';
}

function getStatusCode(error: unknown): number | undefined {
  const providerError = error as ProviderError;
  const statusCode = providerError?.status || providerError?.statusCode;
  return typeof statusCode === 'number' ? statusCode : undefined;
}

async function generateWithGemini(messages: AppMessage[]): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const model = genAI.getGenerativeModel({
    model: CHAT_MODEL,
  });

  const chatHistory = messages.slice(0, -1).map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  const lastMessage = messages[messages.length - 1].content;

  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I am ready to assist with Indian legal matters. I will provide accurate information, explain concepts clearly, and always remind users to consult with qualified lawyers for specific legal advice. How may I help you today?' }],
      },
      ...chatHistory,
    ],
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
    },
  });

  const result = await chat.sendMessage(lastMessage);
  const response = await result.response;
  return response.text();
}

async function generateWithOpenRouter(messages: AppMessage[]): Promise<string> {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  const mappedMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    })),
  ];

  const response = await fetch(OPENROUTER_BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: mappedMessages,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  const data: OpenRouterResponse = await response.json();
  if (!response.ok) {
    const message = data?.error?.message || `OpenRouter request failed with status ${response.status}`;
    const err = new Error(message) as ProviderError;
    err.status = response.status;
    throw err;
  }

  const text = data?.choices?.[0]?.message?.content;
  if (!text || typeof text !== 'string') {
    throw new Error('OpenRouter returned an empty response');
  }

  return text;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { messages?: AppMessage[] };
    const messages = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    let text: string;
    let provider: 'gemini' | 'openrouter' = 'gemini';

    try {
      text = await generateWithGemini(messages);
    } catch (geminiError: unknown) {
      console.error('Gemini chat failed:', geminiError);

      const canTryOpenRouter = !!process.env.OPENROUTER_API_KEY;
      const shouldFallback = !process.env.GEMINI_API_KEY || isRetryableProviderError(geminiError);

      if (!canTryOpenRouter || !shouldFallback) {
        throw geminiError;
      }

      text = await generateWithOpenRouter(messages);
      provider = 'openrouter';
    }

    return NextResponse.json({ message: text, provider });
  } catch (error: unknown) {
    console.error('Error in chat API:', error);

    const statusCode = getStatusCode(error);
    if (statusCode === 429 || statusCode === 503) {
      return NextResponse.json(
        { error: 'The chat providers are temporarily busy due to high demand. Please retry in a moment.' },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
