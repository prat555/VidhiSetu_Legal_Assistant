'use client';

import { useState } from 'react';
import { FileText, Upload, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface AnalysisResult {
  documentType: string;
  summary: string;
  keyPoints: string[];
  risks: string[];
  recommendations: string[];
  analysis: string;
}

export default function DocumentAnalyzer() {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'text/plain'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or text file');
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if ((activeTab === 'upload' && !file) || (activeTab === 'paste' && !text.trim())) {
      setError('Please provide a document or text to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      let documentText = '';
      
      if (activeTab === 'paste') {
        documentText = text;
      } else if (file) {
        documentText = await file.text();
      }

      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: documentText,
          fileName: file?.name || 'Pasted Text'
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const result = await response.json();
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 via-purple-950/20 to-black">
      <PageHeader
        title="Document Analyzer"
        description="Upload legal documents for AI-powered analysis and risk assessment"
        icon={<FileText className="w-7 h-7 text-purple-600 dark:text-purple-400" />}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Input Section */}
          {!analysis && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-6 shadow-xl hover:shadow-2xl transition-shadow">
              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'upload'
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Upload File
                </button>
                <button
                  onClick={() => setActiveTab('paste')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'paste'
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Paste Text
                </button>
              </div>

              {activeTab === 'upload' ? (
                <div
                  className="border-2 border-dashed border-zinc-600 rounded-xl p-12 text-center hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
                  <p className="text-white font-medium mb-1">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                    PDF or TXT file up to 10MB
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.txt"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your legal document text here..."
                  className="w-full h-64 p-4 border border-white/10 rounded-xl bg-zinc-900 text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="mt-6 w-full px-6 py-4 bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02]"
              >
                {loading ? 'Analyzing...' : 'Analyze Document'}
              </button>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-4">
              {/* Header */}
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <h2 className="text-xl font-bold text-white">Analysis Complete</h2>
                </div>
                <p className="text-sm text-zinc-400">
                  <strong>Document Type:</strong> {analysis.documentType}
                </p>
              </div>

              {/* Summary */}
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Summary
                </h3>
                <p className="text-zinc-300">{analysis.summary}</p>
              </div>

              {/* Key Points */}
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Key Points</h3>
                <ul className="space-y-2">
                  {analysis.keyPoints.map((point, index) => (
                    <li key={index} className="flex gap-2 text-zinc-300">
                      <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  Potential Risks
                </h3>
                <ul className="space-y-2">
                  {analysis.risks.map((risk, index) => (
                    <li key={index} className="flex gap-2 text-zinc-300">
                      <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex gap-2 text-zinc-300">
                      <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setAnalysis(null);
                  setFile(null);
                  setText('');
                }}
                className="w-full px-6 py-3 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-xl font-medium transition-colors"
              >
                Analyze Another Document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
