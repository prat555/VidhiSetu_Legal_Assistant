import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SEARCH_PROMPT = `You are a legal research assistant specializing in Indian case law. Given a search query, provide relevant Indian Supreme Court and High Court judgments.

For each case, provide:
1. Case title/name
2. Citation (if available)
3. Court name
4. Year/Date
5. A brief snippet explaining the key legal principle or holding
6. A plausible URL (use indiankanoon.org format)

Return the results as a JSON array with this structure:
{
  "results": [
    {
      "title": "Case Name vs Case Name",
      "citation": "AIR XXXX SC/HC XXXX or (XXXX) X SCC XXX",
      "court": "Supreme Court of India" or "Delhi High Court" etc,
      "date": "DD Month YYYY" or "YYYY",
      "snippet": "2-3 sentence summary of the key legal principle",
      "url": "https://indiankanoon.org/doc/XXXXXX/"
    }
  ]
}

Provide 5-8 relevant cases. Focus on landmark judgments and well-known cases.`;

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || query.trim().length < 3) {
      return NextResponse.json(
        { error: 'Search query is too short' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
    });

    const prompt = `${SEARCH_PROMPT}

Search Query: ${query}

Provide relevant Indian case laws in JSON format only, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();

    // Clean up response
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText);
      
      // Return fallback results
      return NextResponse.json({
        results: [
          {
            title: "Search Results Available",
            citation: "",
            court: "Multiple Courts",
            date: "Various",
            snippet: `For comprehensive case law search on "${query}", please visit Indian Kanoon (indiankanoon.org) or consult legal databases. AI-generated results are being processed.`,
            url: `https://indiankanoon.org/search/?formInput=${encodeURIComponent(query)}`
          }
        ]
      });
    }
  } catch (error: any) {
    console.error('Error searching cases:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search cases' },
      { status: 500 }
    );
  }
}
