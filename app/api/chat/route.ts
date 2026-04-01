import { NextRequest, NextResponse } from 'next/server';

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://127.0.0.1:8002';
const RAG_FALLBACK_URL = process.env.RAG_SERVICE_FALLBACK_URL || 'http://localhost:8000';

interface RagChatRequest {
  message: string;
  session_id?: string;
}

interface RagChatResponse {
  answer: string;
  sources: string[];
  cached: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1].content;

    if (!lastMessage || typeof lastMessage !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    const ragUrls = [RAG_SERVICE_URL, RAG_FALLBACK_URL];
    let data: RagChatResponse | null = null;
    let lastError = '';

    for (const baseUrl of ragUrls) {
      try {
        const ragResponse = await fetch(`${baseUrl}/api/legal-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: lastMessage,
          } as RagChatRequest),
        });

        if (!ragResponse.ok) {
          const errorData = await ragResponse.text();
          lastError = `${baseUrl} -> ${ragResponse.status}: ${errorData}`;
          continue;
        }

        data = (await ragResponse.json()) as RagChatResponse;
        break;
      } catch (error: any) {
        lastError = `${baseUrl} -> ${error?.message || 'request failed'}`;
      }
    }

    if (!data) {
      throw new Error(`RAG service failed on all endpoints. Last error: ${lastError}`);
    }

    return NextResponse.json({
      message: data.answer,
      sources: data.sources,
      cached: data.cached,
    });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
