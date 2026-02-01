import { NextRequest, NextResponse } from 'next/server';
import { generateLegalForm } from '@/app/data/forms/legalFormTemplates';

export async function POST(req: NextRequest) {
  try {
    const { formType, data } = await req.json();

    if (!formType || !data) {
      return NextResponse.json(
        { error: 'Form type and data are required' },
        { status: 400 }
      );
    }

    // Generate using local templates - no API key needed!
    const formContent = generateLegalForm(formType, data);
    
    return NextResponse.json({ formContent });
  } catch (error: any) {
    console.error('Error generating form:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate document' },
      { status: 500 }
    );
  }
}
