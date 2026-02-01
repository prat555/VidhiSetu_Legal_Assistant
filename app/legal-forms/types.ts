// Legal Form Generator - Type Definitions

export type FormType = 
  | 'nda'
  | 'contractor'
  | 'lease'
  | 'bill_of_sale'
  | 'power_of_attorney'
  | 'employment'
  | 'llc_operating'
  | 'will';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'checkbox' | 'number' | 'email' | 'phone' | 'currency' | 'signature';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  helpText?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  conditional?: {
    field: string;
    value: string | boolean;
  };
}

export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

export interface FormTemplate {
  id: FormType;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  category: 'business' | 'personal' | 'property' | 'employment';
  estimatedTime: string;
  steps: FormStep[];
  faq: { question: string; answer: string }[];
  instructions: string[];
  disclaimer: string;
}

export interface FormData {
  [key: string]: string | boolean | number;
}

export interface SavedForm {
  id: string;
  formType: FormType;
  formData: FormData;
  currentStep: number;
  lastModified: string;
  completed: boolean;
}

export interface GeneratedDocument {
  title: string;
  content: string;
  formType: FormType;
  generatedAt: string;
  formData: FormData;
}
