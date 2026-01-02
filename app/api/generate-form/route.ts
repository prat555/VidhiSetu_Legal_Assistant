import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const FORM_PROMPTS: Record<string, string> = {
  'fir': `Generate a properly formatted FIR (First Information Report) for Indian police stations. Use formal, legal language and follow the standard FIR format used in India. Include all sections like complainant details, incident details, and legal provisions under IPC/BNS if applicable.`,
  
  'legal-notice': `Generate a formal legal notice following Indian legal standards. Use professional legal language, cite relevant laws, and include standard clauses like demands, timeline for response, and consequences of non-compliance. Format it properly with FROM, TO, SUBJECT, and proper sections.`,
  
  'rti': `Generate an RTI (Right to Information) application as per the RTI Act, 2005. Follow the standard format with clear information request, applicant details, and proper legal references to the RTI Act.`,
  
  'bail-application': `Generate a bail application for Indian courts. Use proper legal language, cite relevant sections of CrPC (especially Section 437, 438, 439), include grounds for bail, and follow court submission format.`,
  
  'consumer-complaint': `Generate a consumer complaint for District/State/National Consumer Commission as per Consumer Protection Act, 2019. Use proper format with complainant details, opposite party details, facts, deficiency, and relief sought.`
};

export async function POST(req: NextRequest) {
  try {
    const { formType, formName, data } = await req.json();

    if (!formType || !data) {
      return NextResponse.json(
        { error: 'Form type and data are required' },
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

    const basePrompt = FORM_PROMPTS[formType] || `Generate a professional legal document for ${formName}.`;

    // Format the data for the prompt
    const formattedData = Object.entries(data)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const prompt = `${basePrompt}

User's Information:
${formattedData}

Generate a complete, properly formatted legal document. Use professional language, include all necessary sections, make it ready to use. Add proper spacing, sections, and formatting. Include today's date where needed: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}.

Provide ONLY the document text, no explanations or additional commentary.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const document = response.text();

    return NextResponse.json({ document });
  } catch (error: any) {
    console.error('Error generating form:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate document' },
      { status: 500 }
    );
  }
}
