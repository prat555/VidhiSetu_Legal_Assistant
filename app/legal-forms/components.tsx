// Reusable Form Components for Legal Form Generator
'use client';

import React from 'react';
import { FormField, FormData } from './types';
import { AlertCircle, HelpCircle, Calendar, ChevronDown } from 'lucide-react';

interface FormInputProps {
  field: FormField;
  value: string | boolean | number;
  onChange: (value: string | boolean | number) => void;
  error?: string;
}

export function FormInput({ field, value, onChange, error }: FormInputProps) {
  const baseInputClass = `
    w-full px-4 py-3 rounded-xl border transition-all duration-200
    bg-white text-neutral-900 placeholder-neutral-400
    focus:outline-none focus:ring-2
    ${error 
      ? 'border-red-300 focus:ring-red-200 focus:border-red-400' 
      : 'border-neutral-200 focus:ring-amber-100 focus:border-amber-400 hover:border-neutral-300'
    }
  `;

  const renderInput = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`${baseInputClass} resize-none`}
          />
        );

      case 'select':
        return (
          <div className="relative">
            <select
              id={field.id}
              value={value as string || ''}
              onChange={(e) => onChange(e.target.value)}
              className={`${baseInputClass} appearance-none cursor-pointer pr-10`}
            >
              <option value="">Select an option...</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                id={field.id}
                checked={value as boolean || false}
                onChange={(e) => onChange(e.target.checked)}
                className="peer sr-only"
              />
              <div className={`
                w-6 h-6 rounded-lg border-2 transition-all duration-200
                ${value 
                  ? 'bg-amber-600 border-amber-600' 
                  : 'bg-white border-neutral-300 group-hover:border-amber-400'
                }
              `}>
                {value && (
                  <svg className="w-full h-full text-white p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-neutral-700 group-hover:text-neutral-900 transition-colors">
              {field.label}
            </span>
          </label>
        );

      case 'date':
        return (
          <div className="relative">
            <input
              type="date"
              id={field.id}
              value={value as string || ''}
              onChange={(e) => onChange(e.target.value)}
              className={`${baseInputClass} cursor-pointer pr-12 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
          </div>
        );

      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">₹</span>
            <input
              type="number"
              id={field.id}
              value={value as string || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || '0.00'}
              min={0}
              step="0.01"
              className={`${baseInputClass} pl-8`}
            />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            className={baseInputClass}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            id={field.id}
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || 'email@example.com'}
            className={baseInputClass}
          />
        );

      case 'phone':
        return (
          <input
            type="tel"
            id={field.id}
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || '(555) 555-5555'}
            className={baseInputClass}
          />
        );

      case 'signature':
        return (
          <div className="space-y-2">
            <div className={`
              h-24 rounded-xl border-2 border-dashed flex items-center justify-center
              ${error ? 'border-red-300' : 'border-neutral-200 hover:border-amber-400'}
              transition-colors cursor-pointer group bg-neutral-50
            `}>
              <p className="text-neutral-400 group-hover:text-neutral-600 transition-colors">
                Click to add signature
              </p>
            </div>
            <input
              type="text"
              id={field.id}
              value={value as string || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Type your full legal name"
              className={baseInputClass}
            />
          </div>
        );

      default:
        return (
          <input
            type="text"
            id={field.id}
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.validation?.maxLength}
            className={baseInputClass}
          />
        );
    }
  };

  // Don't render label for checkbox (it's inline)
  if (field.type === 'checkbox') {
    return (
      <div className="space-y-2">
        {renderInput()}
        {field.helpText && (
          <p className="text-xs text-neutral-500 flex items-center gap-1.5 ml-9">
            <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {field.helpText}
          </p>
        )}
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1.5 ml-9">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label htmlFor={field.id} className="flex items-center gap-2 text-sm font-medium text-neutral-700">
        {field.label}
        {field.required && <span className="text-amber-600">*</span>}
      </label>
      {renderInput()}
      {field.helpText && (
        <p className="text-xs text-neutral-500 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {field.helpText}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// Progress Indicator Component
interface ProgressIndicatorProps {
  steps: { id: string; title: string }[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export function ProgressIndicator({ steps, currentStep, onStepClick }: ProgressIndicatorProps) {
  return (
    <div className="relative">
      {/* Progress Bar Background */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-200" />
      
      {/* Active Progress Bar */}
      <div 
        className="absolute top-5 left-0 h-0.5 bg-amber-500 transition-all duration-500"
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
      />
      
      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = onStepClick && index <= currentStep;
          
          return (
            <button
              key={step.id}
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={`
                flex flex-col items-center gap-2 group
                ${isClickable ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                font-semibold text-sm transition-all duration-300
                ${isCompleted 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : isCurrent 
                    ? 'bg-amber-100 border-2 border-amber-500 text-amber-700' 
                    : 'bg-neutral-100 border-2 border-neutral-200 text-neutral-400'
                }
                ${isClickable ? 'group-hover:scale-110' : ''}
              `}>
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={`
                text-xs font-medium max-w-[80px] text-center leading-tight hidden sm:block
                ${isCurrent ? 'text-amber-700' : isCompleted ? 'text-neutral-700' : 'text-neutral-400'}
              `}>
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// FAQ Accordion Component
interface FAQAccordionProps {
  faqs: { question: string; answer: string }[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div 
          key={index}
          className="rounded-xl border border-neutral-200 overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-5 py-4 flex items-center justify-between text-left bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            <span className="font-medium text-neutral-800">{faq.question}</span>
            <ChevronDown className={`
              w-5 h-5 text-neutral-400 transition-transform duration-300
              ${openIndex === index ? 'rotate-180' : ''}
            `} />
          </button>
          <div className={`
            overflow-hidden transition-all duration-300
            ${openIndex === index ? 'max-h-96' : 'max-h-0'}
          `}>
            <p className="px-5 py-4 text-neutral-600 border-t border-neutral-100">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Disclaimer Banner Component
interface DisclaimerBannerProps {
  text: string;
}

export function DisclaimerBanner({ text }: DisclaimerBannerProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-amber-800 mb-1">Legal Disclaimer</p>
        <p className="text-sm text-amber-700">{text}</p>
      </div>
    </div>
  );
}

// Save Progress Banner
interface SaveProgressBannerProps {
  lastSaved: string | null;
  onSave: () => void;
  onClear: () => void;
}

export function SaveProgressBanner({ lastSaved, onSave, onClear }: SaveProgressBannerProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-sm text-neutral-500">
          {lastSaved ? `Progress saved ${lastSaved}` : 'Progress auto-saves locally'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          className="px-3 py-1.5 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors cursor-pointer"
        >
          Clear Progress
        </button>
        <button
          onClick={onSave}
          className="px-3 py-1.5 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors cursor-pointer"
        >
          Save Now
        </button>
      </div>
    </div>
  );
}
