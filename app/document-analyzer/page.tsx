'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FileCheck, UploadCloud, Clipboard, FileText, Loader2, CheckCircle2, AlertTriangle, Lightbulb, ListChecks, History, Lock, X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { userDocumentStorage } from '../lib/userStorage';

type DocAnalysis = {
  category: string;
  documentType: string;
  confidence: number;
  rationale: string;
  summary: string;
  keyPoints: string[];
  risks: string[];
  recommendations: string[];
  analysis: string;
  indianLawRefs?: string[];
};

function DocumentAnalyzerContent() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'paste' | 'upload'>('upload');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DocAnalysis | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState<{ ok: boolean; baseUrl: string; models?: string[]; error?: string } | null>(null);

  // Reset state when navigating back to this page via header
  useEffect(() => {
    setMode('upload');
    setText('');
    setFile(null);
    setError(null);
    setResult(null);
  }, [searchParams]);

  // Ollama check disabled - using Gemini by default
  // useEffect(() => {
  //   fetch('/api/ollama/health', { cache: 'no-store' })
  //     .then(r => r.json())
  //     .then(setOllamaStatus)
  //     .catch(() => setOllamaStatus({ ok: false, baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434', error: 'Failed to check Ollama' } as any));
  // }, []);

  const canAnalyze = useMemo(() => {
    if (mode === 'paste') return text.trim().length >= 50;
    return !!file;
  }, [mode, text, file]);

  async function analyze() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let res: Response;

      if (mode === 'paste') {
        res = await fetch('/api/analyze-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, fileName: 'Pasted text' }),
        });
      } else {
        const fd = new FormData();
        if (file) fd.append('file', file);
        fd.append('fileName', file?.name ?? 'Uploaded file');
        res = await fetch('/api/analyze-document', {
          method: 'POST',
          body: fd,
        });
      }

      const data = await res.json().catch(async () => {
        const t = await res.text().catch(()=> '');
        return { ok: false, error: `Non-JSON response: ${t.slice(0,300)}` };
      });

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to analyze document');
      }

      setResult(data?.result ?? null);

      // Save to Firebase
      if (user && data?.result) {
        const analysisData: {
          id: string;
          title: string;
          fileName?: string;
          result: DocAnalysis;
          createdAt: number;
        } = {
          id: crypto.randomUUID(),
          title: data.result.documentType ? `(${data.result.documentType}) Document Analysis` : 'Document Analysis',
          result: data.result,
          createdAt: Date.now(),
        };
        
        // Only add fileName if it exists (upload mode)
        if (mode === 'upload' && file?.name) {
          analysisData.fileName = file.name;
        }
        
        try {
          await userDocumentStorage.saveAnalysis(user.uid, analysisData);
        } catch (saveError) {
          console.error('Error saving to history:', saveError);
        }
      }
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <PageHeader
          title="Document Analyzer"
          description="Upload legal documents or paste text to get AI-powered analysis with risk assessment and recommendations."
          icon={<FileCheck className="w-6 h-6 text-violet-600" />}
          accentColor="purple"
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
        </div>
      </div>
    );
  }

  // Require login
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <PageHeader
          title="Document Analyzer"
          description="Upload legal documents or paste text to get AI-powered analysis with risk assessment and recommendations."
          icon={<FileCheck className="w-6 h-6 text-violet-600" />}
          accentColor="purple"
        />
        
        <div className="flex-grow">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-2xl mb-5">
                <Lock className="w-8 h-8 text-violet-600" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mb-3">Sign In Required</h2>
              <p className="text-neutral-500 mb-6">
                Please sign in to use the Document Analyzer. Your analysis history will be saved to your account.
              </p>
              <button
                onClick={signInWithGoogle}
                className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign In with Google
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <PageHeader
        title="Document Analyzer"
        description="Upload legal documents or paste text to get AI-powered analysis with risk assessment and recommendations."
        icon={<FileCheck className="w-6 h-6 text-violet-600" />}
        accentColor="purple"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Show input area only when no results */}
        {!result && (
          <>
            {/* Mode Selector with View History Button */}
            <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
              <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl w-fit">
                <button
                  onClick={() => setMode('upload')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    mode === 'upload'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload File
                </button>
                <button
                  onClick={() => setMode('paste')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    mode === 'paste'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Clipboard className="w-4 h-4" />
                  Paste Text
                </button>
              </div>
              
              <Link 
                href="/document-analyzer/history" 
                className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <History className="w-4 h-4" />
                View History
              </Link>
            </div>

            {/* Input Area */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              {mode === 'paste' ? (
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-3">Document Text</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your legal document, contract, or agreement here (minimum 50 characters)..."
                    className="w-full min-h-[200px] rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 p-4 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-neutral-400"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(212 212 212) transparent' }}
                  />
                  <p className="mt-2 text-xs text-neutral-500">
                    Tip: Include full clauses and headings for best results. Min 50 characters required.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-3">Upload Document</label>
                  {file ? (
                    <div className="border-2 border-violet-300 bg-violet-50 rounded-xl p-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-violet-100">
                          <FileText className="w-6 h-6 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-neutral-900 font-medium">{file.name}</p>
                          <p className="text-xs text-neutral-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="p-2 rounded-lg hover:bg-violet-100 text-neutral-500 hover:text-red-600 transition-colors"
                        title="Remove file"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                        isDragging
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-neutral-200 hover:border-violet-300 bg-neutral-50'
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(true);
                      }}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(false);
                        const droppedFile = e.dataTransfer.files?.[0];
                        if (droppedFile) {
                          const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
                          const validExtensions = ['.pdf', '.docx', '.txt'];
                          const hasValidExt = validExtensions.some(ext => droppedFile.name.toLowerCase().endsWith(ext));
                          if (validTypes.includes(droppedFile.type) || hasValidExt) {
                            setFile(droppedFile);
                          } else {
                            setError('Please upload a PDF, DOCX, or TXT file');
                          }
                        }
                      }}
                    >
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <UploadCloud className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-violet-500' : 'text-neutral-400'}`} />
                        <p className="text-neutral-700 font-medium mb-1">
                          {isDragging ? 'Drop your file here' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-neutral-500">PDF, DOCX, or TXT (Max 10MB)</p>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={analyze}
                disabled={!canAnalyze || loading}
                className="mt-6 w-full sm:w-auto px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-medium inline-flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    Analyze Document
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Analysis Failed</p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* New Analysis Button */}
            <button
              onClick={() => {
                setResult(null);
                setText('');
                setFile(null);
                setError(null);
              }}
              className="px-4 py-2 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-700 text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              Analyze Another Document
            </button>

            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-violet-200 p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 mb-1">Analysis Complete</h2>
                  <p className="text-neutral-600 text-sm">
                    Document Type: <span className="text-neutral-900 font-medium">{result.documentType}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-neutral-100 text-xs text-neutral-700 font-medium">
                    {result.category || "General"}
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-violet-100 text-xs text-violet-700 font-medium">
                    {Math.round((result.confidence ?? 0.35) * 100)}% Confidence
                  </span>
                </div>
              </div>
              {result.rationale && (
                <p className="mt-3 text-sm text-neutral-600">
                  <span className="text-neutral-500">Rationale:</span> {result.rationale}
                </p>
              )}
            </div>

            {/* Analysis Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Summary */}
              <div className="bg-white rounded-xl border border-neutral-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900">Summary</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">{result.summary}</p>
              </div>

              {/* Key Points */}
              <div className="bg-white rounded-xl border border-neutral-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-emerald-100">
                    <ListChecks className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900">Key Points</h3>
                </div>
                <ul className="space-y-2">
                  {result.keyPoints?.map((point, i) => (
                    <li key={i} className="text-sm text-neutral-600 flex gap-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="bg-white rounded-xl border border-red-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-red-100">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900">Risks & Red Flags</h3>
                </div>
                <ul className="space-y-2">
                  {result.risks?.map((risk, i) => (
                    <li key={i} className="text-sm text-neutral-600 flex gap-2">
                      <span className="text-red-600 mt-1">!</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl border border-amber-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-amber-100">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900">Recommendations</h3>
                </div>
                <ul className="space-y-2">
                  {result.recommendations?.map((rec, i) => (
                    <li key={i} className="text-sm text-neutral-600 flex gap-2">
                      <span className="text-amber-600 mt-1">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Analysis Snapshot */}
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-violet-100">
                  <FileCheck className="w-4 h-4 text-violet-600" />
                </div>
                <h3 className="font-semibold text-neutral-900">Analysis Snapshot</h3>
              </div>
              <div className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                {result.analysis}
              </div>
            </div>

            {/* Indian Law References */}
            {result.indianLawRefs && result.indianLawRefs.length > 0 && (
              <div className="bg-white rounded-xl border border-indigo-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-indigo-100">
                    <FileCheck className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900">Indian Law References</h3>
                </div>
                <ul className="space-y-2">
                  {result.indianLawRefs.slice(0, 10).map((ref, i) => (
                    <li key={i} className="text-sm text-neutral-600 flex gap-2">
                      <span className="text-indigo-600 mt-1">§</span>
                      <span>{ref}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-neutral-500">
                  Note: References are indicative. Verify with an advocate or official sources.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function DocumentAnalyzerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
      <DocumentAnalyzerContent />
    </Suspense>
  );
}
