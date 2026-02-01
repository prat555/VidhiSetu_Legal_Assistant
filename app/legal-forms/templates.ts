// Legal Form Templates - Comprehensive Template System
import { FormTemplate } from './types';

export const formTemplates: FormTemplate[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // NON-DISCLOSURE AGREEMENT (NDA)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    shortName: 'NDA',
    description: 'Protect confidential information when sharing with employees, contractors, or business partners.',
    icon: 'Shield',
    category: 'business',
    estimatedTime: '5-10 minutes',
    steps: [
      {
        id: 'parties',
        title: 'Party Information',
        description: 'Enter details about both parties involved in this agreement.',
        fields: [
          { id: 'disclosingPartyName', label: 'Disclosing Party Name', type: 'text', placeholder: 'Company or individual sharing information', required: true },
          { id: 'disclosingPartyAddress', label: 'Disclosing Party Address', type: 'textarea', placeholder: 'Complete address', required: true },
          { id: 'disclosingPartyEmail', label: 'Disclosing Party Email', type: 'email', placeholder: 'email@example.com', required: true },
          { id: 'receivingPartyName', label: 'Receiving Party Name', type: 'text', placeholder: 'Company or individual receiving information', required: true },
          { id: 'receivingPartyAddress', label: 'Receiving Party Address', type: 'textarea', placeholder: 'Complete address', required: true },
          { id: 'receivingPartyEmail', label: 'Receiving Party Email', type: 'email', placeholder: 'email@example.com', required: true },
        ],
      },
      {
        id: 'confidential_info',
        title: 'Confidential Information',
        description: 'Define what information will be protected under this agreement.',
        fields: [
          { id: 'ndaType', label: 'Type of NDA', type: 'select', required: true, options: [
            { value: 'unilateral', label: 'Unilateral (One-way)' },
            { value: 'bilateral', label: 'Bilateral (Mutual)' },
          ]},
          { id: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', placeholder: 'e.g., Evaluating a potential business partnership', required: true },
          { id: 'confidentialInfo', label: 'Description of Confidential Information', type: 'textarea', placeholder: 'Describe the types of information to be protected...', required: true, helpText: 'Be specific about what constitutes confidential information' },
          { id: 'exclusions', label: 'Exclusions (Optional)', type: 'textarea', placeholder: 'Information that is NOT considered confidential...' },
        ],
      },
      {
        id: 'terms',
        title: 'Agreement Terms',
        description: 'Set the duration and governing terms of the agreement.',
        fields: [
          { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
          { id: 'duration', label: 'Duration (Years)', type: 'select', required: true, options: [
            { value: '1', label: '1 Year' },
            { value: '2', label: '2 Years' },
            { value: '3', label: '3 Years' },
            { value: '5', label: '5 Years' },
            { value: 'perpetual', label: 'Perpetual' },
          ]},
          { id: 'governingLaw', label: 'Governing Law (State/Country)', type: 'text', placeholder: 'e.g., State of California, USA', required: true },
          { id: 'jurisdiction', label: 'Jurisdiction for Disputes', type: 'text', placeholder: 'e.g., Courts of San Francisco County', required: true },
        ],
      },
      {
        id: 'additional',
        title: 'Additional Provisions',
        description: 'Optional additional clauses and protections.',
        fields: [
          { id: 'nonSolicitation', label: 'Include Non-Solicitation Clause', type: 'checkbox', helpText: 'Prevents poaching of employees/clients' },
          { id: 'nonCompete', label: 'Include Non-Compete Clause', type: 'checkbox', helpText: 'Restricts competitive activities' },
          { id: 'returnOfMaterials', label: 'Require Return of Materials', type: 'checkbox', helpText: 'Receiving party must return all confidential materials' },
          { id: 'injunctiveRelief', label: 'Allow Injunctive Relief', type: 'checkbox', helpText: 'Permits seeking court orders for breach' },
          { id: 'additionalTerms', label: 'Additional Terms (Optional)', type: 'textarea', placeholder: 'Any other terms you want to include...' },
        ],
      },
    ],
    faq: [
      { question: 'What is the difference between unilateral and bilateral NDAs?', answer: 'A unilateral NDA protects information shared by one party only. A bilateral (mutual) NDA protects confidential information shared by both parties.' },
      { question: 'How long should an NDA last?', answer: 'Typically 2-5 years, but this depends on the nature of the information. Trade secrets may warrant perpetual protection.' },
      { question: 'Can an NDA be enforced?', answer: 'Yes, properly drafted NDAs are legally enforceable. However, overly broad terms may be unenforceable. Consult an attorney for complex situations.' },
    ],
    instructions: [
      'Both parties should review the entire agreement before signing',
      'Each party should retain a signed copy',
      'Date the agreement on the day of signing',
      'Consider having signatures notarized for added protection',
    ],
    disclaimer: 'This NDA template is for informational purposes only and does not constitute legal advice. The enforceability of NDAs varies by jurisdiction. Consult with a qualified attorney for your specific situation.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INDEPENDENT CONTRACTOR AGREEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'contractor',
    name: 'Independent Contractor Agreement',
    shortName: 'Contractor',
    description: 'Define the terms of engagement with freelancers and independent contractors.',
    icon: 'Briefcase',
    category: 'business',
    estimatedTime: '10-15 minutes',
    steps: [
      {
        id: 'parties',
        title: 'Party Information',
        description: 'Enter details about the company and contractor.',
        fields: [
          { id: 'companyName', label: 'Company/Client Name', type: 'text', required: true },
          { id: 'companyAddress', label: 'Company Address', type: 'textarea', required: true },
          { id: 'companyEmail', label: 'Company Email', type: 'email', required: true },
          { id: 'contractorName', label: 'Contractor Name', type: 'text', required: true },
          { id: 'contractorAddress', label: 'Contractor Address', type: 'textarea', required: true },
          { id: 'contractorEmail', label: 'Contractor Email', type: 'email', required: true },
          { id: 'contractorTaxId', label: 'Contractor Tax ID (Optional)', type: 'text', placeholder: 'SSN or EIN' },
        ],
      },
      {
        id: 'scope',
        title: 'Scope of Work',
        description: 'Define the services to be provided.',
        fields: [
          { id: 'serviceDescription', label: 'Description of Services', type: 'textarea', required: true, placeholder: 'Detailed description of work to be performed...' },
          { id: 'deliverables', label: 'Deliverables', type: 'textarea', required: true, placeholder: 'List specific deliverables expected...' },
          { id: 'startDate', label: 'Start Date', type: 'date', required: true },
          { id: 'endDate', label: 'End Date (or Ongoing)', type: 'date' },
          { id: 'workLocation', label: 'Work Location', type: 'select', required: true, options: [
            { value: 'remote', label: 'Remote' },
            { value: 'onsite', label: 'On-site' },
            { value: 'hybrid', label: 'Hybrid' },
          ]},
        ],
      },
      {
        id: 'payment',
        title: 'Payment Terms',
        description: 'Set compensation and payment schedule.',
        fields: [
          { id: 'paymentType', label: 'Payment Type', type: 'select', required: true, options: [
            { value: 'hourly', label: 'Hourly Rate' },
            { value: 'fixed', label: 'Fixed Project Fee' },
            { value: 'milestone', label: 'Milestone-based' },
            { value: 'retainer', label: 'Monthly Retainer' },
          ]},
          { id: 'rate', label: 'Rate/Amount', type: 'currency', required: true, placeholder: 'Enter amount' },
          { id: 'currency', label: 'Currency', type: 'select', required: true, options: [
            { value: 'USD', label: 'USD ($)' },
            { value: 'EUR', label: 'EUR (€)' },
            { value: 'GBP', label: 'GBP (£)' },
            { value: 'INR', label: 'INR (₹)' },
          ]},
          { id: 'paymentSchedule', label: 'Payment Schedule', type: 'select', required: true, options: [
            { value: 'weekly', label: 'Weekly' },
            { value: 'biweekly', label: 'Bi-weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'upon_completion', label: 'Upon Completion' },
            { value: 'milestone', label: 'Per Milestone' },
          ]},
          { id: 'paymentMethod', label: 'Payment Method', type: 'text', placeholder: 'e.g., Bank transfer, PayPal' },
          { id: 'invoiceRequirements', label: 'Invoice Requirements', type: 'textarea', placeholder: 'Any specific invoicing requirements...' },
        ],
      },
      {
        id: 'terms',
        title: 'Legal Terms',
        description: 'Define ownership, confidentiality, and termination.',
        fields: [
          { id: 'ipOwnership', label: 'Intellectual Property Ownership', type: 'select', required: true, options: [
            { value: 'client', label: 'Client owns all work product' },
            { value: 'contractor', label: 'Contractor retains ownership, grants license' },
            { value: 'joint', label: 'Joint ownership' },
          ]},
          { id: 'confidentiality', label: 'Include Confidentiality Clause', type: 'checkbox' },
          { id: 'nonCompete', label: 'Include Non-Compete Clause', type: 'checkbox' },
          { id: 'terminationNotice', label: 'Termination Notice Period (Days)', type: 'number', placeholder: '14', required: true },
          { id: 'governingLaw', label: 'Governing Law', type: 'text', required: true },
        ],
      },
    ],
    faq: [
      { question: 'What distinguishes a contractor from an employee?', answer: 'Contractors control how they complete work, use their own tools, work for multiple clients, and are responsible for their own taxes. Misclassification can result in penalties.' },
      { question: 'Who owns the work product?', answer: 'This should be explicitly stated in the agreement. Without clear terms, ownership may default to the contractor in some jurisdictions.' },
    ],
    instructions: [
      'Both parties should sign and date the agreement',
      'Contractor should retain records for tax purposes',
      'Review classification rules in your jurisdiction',
      'Keep copies of all invoices and payments',
    ],
    disclaimer: 'Worker classification has significant tax and legal implications. Consult with an employment attorney and tax professional to ensure compliance with applicable laws.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BILL OF SALE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'bill_of_sale',
    name: 'Bill of Sale',
    shortName: 'Bill of Sale',
    description: 'Document the sale and transfer of personal property.',
    icon: 'Receipt',
    category: 'personal',
    estimatedTime: '5-10 minutes',
    steps: [
      {
        id: 'parties',
        title: 'Buyer & Seller',
        description: 'Enter information about both parties.',
        fields: [
          { id: 'sellerName', label: 'Seller Name', type: 'text', required: true },
          { id: 'sellerAddress', label: 'Seller Address', type: 'textarea', required: true },
          { id: 'sellerPhone', label: 'Seller Phone', type: 'phone' },
          { id: 'buyerName', label: 'Buyer Name', type: 'text', required: true },
          { id: 'buyerAddress', label: 'Buyer Address', type: 'textarea', required: true },
          { id: 'buyerPhone', label: 'Buyer Phone', type: 'phone' },
        ],
      },
      {
        id: 'item',
        title: 'Item Details',
        description: 'Describe the item being sold.',
        fields: [
          { id: 'itemType', label: 'Type of Item', type: 'select', required: true, options: [
            { value: 'vehicle', label: 'Vehicle (Car, Motorcycle, etc.)' },
            { value: 'boat', label: 'Boat/Watercraft' },
            { value: 'electronics', label: 'Electronics' },
            { value: 'furniture', label: 'Furniture' },
            { value: 'equipment', label: 'Equipment/Machinery' },
            { value: 'other', label: 'Other Personal Property' },
          ]},
          { id: 'itemDescription', label: 'Item Description', type: 'textarea', required: true, placeholder: 'Detailed description of the item...' },
          { id: 'make', label: 'Make/Brand', type: 'text', conditional: { field: 'itemType', value: 'vehicle' } },
          { id: 'model', label: 'Model', type: 'text', conditional: { field: 'itemType', value: 'vehicle' } },
          { id: 'year', label: 'Year', type: 'number', conditional: { field: 'itemType', value: 'vehicle' } },
          { id: 'vin', label: 'VIN/Serial Number', type: 'text', placeholder: 'If applicable' },
          { id: 'color', label: 'Color', type: 'text' },
          { id: 'condition', label: 'Condition', type: 'select', required: true, options: [
            { value: 'new', label: 'New' },
            { value: 'like_new', label: 'Like New' },
            { value: 'good', label: 'Good' },
            { value: 'fair', label: 'Fair' },
            { value: 'poor', label: 'Poor' },
          ]},
          { id: 'conditionDetails', label: 'Condition Details', type: 'textarea', placeholder: 'Note any defects, damage, or issues...' },
        ],
      },
      {
        id: 'transaction',
        title: 'Transaction Details',
        description: 'Enter the sale terms.',
        fields: [
          { id: 'salePrice', label: 'Sale Price', type: 'currency', required: true },
          { id: 'currency', label: 'Currency', type: 'select', required: true, options: [
            { value: 'USD', label: 'USD ($)' },
            { value: 'EUR', label: 'EUR (€)' },
            { value: 'GBP', label: 'GBP (£)' },
            { value: 'INR', label: 'INR (₹)' },
          ]},
          { id: 'paymentMethod', label: 'Payment Method', type: 'select', required: true, options: [
            { value: 'cash', label: 'Cash' },
            { value: 'check', label: 'Check' },
            { value: 'bank_transfer', label: 'Bank Transfer' },
            { value: 'other', label: 'Other' },
          ]},
          { id: 'saleDate', label: 'Sale Date', type: 'date', required: true },
          { id: 'warranty', label: 'Warranty', type: 'select', options: [
            { value: 'as_is', label: 'Sold As-Is (No Warranty)' },
            { value: '30_days', label: '30-Day Warranty' },
            { value: '90_days', label: '90-Day Warranty' },
            { value: 'manufacturer', label: 'Manufacturer Warranty Transfers' },
          ]},
          { id: 'governingLaw', label: 'Governing Law (State)', type: 'text', required: true },
        ],
      },
    ],
    faq: [
      { question: 'Do I need a bill of sale for a vehicle?', answer: 'Most states require a bill of sale for vehicle transfers, along with title transfer. Check your DMV requirements.' },
      { question: 'What does "as-is" mean?', answer: 'Selling "as-is" means the buyer accepts the item in its current condition with no warranty from the seller.' },
    ],
    instructions: [
      'Both parties should sign in front of a witness if possible',
      'Keep the original and provide a copy to the other party',
      'For vehicles, complete title transfer at your local DMV',
      'Consider notarization for high-value items',
    ],
    disclaimer: 'This bill of sale may not meet all requirements in your jurisdiction. For vehicles, check your local DMV for specific requirements.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // POWER OF ATTORNEY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'power_of_attorney',
    name: 'Power of Attorney',
    shortName: 'POA',
    description: 'Authorize someone to act on your behalf for legal, financial, or health matters.',
    icon: 'Scale',
    category: 'personal',
    estimatedTime: '10-15 minutes',
    steps: [
      {
        id: 'principal',
        title: 'Principal Information',
        description: 'Enter your information (the person granting authority).',
        fields: [
          { id: 'principalName', label: 'Your Full Legal Name', type: 'text', required: true },
          { id: 'principalAddress', label: 'Your Address', type: 'textarea', required: true },
          { id: 'principalDOB', label: 'Date of Birth', type: 'date', required: true },
          { id: 'principalPhone', label: 'Phone Number', type: 'phone', required: true },
          { id: 'principalEmail', label: 'Email Address', type: 'email' },
        ],
      },
      {
        id: 'agent',
        title: 'Agent Information',
        description: 'Enter information about your attorney-in-fact (the person you are authorizing).',
        fields: [
          { id: 'agentName', label: 'Agent Full Legal Name', type: 'text', required: true },
          { id: 'agentAddress', label: 'Agent Address', type: 'textarea', required: true },
          { id: 'agentPhone', label: 'Agent Phone', type: 'phone', required: true },
          { id: 'agentEmail', label: 'Agent Email', type: 'email' },
          { id: 'agentRelationship', label: 'Relationship to You', type: 'text', placeholder: 'e.g., Spouse, Child, Attorney' },
          { id: 'alternateAgent', label: 'Alternate Agent Name (Optional)', type: 'text', helpText: 'Backup if primary agent cannot serve' },
          { id: 'alternateAgentAddress', label: 'Alternate Agent Address', type: 'textarea' },
        ],
      },
      {
        id: 'powers',
        title: 'Powers Granted',
        description: 'Select the powers you want to grant to your agent.',
        fields: [
          { id: 'poaType', label: 'Type of Power of Attorney', type: 'select', required: true, options: [
            { value: 'general', label: 'General (Broad powers)' },
            { value: 'limited', label: 'Limited (Specific powers only)' },
            { value: 'healthcare', label: 'Healthcare Decisions' },
            { value: 'financial', label: 'Financial Matters Only' },
          ]},
          { id: 'bankingPower', label: 'Banking & Financial Transactions', type: 'checkbox' },
          { id: 'realEstatePower', label: 'Real Estate Transactions', type: 'checkbox' },
          { id: 'taxPower', label: 'Tax Matters', type: 'checkbox' },
          { id: 'investmentPower', label: 'Investment Decisions', type: 'checkbox' },
          { id: 'insurancePower', label: 'Insurance Matters', type: 'checkbox' },
          { id: 'legalPower', label: 'Legal Proceedings', type: 'checkbox' },
          { id: 'businessPower', label: 'Business Operations', type: 'checkbox' },
          { id: 'governmentPower', label: 'Government Benefits', type: 'checkbox' },
          { id: 'specificPowers', label: 'Specific Powers (if Limited POA)', type: 'textarea', placeholder: 'Describe specific powers granted...' },
        ],
      },
      {
        id: 'terms',
        title: 'Duration & Terms',
        description: 'Set when this power of attorney takes effect and ends.',
        fields: [
          { id: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
          { id: 'durability', label: 'Durability', type: 'select', required: true, options: [
            { value: 'durable', label: 'Durable (Continues if I become incapacitated)' },
            { value: 'non_durable', label: 'Non-Durable (Ends if I become incapacitated)' },
            { value: 'springing', label: 'Springing (Only effective upon incapacity)' },
          ]},
          { id: 'expirationDate', label: 'Expiration Date (Optional)', type: 'date', helpText: 'Leave blank for no expiration' },
          { id: 'revocationTerms', label: 'Revocation Terms', type: 'textarea', placeholder: 'How can this POA be revoked?' },
          { id: 'governingLaw', label: 'Governing Law (State)', type: 'text', required: true },
        ],
      },
    ],
    faq: [
      { question: 'What is a "durable" power of attorney?', answer: 'A durable POA remains in effect even if you become mentally incapacitated. Most people prefer durable POAs for this reason.' },
      { question: 'Can I revoke a power of attorney?', answer: 'Yes, you can revoke a POA at any time while you are mentally competent by providing written notice.' },
      { question: 'Does a POA need to be notarized?', answer: 'Many states require notarization for POAs to be valid. Some also require witnesses. Check your state requirements.' },
    ],
    instructions: [
      'This document should be signed in front of a notary public',
      'Some states require witnesses in addition to notarization',
      'Provide copies to your agent and relevant institutions',
      'Keep the original in a safe, accessible location',
      'Review and update periodically',
    ],
    disclaimer: 'A Power of Attorney is a significant legal document. State requirements vary considerably. Strongly recommend consulting with an attorney, especially for healthcare directives.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EMPLOYMENT CONTRACT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'employment',
    name: 'Employment Contract',
    shortName: 'Employment',
    description: 'Create a formal employment agreement between employer and employee.',
    icon: 'Users',
    category: 'employment',
    estimatedTime: '15-20 minutes',
    steps: [
      {
        id: 'parties',
        title: 'Employer & Employee',
        description: 'Enter company and employee information.',
        fields: [
          { id: 'employerName', label: 'Company/Employer Name', type: 'text', required: true },
          { id: 'employerAddress', label: 'Company Address', type: 'textarea', required: true },
          { id: 'employerContact', label: 'HR Contact Name', type: 'text' },
          { id: 'employerEmail', label: 'HR Email', type: 'email' },
          { id: 'employeeName', label: 'Employee Full Legal Name', type: 'text', required: true },
          { id: 'employeeAddress', label: 'Employee Address', type: 'textarea', required: true },
          { id: 'employeeEmail', label: 'Employee Email', type: 'email', required: true },
          { id: 'employeePhone', label: 'Employee Phone', type: 'phone' },
        ],
      },
      {
        id: 'position',
        title: 'Position Details',
        description: 'Define the role and responsibilities.',
        fields: [
          { id: 'jobTitle', label: 'Job Title', type: 'text', required: true },
          { id: 'department', label: 'Department', type: 'text' },
          { id: 'reportsTo', label: 'Reports To (Manager/Title)', type: 'text' },
          { id: 'jobDescription', label: 'Job Description', type: 'textarea', required: true, placeholder: 'Primary duties and responsibilities...' },
          { id: 'workLocation', label: 'Work Location', type: 'text', required: true },
          { id: 'remoteWork', label: 'Remote Work Policy', type: 'select', options: [
            { value: 'onsite', label: 'Fully On-site' },
            { value: 'remote', label: 'Fully Remote' },
            { value: 'hybrid', label: 'Hybrid' },
          ]},
          { id: 'startDate', label: 'Start Date', type: 'date', required: true },
        ],
      },
      {
        id: 'compensation',
        title: 'Compensation & Benefits',
        description: 'Define salary and benefits.',
        fields: [
          { id: 'employmentType', label: 'Employment Type', type: 'select', required: true, options: [
            { value: 'full_time', label: 'Full-Time' },
            { value: 'part_time', label: 'Part-Time' },
            { value: 'temporary', label: 'Temporary' },
          ]},
          { id: 'salaryType', label: 'Salary Type', type: 'select', required: true, options: [
            { value: 'annual', label: 'Annual Salary' },
            { value: 'hourly', label: 'Hourly Wage' },
          ]},
          { id: 'salaryAmount', label: 'Salary/Wage Amount', type: 'currency', required: true },
          { id: 'currency', label: 'Currency', type: 'select', required: true, options: [
            { value: 'USD', label: 'USD ($)' },
            { value: 'EUR', label: 'EUR (€)' },
            { value: 'GBP', label: 'GBP (£)' },
            { value: 'INR', label: 'INR (₹)' },
          ]},
          { id: 'payFrequency', label: 'Pay Frequency', type: 'select', required: true, options: [
            { value: 'weekly', label: 'Weekly' },
            { value: 'biweekly', label: 'Bi-weekly' },
            { value: 'semimonthly', label: 'Semi-monthly' },
            { value: 'monthly', label: 'Monthly' },
          ]},
          { id: 'bonus', label: 'Bonus Structure (if any)', type: 'textarea', placeholder: 'Performance bonus, signing bonus, etc.' },
          { id: 'benefits', label: 'Benefits Package', type: 'textarea', placeholder: 'Health insurance, 401k, PTO, etc.' },
        ],
      },
      {
        id: 'schedule',
        title: 'Work Schedule',
        description: 'Define working hours and time off.',
        fields: [
          { id: 'workHours', label: 'Weekly Work Hours', type: 'number', required: true, placeholder: '40' },
          { id: 'workSchedule', label: 'Work Schedule', type: 'text', placeholder: 'e.g., Monday-Friday, 9 AM - 5 PM' },
          { id: 'overtime', label: 'Overtime Policy', type: 'textarea', placeholder: 'Overtime eligibility and rate...' },
          { id: 'ptoPolicy', label: 'Paid Time Off', type: 'text', placeholder: 'e.g., 15 days per year' },
          { id: 'sickLeave', label: 'Sick Leave', type: 'text', placeholder: 'e.g., 5 days per year' },
          { id: 'holidays', label: 'Paid Holidays', type: 'textarea', placeholder: 'List of observed holidays...' },
        ],
      },
      {
        id: 'terms',
        title: 'Terms & Conditions',
        description: 'Additional employment terms.',
        fields: [
          { id: 'probationPeriod', label: 'Probation Period (Months)', type: 'number', placeholder: '3' },
          { id: 'confidentiality', label: 'Include Confidentiality Agreement', type: 'checkbox' },
          { id: 'nonCompete', label: 'Include Non-Compete Clause', type: 'checkbox' },
          { id: 'nonCompetePeriod', label: 'Non-Compete Period (Months)', type: 'number', conditional: { field: 'nonCompete', value: true } },
          { id: 'terminationNotice', label: 'Termination Notice Period (Days)', type: 'number', placeholder: '14' },
          { id: 'ipAssignment', label: 'IP Assignment Clause', type: 'checkbox', helpText: 'Employee assigns work-related IP to employer' },
          { id: 'governingLaw', label: 'Governing Law (State)', type: 'text', required: true },
        ],
      },
    ],
    faq: [
      { question: 'Is an employment contract legally required?', answer: 'In most jurisdictions, no. However, a written contract protects both parties and clarifies expectations.' },
      { question: 'Can I include a non-compete clause?', answer: 'Yes, but enforceability varies greatly by state. Some states like California largely prohibit them.' },
    ],
    instructions: [
      'Both parties should sign and date the agreement',
      'Employee should receive a copy on or before the start date',
      'Review with HR and/or legal counsel before signing',
      'Keep the original in employee files',
    ],
    disclaimer: 'Employment laws vary by jurisdiction. This template may not address all legal requirements. Consult with an employment attorney to ensure compliance.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LLC OPERATING AGREEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'llc_operating',
    name: 'LLC Operating Agreement',
    shortName: 'LLC Agreement',
    description: 'Establish the ownership structure and operating procedures for your LLC.',
    icon: 'Building',
    category: 'business',
    estimatedTime: '20-30 minutes',
    steps: [
      {
        id: 'company',
        title: 'Company Information',
        description: 'Enter your LLC details.',
        fields: [
          { id: 'companyName', label: 'LLC Name', type: 'text', required: true },
          { id: 'companyAddress', label: 'Principal Place of Business', type: 'textarea', required: true },
          { id: 'stateOfFormation', label: 'State of Formation', type: 'text', required: true },
          { id: 'formationDate', label: 'Date of Formation', type: 'date', required: true },
          { id: 'einNumber', label: 'EIN (if obtained)', type: 'text' },
          { id: 'businessPurpose', label: 'Business Purpose', type: 'textarea', required: true, placeholder: 'Describe the business activities of the LLC...' },
        ],
      },
      {
        id: 'members',
        title: 'Members & Ownership',
        description: 'Define the members and their ownership stakes.',
        fields: [
          { id: 'memberCount', label: 'Number of Members', type: 'select', required: true, options: [
            { value: '1', label: 'Single Member' },
            { value: '2', label: '2 Members' },
            { value: '3', label: '3 Members' },
            { value: '4', label: '4 Members' },
            { value: '5+', label: '5 or More Members' },
          ]},
          { id: 'member1Name', label: 'Member 1 Name', type: 'text', required: true },
          { id: 'member1Address', label: 'Member 1 Address', type: 'textarea', required: true },
          { id: 'member1Ownership', label: 'Member 1 Ownership %', type: 'number', required: true },
          { id: 'member1Contribution', label: 'Member 1 Initial Contribution', type: 'currency' },
          { id: 'member2Name', label: 'Member 2 Name', type: 'text' },
          { id: 'member2Address', label: 'Member 2 Address', type: 'textarea' },
          { id: 'member2Ownership', label: 'Member 2 Ownership %', type: 'number' },
          { id: 'member2Contribution', label: 'Member 2 Initial Contribution', type: 'currency' },
          { id: 'additionalMembers', label: 'Additional Members (if any)', type: 'textarea', placeholder: 'Name, Address, Ownership %, Contribution - one per line' },
        ],
      },
      {
        id: 'management',
        title: 'Management Structure',
        description: 'Define how the LLC will be managed.',
        fields: [
          { id: 'managementType', label: 'Management Type', type: 'select', required: true, options: [
            { value: 'member_managed', label: 'Member-Managed' },
            { value: 'manager_managed', label: 'Manager-Managed' },
          ]},
          { id: 'managerName', label: 'Manager Name (if manager-managed)', type: 'text', conditional: { field: 'managementType', value: 'manager_managed' } },
          { id: 'votingRights', label: 'Voting Rights', type: 'select', required: true, options: [
            { value: 'ownership', label: 'Based on Ownership Percentage' },
            { value: 'equal', label: 'Equal Vote Per Member' },
          ]},
          { id: 'majorityRequired', label: 'Majority Required for Decisions', type: 'select', required: true, options: [
            { value: 'simple', label: 'Simple Majority (>50%)' },
            { value: 'supermajority', label: 'Supermajority (>66%)' },
            { value: 'unanimous', label: 'Unanimous' },
          ]},
          { id: 'meetingFrequency', label: 'Member Meeting Frequency', type: 'select', options: [
            { value: 'monthly', label: 'Monthly' },
            { value: 'quarterly', label: 'Quarterly' },
            { value: 'annually', label: 'Annually' },
            { value: 'as_needed', label: 'As Needed' },
          ]},
        ],
      },
      {
        id: 'financial',
        title: 'Financial Provisions',
        description: 'Define profit distribution and capital requirements.',
        fields: [
          { id: 'fiscalYearEnd', label: 'Fiscal Year End', type: 'select', required: true, options: [
            { value: 'december', label: 'December 31' },
            { value: 'march', label: 'March 31' },
            { value: 'june', label: 'June 30' },
            { value: 'september', label: 'September 30' },
          ]},
          { id: 'taxClassification', label: 'Tax Classification', type: 'select', required: true, options: [
            { value: 'disregarded', label: 'Disregarded Entity (Single Member)' },
            { value: 'partnership', label: 'Partnership' },
            { value: 's_corp', label: 'S-Corporation' },
            { value: 'c_corp', label: 'C-Corporation' },
          ]},
          { id: 'profitDistribution', label: 'Profit Distribution', type: 'select', required: true, options: [
            { value: 'ownership', label: 'Based on Ownership Percentage' },
            { value: 'equal', label: 'Equal Distribution' },
            { value: 'custom', label: 'Custom Arrangement' },
          ]},
          { id: 'distributionFrequency', label: 'Distribution Frequency', type: 'select', options: [
            { value: 'monthly', label: 'Monthly' },
            { value: 'quarterly', label: 'Quarterly' },
            { value: 'annually', label: 'Annually' },
            { value: 'as_available', label: 'As Funds Available' },
          ]},
          { id: 'additionalCapital', label: 'Additional Capital Contributions', type: 'textarea', placeholder: 'Terms for additional capital calls...' },
        ],
      },
      {
        id: 'transfers',
        title: 'Membership Transfers',
        description: 'Define rules for transferring membership interests.',
        fields: [
          { id: 'transferRestrictions', label: 'Transfer Restrictions', type: 'select', required: true, options: [
            { value: 'approval', label: 'Requires Member Approval' },
            { value: 'rofr', label: 'Right of First Refusal' },
            { value: 'none', label: 'No Restrictions' },
          ]},
          { id: 'buyoutProvisions', label: 'Buyout Provisions', type: 'textarea', placeholder: 'Terms for buying out a departing member...' },
          { id: 'deathDisability', label: 'Death/Disability Provisions', type: 'textarea', placeholder: 'What happens if a member dies or becomes disabled...' },
          { id: 'dissolution', label: 'Dissolution Provisions', type: 'textarea', placeholder: 'Conditions and process for dissolving the LLC...' },
        ],
      },
    ],
    faq: [
      { question: 'Do I need an operating agreement for a single-member LLC?', answer: 'While not always legally required, it\'s highly recommended. It establishes the LLC as a separate entity and provides liability protection.' },
      { question: 'Can the operating agreement be changed later?', answer: 'Yes, members can amend the agreement by following the amendment procedures outlined in the document.' },
    ],
    instructions: [
      'All members must sign the operating agreement',
      'Keep the original with your LLC records',
      'Provide copies to all members',
      'Review annually and update as needed',
      'Consult with an attorney for complex ownership structures',
    ],
    disclaimer: 'LLC laws vary significantly by state. This template is a starting point and may not address all state-specific requirements. Consult with a business attorney.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LAST WILL AND TESTAMENT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'will',
    name: 'Last Will and Testament',
    shortName: 'Will',
    description: 'Create a basic will to specify how your assets should be distributed.',
    icon: 'FileText',
    category: 'personal',
    estimatedTime: '15-25 minutes',
    steps: [
      {
        id: 'testator',
        title: 'Your Information',
        description: 'Enter your personal information.',
        fields: [
          { id: 'testatorName', label: 'Your Full Legal Name', type: 'text', required: true },
          { id: 'testatorAddress', label: 'Your Address', type: 'textarea', required: true },
          { id: 'testatorCity', label: 'City', type: 'text', required: true },
          { id: 'testatorState', label: 'State/Province', type: 'text', required: true },
          { id: 'testatorCountry', label: 'Country', type: 'text', required: true },
          { id: 'testatorDOB', label: 'Date of Birth', type: 'date', required: true },
          { id: 'maritalStatus', label: 'Marital Status', type: 'select', required: true, options: [
            { value: 'single', label: 'Single' },
            { value: 'married', label: 'Married' },
            { value: 'divorced', label: 'Divorced' },
            { value: 'widowed', label: 'Widowed' },
          ]},
          { id: 'spouseName', label: 'Spouse Name', type: 'text', conditional: { field: 'maritalStatus', value: 'married' } },
        ],
      },
      {
        id: 'executor',
        title: 'Executor',
        description: 'Choose who will carry out your wishes.',
        fields: [
          { id: 'executorName', label: 'Executor Name', type: 'text', required: true, helpText: 'Person responsible for carrying out your will' },
          { id: 'executorAddress', label: 'Executor Address', type: 'textarea', required: true },
          { id: 'executorPhone', label: 'Executor Phone', type: 'phone' },
          { id: 'executorRelationship', label: 'Relationship to You', type: 'text', placeholder: 'e.g., Spouse, Child, Friend' },
          { id: 'alternateExecutorName', label: 'Alternate Executor Name', type: 'text', helpText: 'Backup if primary executor cannot serve' },
          { id: 'alternateExecutorAddress', label: 'Alternate Executor Address', type: 'textarea' },
        ],
      },
      {
        id: 'beneficiaries',
        title: 'Beneficiaries',
        description: 'Specify who will inherit your assets.',
        fields: [
          { id: 'residuaryBeneficiary', label: 'Primary Beneficiary for Residuary Estate', type: 'text', required: true, helpText: 'Receives everything not specifically given to others' },
          { id: 'residuaryRelationship', label: 'Relationship', type: 'text' },
          { id: 'residuaryPercentage', label: 'Percentage', type: 'number', required: true, placeholder: '100' },
          { id: 'alternateBeneficiary', label: 'Alternate Beneficiary', type: 'text', helpText: 'If primary cannot inherit' },
          { id: 'specificBequests', label: 'Specific Bequests', type: 'textarea', placeholder: 'List specific items and who should receive them:\n- My wedding ring to [Name]\n- My car to [Name]\n- $X to [Name/Charity]' },
        ],
      },
      {
        id: 'guardianship',
        title: 'Guardianship (if applicable)',
        description: 'If you have minor children, designate their guardian.',
        fields: [
          { id: 'hasMinorChildren', label: 'Do you have minor children?', type: 'checkbox' },
          { id: 'guardianName', label: 'Guardian Name', type: 'text', conditional: { field: 'hasMinorChildren', value: true }, helpText: 'Person to care for your minor children' },
          { id: 'guardianAddress', label: 'Guardian Address', type: 'textarea', conditional: { field: 'hasMinorChildren', value: true } },
          { id: 'guardianRelationship', label: 'Guardian Relationship', type: 'text', conditional: { field: 'hasMinorChildren', value: true } },
          { id: 'alternateGuardianName', label: 'Alternate Guardian Name', type: 'text', conditional: { field: 'hasMinorChildren', value: true } },
          { id: 'childrenNames', label: 'Names and Ages of Minor Children', type: 'textarea', conditional: { field: 'hasMinorChildren', value: true }, placeholder: 'List each child\'s name and date of birth' },
        ],
      },
      {
        id: 'final_wishes',
        title: 'Final Wishes',
        description: 'Additional instructions and preferences.',
        fields: [
          { id: 'funeralWishes', label: 'Funeral/Burial Wishes', type: 'select', options: [
            { value: 'burial', label: 'Traditional Burial' },
            { value: 'cremation', label: 'Cremation' },
            { value: 'donation', label: 'Body Donation to Science' },
            { value: 'no_preference', label: 'No Preference' },
          ]},
          { id: 'funeralInstructions', label: 'Specific Funeral Instructions', type: 'textarea', placeholder: 'Any specific wishes for your funeral or memorial...' },
          { id: 'debtsHandling', label: 'Instructions for Debts', type: 'textarea', placeholder: 'How should outstanding debts be handled?' },
          { id: 'digitalAssets', label: 'Digital Assets Instructions', type: 'textarea', placeholder: 'Instructions for email, social media, cryptocurrency, etc.' },
          { id: 'additionalWishes', label: 'Additional Wishes or Instructions', type: 'textarea' },
          { id: 'governingLaw', label: 'Governing Law (State)', type: 'text', required: true },
        ],
      },
    ],
    faq: [
      { question: 'Does a will need to be notarized?', answer: 'Requirements vary by state. Most states require two witnesses. Some accept or require notarization. Check your state\'s requirements.' },
      { question: 'Can I change my will later?', answer: 'Yes, you can create a new will or add a codicil (amendment). The new document should explicitly revoke previous versions.' },
      { question: 'What happens if I die without a will?', answer: 'Your assets will be distributed according to state intestacy laws, which may not align with your wishes.' },
    ],
    instructions: [
      'Sign in the presence of two witnesses (three in some states)',
      'Witnesses should not be beneficiaries',
      'Consider having the will notarized',
      'Store the original in a safe place and tell your executor where it is',
      'Review and update after major life events (marriage, divorce, birth, death)',
    ],
    disclaimer: 'This is a BASIC will template and may not address complex situations such as trusts, tax planning, or special needs beneficiaries. Estate planning laws vary significantly by state. STRONGLY RECOMMEND consulting with an estate planning attorney.',
  },
];

export function getFormTemplate(formType: string): FormTemplate | undefined {
  return formTemplates.find(t => t.id === formType);
}

export function getFormTemplatesByCategory(category: string): FormTemplate[] {
  return formTemplates.filter(t => t.category === category);
}
