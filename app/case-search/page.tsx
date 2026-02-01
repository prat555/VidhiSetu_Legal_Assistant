'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, ExternalLink, Scale, Calendar, Bookmark, Loader2, FileText, CheckCircle, Globe, Shield } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Footer } from '../components/Footer';

interface CaseResult {
  title: string;
  citation: string;
  court: string;
  date: string;
  summary: string;
  relevance: string;
  link: string;
  source?: 'verified' | 'indiankanoon' | 'fallback';
}

interface SearchResponse {
  cases: CaseResult[];
  sources?: {
    verified: number;
    indianKanoon: number;
  };
  searchLinks?: {
    indianKanoon: string;
    eCourts: string;
  };
}

const exampleSearches = [
  'Right to privacy',
  'Section 498A IPC',
  'Consumer protection',
  'Article 21',
  'Bail guidelines',
  'Sexual harassment workplace',
];

function CaseSearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CaseResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [sources, setSources] = useState<{ verified: number; indianKanoon: number } | null>(null);
  const [searchLinks, setSearchLinks] = useState<{ indianKanoon: string; eCourts: string } | null>(null);

  // Reset state when navigating back to this page via header
  useEffect(() => {
    setQuery('');
    setResults([]);
    setSearched(false);
    setSources(null);
    setSearchLinks(null);
  }, [searchParams]);

  const searchCases = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) {
      alert('Please enter a search query');
      return;
    }

    setQuery(q);
    setLoading(true);
    setSearched(true);
    try {
      const response = await fetch('/api/search-cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (!response.ok) throw new Error('Search failed');

      const data: SearchResponse = await response.json();
      setResults(data.cases || []);
      setSources(data.sources || null);
      setSearchLinks(data.searchLinks || null);
    } catch (error) {
      console.error('Error searching cases:', error);
      // Don't show alert, just set empty results
      setResults([]);
      setSources(null);
      setSearchLinks(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') searchCases();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <PageHeader
        title="Case Law Search"
        description="Search Indian Supreme Court and High Court judgments from verified sources and Indian Kanoon."
        icon={<Search className="w-6 h-6 text-emerald-600" />}
        accentColor="emerald"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Data Sources Info */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-emerald-100">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">100+ Verified Landmark Cases</p>
              <p className="text-xs text-neutral-500">Curated with real citations</p>
            </div>
          </div>
          <a 
            href="https://indiankanoon.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Globe className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900">Indian Kanoon</p>
              <p className="text-xs text-neutral-500">Search millions of cases on indiankanoon.org</p>
            </div>
            <ExternalLink className="w-4 h-4 text-blue-500" />
          </a>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search cases, laws, or legal topics..."
                className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            <button
              onClick={() => searchCases()}
              disabled={loading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-300 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </div>

          {/* Example Searches */}
          {!searched && (
            <div className="mt-5">
              <p className="text-xs font-medium text-neutral-500 mb-3">TRY SEARCHING FOR:</p>
              <div className="flex flex-wrap gap-2">
                {exampleSearches.map((example) => (
                  <button
                    key={example}
                    onClick={() => searchCases(example)}
                    className="px-3 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm text-neutral-600">
                Found <span className="text-neutral-900 font-medium">{results.length}</span> verified landmark {results.length === 1 ? 'case' : 'cases'}
              </p>
              {searchLinks && (
                <a
                  href={searchLinks.indianKanoon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  View all on Indian Kanoon
                </a>
              )}
            </div>

            {results.map((result, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl border p-5 transition-all hover:shadow-md ${
                  result.source === 'verified' 
                    ? 'border-emerald-200' 
                    : 'border-neutral-200'
                }`}
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      result.source === 'verified'
                        ? 'bg-emerald-100'
                        : 'bg-blue-100'
                    }`}>
                      {result.source === 'verified' ? (
                        <Shield className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Scale className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      {result.source && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium mb-1.5 ${
                          result.source === 'verified'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {result.source === 'verified' ? (
                            <>
                              <CheckCircle className="w-2.5 h-2.5" />
                              Verified Landmark Case
                            </>
                          ) : (
                            <>
                              <Globe className="w-2.5 h-2.5" />
                              Indian Kanoon
                            </>
                          )}
                        </span>
                      )}
                      <h3 className="text-base font-semibold text-neutral-900 leading-snug">
                        {result.title}
                      </h3>
                    </div>
                  </div>
                  {result.link && (
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-2 rounded-lg bg-neutral-100 hover:bg-emerald-100 text-neutral-500 hover:text-emerald-600 transition-all"
                      title="View on Indian Kanoon"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-2 mb-4 ml-11">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg">
                    <FileText className="w-3 h-3" />
                    {result.citation}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg">
                    <Scale className="w-3 h-3" />
                    {result.court}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg">
                    <Calendar className="w-3 h-3" />
                    {result.date}
                  </span>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed mb-4 ml-11">
                  {result.summary}
                </p>

                <div className="pt-4 border-t border-neutral-100 ml-11">
                  <p className="text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                      <Bookmark className="w-3 h-3" />
                      Relevance:
                    </span>{' '}
                    <span className="text-neutral-600">{result.relevance}</span>
                  </p>
                </div>
              </div>
            ))}

            {/* Search on Indian Kanoon CTA */}
            {searchLinks && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 mt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-neutral-900">Need more results?</h3>
                      <p className="text-sm text-neutral-600">Search millions of cases on Indian Kanoon</p>
                    </div>
                  </div>
                  <a
                    href={searchLinks.indianKanoon}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
                  >
                    <span>Search on Indian Kanoon</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {searched && !loading && results.length === 0 && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 rounded-2xl mb-4">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Cases Found in Our Database</h3>
            <p className="text-neutral-500 text-sm max-w-md mx-auto mb-6">
              We couldn't find any matching cases in our verified database. Try searching on Indian Kanoon for more results.
            </p>
            {searchLinks && (
              <a
                href={searchLinks.indianKanoon}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all mb-6"
              >
                <Globe className="w-4 h-4" />
                <span>Search on Indian Kanoon</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              {exampleSearches.slice(0, 3).map((example) => (
                <button
                  key={example}
                  onClick={() => searchCases(example)}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-all"
                >
                  Try: {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function CaseSearch() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
      <CaseSearchContent />
    </Suspense>
  );
}
