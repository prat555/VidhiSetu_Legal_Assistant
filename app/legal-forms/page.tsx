'use client';

import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  FileText, Download, Loader2, ChevronRight, ChevronLeft, Eye, 
  Shield, Briefcase, Home, Receipt, Scale, Users, Building, FileSignature,
  HelpCircle, Clock, BookOpen, Save, Trash2, Copy, Check, Printer,
  AlertTriangle, X, Info, Lock
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Footer } from '../components/Footer';
import { FormTemplate, FormType, FormData as FormDataType, FormStep, SavedForm } from './types';
import { formTemplates, getFormTemplate } from './templates';
import { FormInput, ProgressIndicator, FAQAccordion, DisclaimerBanner, SaveProgressBanner } from './components';
import { generateDocumentContent, generatePDF } from './pdfGenerator';
import { useAuth } from '../context/AuthContext';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Shield, Briefcase, Home, Receipt, Scale, Users, Building, FileText
};

// Category colors - light theme
const categoryColors: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  business: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', iconBg: 'bg-amber-100' },
  personal: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', iconBg: 'bg-amber-100' },
  employment: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', iconBg: 'bg-amber-100' },
};

// Storage keys
const STORAGE_KEY = 'vidhisetu_form_progress';
const ACTIVE_FORM_KEY = 'vidhisetu_active_form';

