import { NextRequest, NextResponse } from 'next/server';
import { searchCases as searchLocalCases, getIndianKanoonUrl } from '@/app/data/cases/indianCases';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query is too short' },
        { status: 400 }
      );
    }

    const searchQuery = query.trim();

    // Search local verified cases
    const localResults = searchLocalCases(searchQuery);

    // Format local results
    const formattedLocalCases = localResults.map(caseItem => ({
      title: caseItem.title,
      citation: caseItem.citation,
      court: caseItem.court,
      date: caseItem.date,
      summary: caseItem.summary,
      relevance: `Verified • ${caseItem.category}`,
      link: getIndianKanoonUrl(caseItem),
      source: 'verified'
    }));

    // Indian Kanoon search link for more results
    const indianKanoonSearchUrl = `https://indiankanoon.org/search/?formInput=${encodeURIComponent(searchQuery)}`;

    return NextResponse.json({ 
      cases: formattedLocalCases.slice(0, 15),
      sources: {
        verified: formattedLocalCases.length
      },
      searchLinks: {
        indianKanoon: indianKanoonSearchUrl,
        eCourts: `https://services.ecourts.gov.in/ecourtindia_v6/?p=casestatus/index&app_token=`
      }
    });

  } catch (error: any) {
    console.error('Error searching cases:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search cases' },
      { status: 500 }
    );
  }
}
