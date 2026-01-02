'use client';

import { useState } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface CaseResult {
  title: string;
  citation: string;
  court: string;
  date: string;
  summary: string;
  relevance: string;
  link: string;
}

export default function CaseSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CaseResult[]>([]);

  const searchCases = async () => {
    if (!query.trim()) {
      alert('Please enter a search query');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/search-cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setResults(data.cases || []);
    } catch (error) {
      console.error('Error searching cases:', error);
      alert('Failed to search cases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') searchCases();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 via-blue-950/20 to-black">
      <PageHeader
        title="Case Law Search"
        description="Search Indian court judgments and legal precedents"
        icon={<Search className="w-7 h-7 text-blue-600 dark:text-blue-400" />}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Search Bar */}
          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8">
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for cases, laws, or legal topics..."
                className="flex-1 px-4 py-3 border border-white/10 rounded-lg bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button
                onClick={searchCases}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              <strong>Examples:</strong> "Right to privacy Supreme Court", "Section 498A IPC judgments", "Consumer protection act cases"
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <div className="text-sm text-zinc-400">
                Found {results.length} relevant {results.length === 1 ? 'case' : 'cases'}
              </div>

              {results.map((result, index) => (
                <div
                  key={index}
                  className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-zinc-500 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      {result.title}
                    </h3>
                    {result.link && (
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 mb-3">
                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-full">
                      {result.citation}
                    </span>
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                      {result.court}
                    </span>
                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-full">
                      {result.date}
                    </span>
                  </div>

                  <p className="text-zinc-300 text-sm mb-3">
                    {result.summary}
                  </p>

                  <div className="pt-3 border-t border-white/10">
                    <p className="text-xs text-zinc-400">
                      <strong>Relevance:</strong> {result.relevance}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && query && (
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center">
              <Search className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">
                No cases found. Try different keywords or phrases.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