function LegalFormsGeneratorContent() {
  const { user, loading, signInWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  
  // State - ALL hooks must be declared before any conditional returns
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormDataType>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showFAQ, setShowFAQ] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);
  
  // Ref for scrolling to form container
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Define saveProgress callback first so it can be used in useEffect
  const saveProgress = useCallback(() => {
    if (!selectedTemplate) return;

    const saved: SavedForm = {
      id: `${selectedTemplate.id}_${Date.now()}`,
      formType: selectedTemplate.id,
      formData,
      currentStep,
      lastModified: new Date().toISOString(),
      completed: false
    };

    const existingIndex = savedForms.findIndex(f => f.formType === selectedTemplate.id && !f.completed);
    const newSavedForms = [...savedForms];
    
    if (existingIndex >= 0) {
      newSavedForms[existingIndex] = saved;
    } else {
      newSavedForms.push(saved);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSavedForms));
    localStorage.setItem(ACTIVE_FORM_KEY, selectedTemplate.id);
    setSavedForms(newSavedForms);
    setLastSaved('just now');
  }, [selectedTemplate, formData, currentStep, savedForms]);

  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let parsed = null;
    if (saved) {
      try {
        parsed = JSON.parse(saved);
        setSavedForms(parsed);
      } catch (e) {
        console.error('Failed to load saved forms:', e);
      }
    }

    // Restore active form on refresh
    const activeFormId = localStorage.getItem(ACTIVE_FORM_KEY);
    if (activeFormId && parsed) {
      const template = getFormTemplate(activeFormId as FormType);
      if (template) {
        setSelectedTemplate(template);
        // Load saved progress for this form
        const savedProgress = parsed.find((f: SavedForm) => f.formType === activeFormId && !f.completed);
        if (savedProgress) {
          setFormData(savedProgress.formData);
          setCurrentStep(savedProgress.currentStep);
          setLastSaved(new Date(savedProgress.lastModified).toLocaleTimeString());
        }
      }
    }
  }, []);

  // Auto-save progress
  useEffect(() => {
    if (selectedTemplate && Object.keys(formData).length > 0) {
      const timer = setTimeout(() => {
        saveProgress();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formData, selectedTemplate, currentStep, saveProgress]);

  const clearProgress = useCallback(() => {
    if (!selectedTemplate) return;
    
    const newSavedForms = savedForms.filter(f => f.formType !== selectedTemplate.id || f.completed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSavedForms));
    setSavedForms(newSavedForms);
    setFormData({});
    setCurrentStep(0);
    setLastSaved(null);
  }, [selectedTemplate, savedForms]);

  const loadSavedProgress = useCallback((formType: FormType) => {
    const saved = savedForms.find(f => f.formType === formType && !f.completed);
    if (saved) {
      setFormData(saved.formData);
      setCurrentStep(saved.currentStep);
      setLastSaved(new Date(saved.lastModified).toLocaleTimeString());
    }
  }, [savedForms]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <PageHeader
          title="Legal Forms Generator"
          description="Important: These forms are templates for reference only. Please consult a qualified lawyer before using any legal document."
          icon={<FileSignature className="w-6 h-6 text-amber-600" />}
          accentColor="amber"
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        </div>
      </div>
    );
  }

  // Show login required screen
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <PageHeader
          title="Legal Forms Generator"
          description="Important: These forms are templates for reference only. Please consult a qualified lawyer before using any legal document."
          icon={<FileSignature className="w-6 h-6 text-amber-600" />}
          accentColor="amber"
        />
        <div className="flex-grow">
          <div className="max-w-md mx-auto px-4 py-20">
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Sign In Required</h2>
              <p className="text-neutral-500 mb-6">
                Sign in to create, save, and manage your legal documents. Your forms will be saved to your account.
              </p>
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-colors"
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
        </div>
        <Footer />
      </div>
    );
  }

  // Form navigation
  const selectTemplate = (template: FormTemplate) => {
    setSelectedTemplate(template);
    setCurrentStep(0);
    setFormData({});
    setGeneratedContent(null);
    setShowPreview(false);
    setErrors({});
    
    // Save active form to localStorage
    localStorage.setItem(ACTIVE_FORM_KEY, template.id);
    
    // Scroll to top when selecting a template
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Check for saved progress and auto-load it
    const saved = savedForms.find(f => f.formType === template.id && !f.completed);
    if (saved) {
      loadSavedProgress(template.id);
    }
  };

  const validateStep = (): boolean => {
    if (!selectedTemplate) return false;
    
    const step = selectedTemplate.steps[currentStep];
    const newErrors: Record<string, string> = {};

    step.fields.forEach(field => {
      // Check conditional visibility
      if (field.conditional) {
        const conditionValue = formData[field.conditional.field];
        if (conditionValue !== field.conditional.value) {
          return; // Skip validation for hidden fields
        }
      }

      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }

      if (field.type === 'email' && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.id] as string)) {
          newErrors[field.id] = 'Please enter a valid email address';
        }
      }

      if (field.validation) {
        const value = formData[field.id] as string;
        if (value) {
          if (field.validation.minLength && value.length < field.validation.minLength) {
            newErrors[field.id] = `Minimum ${field.validation.minLength} characters required`;
          }
          if (field.validation.maxLength && value.length > field.validation.maxLength) {
            newErrors[field.id] = `Maximum ${field.validation.maxLength} characters allowed`;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < (selectedTemplate?.steps.length || 0) - 1) {
        setCurrentStep(prev => prev + 1);
        setErrors({});
        setTimeout(() => {
          const element = formContainerRef.current;
          if (element) {
            const yOffset = -80; // Offset to show heading with space above
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 100);
      } else {
        generateDocument();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
      setTimeout(() => {
        const element = formContainerRef.current;
        if (element) {
          const yOffset = -80; // Offset to show heading with space above
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const goToStep = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
      setErrors({});
      setTimeout(() => {
        const element = formContainerRef.current;
        if (element) {
          const yOffset = -80; // Offset to show heading with space above
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const generateDocument = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const content = generateDocumentContent(selectedTemplate.id, formData);
      setGeneratedContent(content);
      setShowPreview(true);
      // Scroll to top after generating document
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Failed to generate document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => {
    if (!selectedTemplate || !generatedContent) return;
    
    const pdf = generatePDF({
      title: selectedTemplate.name,
      formType: selectedTemplate.id,
      formData,
      template: selectedTemplate
    });
    
    pdf.save(`${selectedTemplate.shortName}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const downloadText = () => {
    if (!generatedContent || !selectedTemplate) return;
    
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.shortName}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!generatedContent) return;
    
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const printDocument = () => {
    if (!generatedContent || !selectedTemplate) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${selectedTemplate.name}</title>
            <style>
              body { 
                font-family: 'Times New Roman', serif; 
                padding: 40px; 
                line-height: 1.6;
                max-width: 800px;
                margin: 0 auto;
              }
              pre { 
                white-space: pre-wrap; 
                font-family: 'Times New Roman', serif; 
                font-size: 12pt; 
              }
            </style>
          </head>
          <body>
            <pre>${generatedContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const resetForm = () => {
    // Clear active form from localStorage so refresh won't restore it
    localStorage.removeItem(ACTIVE_FORM_KEY);
    // Reset UI state to show form selector
    setSelectedTemplate(null);
    setCurrentStep(0);
    setFormData({});
    setErrors({});
    setGeneratedContent(null);
    setShowPreview(false);
    setLastSaved(null);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render form selector
  const renderFormSelector = () => (
    <div className="space-y-8">
      {/* Category Sections */}
      {['business', 'personal', 'employment'].map(category => {
        const categoryTemplates = formTemplates.filter(t => t.category === category);
        const colors = categoryColors[category];
        
        return (
          <div key={category}>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 capitalize flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${colors.iconBg}`} />
              {category} Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryTemplates.map(template => {
                const Icon = iconMap[template.icon] || FileText;
                const hasSavedProgress = savedForms.some(f => f.formType === template.id && !f.completed);
                
                return (
                  <button
                    key={template.id}
                    onClick={() => selectTemplate(template)}
                    className={`
                      group relative p-5 rounded-2xl border transition-all duration-300 text-left bg-white
                      hover:shadow-md ${colors.border} hover:border-amber-300 cursor-pointer
                    `}
                  >
                    {hasSavedProgress && (
                      <div className="absolute top-3 right-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                    )}
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors.iconBg}
                    `}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <h3 className="font-semibold text-neutral-900 mb-1 group-hover:text-amber-700">
                      {template.name}
                    </h3>
                    <p className="text-xs text-neutral-500 mb-3 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <Clock className="w-3.5 h-3.5" />
                      {template.estimatedTime}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Render form wizard
  const renderFormWizard = () => {
    if (!selectedTemplate) return null;

    const step = selectedTemplate.steps[currentStep];
    const isLastStep = currentStep === selectedTemplate.steps.length - 1;
    const Icon = iconMap[selectedTemplate.icon] || FileText;
    const colors = categoryColors[selectedTemplate.category];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <button
              onClick={resetForm}
              className="p-2 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-neutral-900 transition-all shrink-0 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className={`p-2 sm:p-2.5 rounded-xl ${colors.iconBg} shrink-0`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text}`} />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-neutral-900 truncate">{selectedTemplate.name}</h1>
                <p className="text-xs sm:text-sm text-neutral-500">Step {currentStep + 1} of {selectedTemplate.steps.length}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowFAQ(!showFAQ)}
              className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer"
              title="FAQ"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => {
                // Generate content if not already generated
                if (!generatedContent && selectedTemplate) {
                  const content = generateDocumentContent(selectedTemplate.id, formData);
                  setGeneratedContent(content);
                }
                setShowPreview(true);
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer"
              title="Preview"
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6">
          <ProgressIndicator
            steps={selectedTemplate.steps.map(s => ({ id: s.id, title: s.title }))}
            currentStep={currentStep}
            onStepClick={goToStep}
          />
        </div>

        {/* FAQ Panel */}
        {showFAQ && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                Frequently Asked Questions
              </h3>
              <button onClick={() => setShowFAQ(false)} className="text-neutral-400 hover:text-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FAQAccordion faqs={selectedTemplate.faq} />
          </div>
        )}

        {/* Save Progress Banner */}
        <SaveProgressBanner 
          lastSaved={lastSaved}
          onSave={saveProgress}
          onClear={clearProgress}
        />

        {/* Form Fields */}
        <div ref={formContainerRef} className="rounded-2xl border border-neutral-200 bg-white p-6 lg:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-2">{step.title}</h2>
            <p className="text-neutral-500">{step.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {step.fields.map(field => {
              // Check conditional visibility
              if (field.conditional) {
                const conditionValue = formData[field.conditional.field];
                if (conditionValue !== field.conditional.value) {
                  return null;
                }
              }

              return (
                <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <FormInput
                    field={field}
                    value={formData[field.id] ?? ''}
                    onChange={(value) => setFormData(prev => ({ ...prev, [field.id]: value }))}
                    error={errors[field.id]}
                  />
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200 gap-3">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed border border-neutral-200 text-neutral-700 transition-all text-sm sm:text-base"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Previous</span>
              <span className="xs:hidden">Prev</span>
            </button>
            <button
              onClick={nextStep}
              disabled={isGenerating}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm transition-all disabled:opacity-70 text-sm sm:text-base"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                  <span className="sm:hidden">Loading...</span>
                </>
              ) : isLastStep ? (
                <>
                  <span className="hidden sm:inline">Generate Document</span>
                  <span className="sm:hidden">Generate</span>
                  <FileText className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span className="hidden xs:inline">Next Step</span>
                  <span className="xs:hidden">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <DisclaimerBanner text={selectedTemplate.disclaimer} />
      </div>
    );
  };

  // Render preview/result
  const renderPreview = () => {
    if (!selectedTemplate || !generatedContent) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              onClick={() => setShowPreview(false)}
              className="p-2 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-neutral-900 transition-all shrink-0 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-neutral-900 truncate">{selectedTemplate.name}</h1>
              <p className="text-xs sm:text-sm text-neutral-500">Document Preview</p>
            </div>
          </div>
        </div>

        {/* Success Banner */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-xl bg-emerald-100 shrink-0">
                <Check className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-neutral-900">Document Generated Successfully</h2>
                <p className="text-xs sm:text-sm text-neutral-500 truncate">Your {selectedTemplate.name} is ready to download</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-xs sm:text-sm font-medium transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={printDocument}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-xs sm:text-sm font-medium transition-all"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={downloadText}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl text-xs sm:text-sm font-medium transition-all"
              >
                <Download className="w-4 h-4" />
                .TXT
              </button>
              <button
                onClick={downloadPDF}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Important Instructions
          </h3>
          <ul className="space-y-2">
            {selectedTemplate.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-neutral-700">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 text-xs font-semibold mt-0.5">
                  {index + 1}
                </span>
                {instruction}
              </li>
            ))}
          </ul>
        </div>

        {/* Document Content */}
        <div className="rounded-2xl border border-neutral-200 bg-white">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-600">Document Preview</span>
            <span className="text-xs text-neutral-400">
              Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <div className="p-6 max-h-[600px] overflow-y-auto bg-neutral-50">
            <pre className="whitespace-pre-wrap text-sm text-neutral-700 font-mono leading-relaxed">
              {generatedContent}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setShowPreview(false);
              setCurrentStep(0);
            }}
            className="flex-1 px-6 py-3 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 font-medium transition-all"
          >
            Edit Document
          </button>
          <button
            onClick={resetForm}
            className="flex-1 px-6 py-3 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 font-medium transition-all cursor-pointer"
          >
            Create New Document
          </button>
        </div>

        {/* Disclaimer */}
        <DisclaimerBanner text={selectedTemplate.disclaimer} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <PageHeader
        title="Legal Forms Generator"
        description="Important: These forms are templates for reference only. Please consult a qualified lawyer before using any legal document."
        icon={<FileSignature className="w-6 h-6 text-amber-600" />}
        accentColor="amber"
      />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {showPreview && generatedContent ? (
            renderPreview()
          ) : selectedTemplate ? (
            renderFormWizard()
          ) : (
            renderFormSelector()
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function LegalFormsGenerator() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
      <LegalFormsGeneratorContent />
    </Suspense>
  );
}
