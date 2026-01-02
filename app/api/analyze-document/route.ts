import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const ANALYSIS_PROMPT = `You are an expert legal document analyzer specializing in Indian law. Analyze the provided document and return a structured JSON response with the following format:

{
  "documentType": "Type of document (e.g., Employment Contract, Rental Agreement, NDA, Legal Notice, etc.)",
  "summary": "A concise 2-3 sentence summary of the document",
  "keyPoints": ["Array of 3-5 most important points or clauses"],
  "risks": ["Array of potential risks, unfair clauses, or red flags - identify specific concerns"],
  "recommendations": ["Array of actionable recommendations for the reader"],
  "analysis": "Detailed analysis explaining key legal aspects, obligations, rights, and important considerations under Indian law"
}

Focus on:
1. Identifying unfair or one-sided clauses
2. Missing important protections
3. Ambiguous language that could be problematic
4. Compliance with Indian laws
5. Rights and obligations of parties
6. Timeline and deadlines
7. Financial implications
8. Termination clauses
9. Dispute resolution mechanisms

Be specific and cite relevant Indian laws (IPC, CrPC, Contract Act, etc.) where applicable.`;

export async function POST(req: NextRequest) {
  try {
    const { text, fileName } = await req.json();

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Document text is too short. Please provide a complete document.' },
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

    const prompt = `${ANALYSIS_PROMPT}

Document to analyze:
Filename: ${fileName}

Content:
${text}

Provide your analysis in valid JSON format only, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let analysisText = response.text();

    // Clean up the response - remove markdown code blocks if present
    analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const analysis = JSON.parse(analysisText);
      
      // Validate the structure
      if (!analysis.documentType || !analysis.summary || !analysis.keyPoints || 
          !analysis.risks || !analysis.recommendations || !analysis.analysis) {
        throw new Error('Invalid analysis structure');
      }

      return NextResponse.json(analysis);
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisText);
      
      // Fallback: Return a structured response based on the text
      return NextResponse.json({
        documentType: 'Legal Document',
        summary: 'The document has been analyzed. Please see the detailed analysis below.',
        keyPoints: ['Document analysis completed'],
        risks: ['Unable to extract specific risks in structured format'],
        recommendations: ['Consult with a legal professional for detailed review'],
        analysis: analysisText
      });
    }
  } catch (error: any) {
    console.error('Error in document analysis:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze document' },
      { status: 500 }
    );
  }
}
