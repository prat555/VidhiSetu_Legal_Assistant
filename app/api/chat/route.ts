import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Use Gemini 2.0 Flash - optimized for speed and efficiency
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
    });

    // Format conversation history
    const chatHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    // Start chat with history
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
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
