'use client';

import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

type FormType = 'fir' | 'legal_notice' | 'rti' | 'bail' | 'consumer_complaint';

export default function LegalForms() {
  const [selectedForm, setSelectedForm] = useState<FormType>('fir');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [generatedForm, setGeneratedForm] = useState<string | null>(null);

  const forms = [
    { id: 'fir', name: 'FIR (First Information Report)', icon: '🚨' },
    { id: 'legal_notice', name: 'Legal Notice', icon: '⚖️' },
    { id: 'rti', name: 'RTI Application', icon: '📄' },
    { id: 'bail', name: 'Bail Application', icon: '🔓' },
    { id: 'consumer_complaint', name: 'Consumer Complaint', icon: '🛡️' },
  ];

  const formFields: Record<FormType, { label: string; key: string; type: string; placeholder: string }[]> = {
    fir: [
      { label: 'Police Station', key: 'station', type: 'text', placeholder: 'Enter police station name' },
      { label: 'Complainant Name', key: 'name', type: 'text', placeholder: 'Your full name' },
      { label: 'Address', key: 'address', type: 'textarea', placeholder: 'Your complete address' },
      { label: 'Incident Date', key: 'date', type: 'date', placeholder: '' },
      { label: 'Incident Details', key: 'details', type: 'textarea', placeholder: 'Describe the incident in detail' },
    ],
    legal_notice: [
      { label: 'Your Name', key: 'sender', type: 'text', placeholder: 'Your full name' },
      { label: 'Recipient Name', key: 'recipient', type: 'text', placeholder: 'Recipient full name' },
      { label: 'Recipient Address', key: 'address', type: 'textarea', placeholder: 'Complete address' },
      { label: 'Subject', key: 'subject', type: 'text', placeholder: 'Subject of notice' },
      { label: 'Details', key: 'details', type: 'textarea', placeholder: 'Describe the matter in detail' },
      { label: 'Demand', key: 'demand', type: 'text', placeholder: 'What action do you require?' },
    ],
    rti: [
      { label: 'Department Name', key: 'department', type: 'text', placeholder: 'Government department' },
      { label: 'Your Name', key: 'name', type: 'text', placeholder: 'Your full name' },
      { label: 'Address', key: 'address', type: 'textarea', placeholder: 'Your complete address' },
      { label: 'Information Sought', key: 'information', type: 'textarea', placeholder: 'What information do you need?' },
    ],
    bail: [
      { label: 'Court Name', key: 'court', type: 'text', placeholder: 'Name of the court' },
      { label: 'Accused Name', key: 'accused', type: 'text', placeholder: 'Full name of accused' },
      { label: 'Case Number', key: 'caseNumber', type: 'text', placeholder: 'Case/FIR number' },
      { label: 'Offense', key: 'offense', type: 'text', placeholder: 'Nature of offense' },
      { label: 'Grounds for Bail', key: 'grounds', type: 'textarea', placeholder: 'Reasons for granting bail' },
    ],
    consumer_complaint: [
      { label: 'Your Name', key: 'name', type: 'text', placeholder: 'Your full name' },
      { label: 'Address', key: 'address', type: 'textarea', placeholder: 'Your complete address' },
      { label: 'Seller/Service Provider', key: 'seller', type: 'text', placeholder: 'Name of company/seller' },
      { label: 'Product/Service', key: 'product', type: 'text', placeholder: 'Product or service name' },
      { label: 'Issue Details', key: 'issue', type: 'textarea', placeholder: 'Describe the problem' },
      { label: 'Amount Paid', key: 'amount', type: 'text', placeholder: 'Amount in ₹' },
    ],
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const generateForm = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: selectedForm,
          data: formData,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate form');

      const result = await response.json();
      setGeneratedForm(result.formContent);
    } catch (error) {
      console.error('Error generating form:', error);
      alert('Failed to generate form. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const downloadForm = () => {
    if (!generatedForm) return;

    const blob = new Blob([generatedForm], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedForm}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 via-amber-950/20 to-black">
      <PageHeader
        title="Legal Forms Generator"
        description="Generate legal documents instantly with AI assistance"
        icon={<FileText className="w-7 h-7 text-amber-600 dark:text-amber-400" />}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Form Type Selector */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {forms.map((form) => (
              <button
                key={form.id}
                onClick={() => {
                  setSelectedForm(form.id as FormType);
                  setFormData({});
                  setGeneratedForm(null);
                }}
                className={`p-4 rounded-xl border transition-all text-left ${
                  selectedForm === form.id
                    ? 'bg-zinc-800/50 backdrop-blur-sm border-amber-500 dark:border-amber-600 shadow-md'
                    : 'bg-zinc-800/50 backdrop-blur-sm border-white/10 hover:border-zinc-500'
                }`}
              >
                <div className="text-2xl mb-2">{form.icon}</div>
                <div className="text-sm font-medium text-white">{form.name}</div>
              </button>
            ))}
          </div>

          {!generatedForm ? (
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                {forms.find(f => f.id === selectedForm)?.name}
              </h2>

              <div className="space-y-4">
                {formFields[selectedForm].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full px-4 py-2 border border-white/10 rounded-lg bg-zinc-900 text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2 border border-white/10 rounded-lg bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={generateForm}
                disabled={generating}
                className="mt-6 w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? 'Generating...' : 'Generate Form'}
              </button>
            </div>
          ) : (
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Generated Form</h2>
                <button
                  onClick={downloadForm}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>

              <div className="bg-zinc-900 border border-white/10 rounded-lg p-6">
                <pre className="whitespace-pre-wrap text-sm text-zinc-300 font-mono">
                  {generatedForm}
                </pre>
              </div>

              <button
                onClick={() => {
                  setGeneratedForm(null);
                  setFormData({});
                }}
                className="mt-6 w-full px-6 py-3 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-xl font-medium transition-colors"
              >
                Generate Another Form
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
