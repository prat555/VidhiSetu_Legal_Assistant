'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Clock, FileText, Trash2, ArrowRight, Loader2, Lock } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { Footer } from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { userDocumentStorage, DocumentAnalysis } from '../../lib/userStorage';

export default function DocumentAnalyzerHistoryPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [items, setItems] = useState<DocumentAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const analyses = await userDocumentStorage.getAllAnalyses(user.uid);
        setItems(analyses);
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadHistory();
  }, [user]);

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => b.createdAt - a.createdAt);
  }, [items]);

  async function clearAll() {
    if (!user || !confirm('Are you sure you want to delete all history?')) return;
    
    try {
      for (const item of items) {
        await userDocumentStorage.deleteAnalysis(user.uid, item.id);
      }
      setItems([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }

  async function removeOne(id: string) {
    if (!user) return;
    
    try {
      await userDocumentStorage.deleteAnalysis(user.uid, id);
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <PageHeader
          title="Analysis History"
          description="Your past document analyses"
          icon={<Clock className="w-6 h-6 text-purple-600" />}
          accentColor="purple"
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  // Show login required screen
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <PageHeader
          title="Analysis History"
          description="Your past document analyses"
          icon={<Clock className="w-6 h-6 text-purple-600" />}
          accentColor="purple"
        />
        <div className="max-w-md mx-auto px-4 py-20">
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Sign In Required</h2>
            <p className="text-neutral-500 mb-6">
              Sign in to view your document analysis history.
            </p>
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <PageHeader
        title="Analysis History"
        description="Your past document analyses"
        icon={<Clock className="w-6 h-6 text-purple-600" />}
        accentColor="purple"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-neutral-500">
            {sorted.length} item{sorted.length === 1 ? '' : 's'}
          </div>
          <div className="flex gap-2">
            <Link 
              href="/document-analyzer" 
              className="px-4 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-sm font-medium transition-colors"
            >
              Back to Analyzer
            </Link>
            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              disabled={sorted.length === 0}
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No History Yet</h3>
            <p className="text-neutral-500 mb-4">
              Analyze a document to see it here.
            </p>
            <Link
              href="/document-analyzer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
            >
              Analyze a Document
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {sorted.map((item) => (
              <details
                key={item.id}
                className="group rounded-2xl border border-neutral-200 bg-white overflow-hidden"
              >
                <summary className="cursor-pointer px-5 py-4 flex items-center justify-between gap-3 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-100">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-neutral-900 font-semibold">{item.title}</div>
                      <div className="text-xs text-neutral-500 mt-1">
                        {new Date(item.createdAt).toLocaleString()} {item.fileName ? `• ${item.fileName}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.preventDefault(); removeOne(item.id); }}
                      className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-neutral-600 text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-open:rotate-90 transition-transform" />
                  </div>
                </summary>

                <div className="px-5 pb-5 border-t border-neutral-100">
                  <div className="mt-4 text-sm text-neutral-700">
                    <span className="text-neutral-500">Document type:</span> {item.result?.documentType || 'Unknown'}
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="font-semibold text-neutral-900">Summary</div>
                      <div className="mt-2 text-sm text-neutral-600">{item.result?.summary || 'No summary available'}</div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="font-semibold text-neutral-900">Key Points</div>
                      <ul className="mt-2 list-disc pl-5 text-sm text-neutral-600 space-y-1">
                        {item.result?.keyPoints?.map((x: string, i: number) => <li key={i}>{x}</li>) || <li>No key points</li>}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="font-semibold text-neutral-900">Risks</div>
                      <ul className="mt-2 list-disc pl-5 text-sm text-neutral-600 space-y-1">
                        {item.result?.risks?.map((x: string, i: number) => <li key={i}>{x}</li>) || <li>No risks identified</li>}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="font-semibold text-neutral-900">Recommendations</div>
                      <ul className="mt-2 list-disc pl-5 text-sm text-neutral-600 space-y-1">
                        {item.result?.recommendations?.map((x: string, i: number) => <li key={i}>{x}</li>) || <li>No recommendations</li>}
                      </ul>
                    </div>
                  </div>

                  {item.result?.analysis && (
                    <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="font-semibold text-neutral-900">Detailed Analysis</div>
                      <div className="mt-2 whitespace-pre-wrap text-sm text-neutral-600">{item.result.analysis}</div>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
      <div className="flex-grow"></div>
      <Footer />
    </div>
  );
}
