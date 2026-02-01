import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

// Optional: keep Gemini as fallback if you set GEMINI_API_KEY
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Ollama settings
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:8b";
const OLLAMA_ENABLE = (process.env.OLLAMA_ENABLE || "false").toLowerCase() === "true";

type DocAnalysis = {
  category: string; // Business/Corporate | Property | Personal/Financial | Identity/Government | Legal/Court | General
  documentType: string;
  confidence: number; // 0-1
  rationale: string; // why it was classified this way
  summary: string;
  keyPoints: string[];
  risks: string[];
  recommendations: string[];
  analysis: string;
  indianLawRefs?: string[]; // optional, best-effort
};

const ANALYSIS_PROMPT = `You are an expert Indian legal document analyzer with deep knowledge of Indian laws and legal procedures.

Analyze the document carefully and return ONLY valid JSON (no markdown, no code fences) with this exact schema:
{
  "category": "Business/Corporate | Property | Personal/Financial | Identity/Government | Legal/Court | Consumer | Tax/Financial | General",
  "documentType": "specific document type like 'Non-Disclosure Agreement', 'Sale Deed', 'FIR Copy', etc.",
  "confidence": 0.0-1.0,
  "rationale": "2-3 sentences explaining why you classified it this way based on specific evidence in the text",
  "summary": "3-5 sentence comprehensive summary of the document's purpose, parties involved, and key terms",
  "keyPoints": ["extract 5-10 SPECIFIC, FACTUAL points found in THIS document with ACTUAL details: full dates (e.g., '15 January 2024'), exact amounts with currency (e.g., 'Rs. 5,00,000'), person/organization names, addresses, registration/case numbers, validity periods, important deadlines. DO NOT use generic statements. Each point must contain a concrete fact from the document."],
  "risks": ["identify 4-8 specific risks, red flags, or concerns found in THIS document based on what's actually written or missing"],
  "recommendations": ["provide 4-8 actionable recommendations specific to this document and its actual content"],
  "analysis": "detailed 3-5 sentence analysis covering important aspects, potential issues, and what the reader should pay attention to",
  "indianLawRefs": ["list relevant Indian laws/acts that apply - be accurate, don't hallucinate section numbers unless clearly stated in document"]
}

CRITICAL RULES FOR KEY POINTS:
✓ MUST extract ACTUAL specific details found in the document:
  - Full names of people/organizations (e.g., "Party A: John Smith, Party B: ABC Corporation Ltd.")
  - Complete dates with year (e.g., "Agreement Date: 15 March 2024")
  - Exact amounts with currency (e.g., "Consideration: Rs. 15,00,000/-")
  - Full addresses (e.g., "Property: Plot No. 123, Sector 45, Gurgaon, Haryana")
  - Registration/ID/Case numbers (e.g., "Registration No: 12345/2024")
  - Specific validity/expiry dates (e.g., "Valid till: 31 December 2025")
  - Percentages, timelines, deadlines found in document
✗ NEVER use generic placeholder statements like:
  - "Agreement between parties"
  - "Amount to be paid"
  - "Valid for certain period"
  - "Parties have obligations"
  - "Document contains terms"

DOCUMENT-SPECIFIC ANALYSIS:
1. Identity/Government documents (Aadhaar, PAN, Passport, Birth Certificate, Report Card):
   - Extract: Name, DOB, ID numbers, issue date, validity, issuing authority, address
   - DO NOT mention contract terms like termination/liability/indemnity
   - Focus on: verification status, validity, data accuracy, privacy concerns
   
2. Property documents (Sale Deed, Lease, Gift Deed):
   - Extract: Property address/description, parties' names, consideration amount, registration details, boundaries
   - Focus on: title clarity, encumbrances, stamp duty, registration, possession
   
3. Contracts (NDA, Employment, Service Agreement):
   - Extract: Party names, effective date, term/duration, key obligations, amounts/compensation
   - Focus on: obligations, term/duration, termination, confidentiality scope, liability, dispute resolution
   
4. Legal/Court documents:
   - Extract: Case number, parties, court name, filing date, next hearing date, relief sought
   - Focus on: case details, parties, relief sought, orders/directions, deadlines
   
5. Consumer documents (invoices, warranties):
   - Extract: Product/service name, invoice number, date, amount, seller details, warranty period
   - Focus on: product/service details, warranty terms, amounts, validity
   
6. Tax/Financial documents:
   - Extract: Assessment year, PAN, amounts, TDS details, filing dates
   - Focus on: income details, deductions, compliance dates, tax amounts

7. Educational documents (Report Cards, Certificates):
   - Extract: Student name, institution name, academic year, marks/grades, roll number, issue date
   - Focus on: academic performance, validity, institution details

8. Resume/CV documents:
   - Extract: Candidate name, email, phone, LinkedIn/GitHub, degree/university, years of experience, key skills, current/previous roles
   - Focus on: completeness of contact info, clarity of work history, quantifiable achievements, relevant skills
   - DO NOT treat CGPA/GPA (like 8.4/10 or 9.2/10) as dates
   - Key points should include: full name, contact details, education summary, experience summary, top skills

GENERAL RULES:
- Read the ENTIRE document before analyzing
- Be conservative with confidence scores - use 0.8+ only when very certain
- If document text is unclear or partial, acknowledge limitations but still extract what's available
- Every key point should answer: WHO, WHAT, WHEN, WHERE, HOW MUCH (as applicable)
- For resumes: DO NOT confuse CGPA/ratings (8.4/10) with dates`;

function clamp01(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function preprocessDocumentText(text: string): string {
  if (!text) return "";
  
  // Remove excessive whitespace while preserving structure
  let processed = text
    .replace(/\r\n/g, '\n')  // Normalize line endings
    .replace(/\t/g, ' ')      // Replace tabs with spaces
    .replace(/ {3,}/g, '  ')   // Reduce multiple spaces to double space
    .replace(/\n{4,}/g, '\n\n\n'); // Reduce excessive newlines
  
  // Remove common OCR/PDF artifacts
  processed = processed
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters
    .replace(/[^\x00-\x7F\u0900-\u097F]/g, (char) => {
      // Keep ASCII and Devanagari, replace other special chars
      const code = char.charCodeAt(0);
      if (code < 128 || (code >= 0x0900 && code <= 0x097F)) return char;
      return ' ';
    });
  
  // Improve structure detection
  processed = processed
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
    .replace(/(\d+)(st|nd|rd|th)/gi, '$1$2 ') // Normalize ordinals
    .replace(/([\d,]+)\s*\/\s*-/g, '$1/-') // Normalize Indian currency format
    .replace(/Rs\.?\s*/gi, 'Rs. '); // Normalize rupee symbol
  
  // Trim excessive whitespace at ends and ensure single space between words
  processed = processed
    .split('\n')
    .map(line => line.trim().replace(/\s+/g, ' '))
    .filter(line => line.length > 0)
    .join('\n');
  
  return processed.trim();
}

type TaxonomyResult = { category: string; documentType: string; confidence: number; rationale: string };

const TAXONOMY = [
  {
    category: "Identity/Government",
    type: "Birth Certificate",
    patterns: [/birth certificate/i, /certificate of birth/i, /register of births/i, /date of birth/i, /place of birth/i],
    rationale: "Contains birth registration fields like date/place of birth and certificate wording."
  },
  {
    category: "Identity/Government",
    type: "Aadhaar / UIDAI Document",
    patterns: [/aadhaar/i, /uidai/i, /unique identification/i, /vid/i, /enrolment id/i],
    rationale: "Mentions Aadhaar/UIDAI identifiers or enrolment/VID."
  },
  {
    category: "Identity/Government",
    type: "PAN Card / Income Tax ID",
    patterns: [/permanent account number/i, /pan/i, /income tax department/i],
    rationale: "Mentions PAN or Income Tax Department."
  },
  {
    category: "Identity/Government",
    type: "Passport / Passport Seva Document",
    patterns: [/passport/i, /passport seva/i, /psk/i, /appointment/i, /acknowledg(e)?ment/i],
    rationale: "Mentions passport/passport seva/PSK or appointment acknowledgement."
  },
  {
    category: "Business/Corporate",
    type: "Resume / Curriculum Vitae (CV)",
    patterns: [
      /\bresume\b/i, /curriculum vitae/i, /\bcv\b/i,
      /(professional\s+)?summary/i,
      /work\s+experience/i, /professional\s+experience/i, /employment\s+history/i,
      /(technical\s+)?skills/i, /core\s+competencies/i,
      /projects?/i,
      /education/i,
      /certifications?/i,
      /(phone|email|linkedin|github)/i,
      /objective/i,
      /career\s+(objective|goal)/i
    ],
    rationale: "Contains resume/CV sections like experience, skills, education, and contact information."
  },
  {
    category: "Identity/Government",
    type: "Educational Certificate / Report Card",
    patterns: [/report card/i, /marksheet/i, /mark\s*sheet/i, /marks\s*obtained/i, /class\s*(10|12|x|xii|1st|2nd|3rd|4th|5th|6th|7th|8th|9th)/i, /board/i, /cbse/i, /icse/i, /percentage/i, /grades?/i, /subjects?/i, /roll\s*no/i, /academic/i, /examination/i, /result/i],
    rationale: "Contains academic/marksheet/report card indicators."
  },
  {
    category: "Business/Corporate",
    type: "Non-Disclosure Agreement (NDA)",
    patterns: [/non[- ]?disclosure/i, /nda/i, /confidential information/i, /disclosing party/i, /receiving party/i],
    rationale: "Uses NDA-specific terms like confidential information/disclosing/receiving party."
  },
  {
    category: "Business/Corporate",
    type: "Memorandum of Association (MOA)",
    patterns: [/memorandum of association/i, /moa/i, /objects clause/i, /authorized share capital/i],
    rationale: "Mentions MOA or company objects/share capital terms."
  },
  {
    category: "Business/Corporate",
    type: "Articles of Association (AOA)",
    patterns: [/articles of association/i, /aoa/i, /board of directors/i, /share transfer/i],
    rationale: "Mentions AOA or internal governance terms."
  },
  {
    category: "Business/Corporate",
    type: "Partnership Deed",
    patterns: [/partnership deed/i, /partners?/i, /profit[- ]?sharing/i, /capital contribution/i],
    rationale: "Mentions partnership structure, profit sharing, partners."
  },
  {
    category: "Business/Corporate",
    type: "Employment Agreement / Offer Letter",
    patterns: [/employment/i, /employee/i, /employer/i, /ctc/i, /probation/i, /notice period/i, /joining/i],
    rationale: "Mentions employment terms like CTC/probation/notice period."
  },
  {
    category: "Property",
    type: "Sale Deed / Conveyance",
    patterns: [/sale deed/i, /conveyance/i, /consideration amount/i, /schedule of property/i, /vendor/i, /vendee/i],
    rationale: "Uses sale deed terminology and property schedule/consideration."
  },
  {
    category: "Property",
    type: "Lease Deed / Rent Agreement",
    patterns: [/lease deed/i, /rent agreement/i, /landlord/i, /tenant/i, /security deposit/i, /monthly rent/i],
    rationale: "Mentions rent/tenant/landlord/security deposit."
  },
  {
    category: "Property",
    type: "Gift Deed",
    patterns: [/gift deed/i, /donor/i, /donee/i],
    rationale: "Mentions gift deed donor/donee."
  },
  {
    category: "Property",
    type: "Mortgage Deed",
    patterns: [/mortgage deed/i, /mortgagor/i, /mortgagee/i],
    rationale: "Mentions mortgage deed parties."
  },
  {
    category: "Property",
    type: "Encumbrance Certificate",
    patterns: [/encumbrance certificate/i, /ec/i, /sub[- ]?registrar/i],
    rationale: "Mentions encumbrance certificate or registrar context."
  },
  {
    category: "Personal/Financial",
    type: "Will",
    patterns: [/will/i, /testator/i, /bequeath/i, /executor/i],
    rationale: "Mentions will/testator/bequeath/executor."
  },
  {
    category: "Personal/Financial",
    type: "Affidavit",
    patterns: [/affidavit/i, /sworn/i, /solemnly affirm/i, /deponent/i],
    rationale: "Mentions affidavit/sworn/deponent."
  },
  {
    category: "Personal/Financial",
    type: "Power of Attorney",
    patterns: [/power of attorney/i, /poa/i, /attorney[- ]?in[- ]?fact/i],
    rationale: "Mentions power of attorney/POA."
  },
  {
    category: "Personal/Financial",
    type: "Loan Agreement",
    patterns: [/loan agreement/i, /borrower/i, /lender/i, /interest rate/i, /repayment/i],
    rationale: "Mentions borrower/lender/interest/repayment."
  },
  {
    category: "Legal/Court",
    type: "Legal Notice",
    patterns: [/legal notice/i, /hereby call upon/i, /within \d+ days/i, /cause of action/i],
    rationale: "Uses legal notice phrasing and demand timelines."
  },
  {
    category: "Legal/Court",
    type: "Court Order / Judgment",
    patterns: [/judgment/i, /order/i, /hon'?ble/i, /petitioner/i, /respondent/i, /bench/i],
    rationale: "Mentions court/judgment/order, petitioner/respondent."
  },
  {
    category: "Legal/Court",
    type: "FIR / Police Complaint",
    patterns: [/fir/i, /first information report/i, /police station/i, /complainant/i, /accused/i, /ipc/i, /section \d+/i],
    rationale: "Contains FIR/police complaint terminology."
  },
  {
    category: "Legal/Court",
    type: "Bail Application / Order",
    patterns: [/bail/i, /anticipatory bail/i, /regular bail/i, /surety/i, /crpc/i],
    rationale: "Mentions bail application terms."
  },
  {
    category: "Consumer",
    type: "Consumer Complaint",
    patterns: [/consumer complaint/i, /consumer forum/i, /deficiency in service/i, /unfair trade/i, /consumer protection/i],
    rationale: "Contains consumer complaint/forum terminology."
  },
  {
    category: "Consumer",
    type: "Invoice / Bill",
    patterns: [/invoice/i, /bill/i, /tax invoice/i, /gstin/i, /gst/i, /total amount/i, /payment due/i],
    rationale: "Contains invoice/billing terminology."
  },
  {
    category: "Consumer",
    type: "Warranty Document",
    patterns: [/warranty/i, /guarantee/i, /warranty period/i, /manufacturing defect/i, /repair/i, /replacement/i],
    rationale: "Contains warranty/guarantee terms."
  },
  {
    category: "Tax/Financial",
    type: "Income Tax Return / Form 16",
    patterns: [/form 16/i, /itr/i, /income tax return/i, /assessment year/i, /tds/i, /total income/i],
    rationale: "Contains income tax/Form 16 terminology."
  },
  {
    category: "Tax/Financial",
    type: "GST Document",
    patterns: [/gst/i, /gstin/i, /cgst/i, /sgst/i, /igst/i, /gstr/i, /input tax credit/i],
    rationale: "Contains GST-related terminology."
  },
  {
    category: "Tax/Financial",
    type: "Bank Statement / Financial Record",
    patterns: [/bank statement/i, /account statement/i, /credit/i, /debit/i, /balance/i, /transaction/i, /ifsc/i],
    rationale: "Contains bank/financial statement terminology."
  },
  {
    category: "Identity/Government",
    type: "Driving License",
    patterns: [/driving licen[cs]e/i, /rto/i, /motor vehicle/i, /validity/i, /license number/i],
    rationale: "Contains driving license terminology."
  },
  {
    category: "Identity/Government",
    type: "Voter ID / EPIC",
    patterns: [/voter id/i, /epic/i, /election commission/i, /elector/i, /electoral roll/i],
    rationale: "Contains voter ID/election terminology."
  },
  {
    category: "Identity/Government",
    type: "Ration Card",
    patterns: [/ration card/i, /public distribution/i, /pds/i, /food security/i, /bpl/i, /apl/i],
    rationale: "Contains ration card/PDS terminology."
  },
  {
    category: "Business/Corporate",
    type: "Service Agreement",
    patterns: [/service agreement/i, /service provider/i, /scope of work/i, /deliverables/i, /sla/i],
    rationale: "Contains service agreement terminology."
  },
  {
    category: "Business/Corporate",
    type: "Franchise Agreement",
    patterns: [/franchise/i, /franchisee/i, /franchisor/i, /royalty/i, /territory/i],
    rationale: "Contains franchise agreement terminology."
  },
  {
    category: "Personal/Financial",
    type: "Insurance Policy",
    patterns: [/insurance policy/i, /premium/i, /sum assured/i, /policyholder/i, /nominee/i, /claim/i],
    rationale: "Contains insurance policy terminology."
  },
  {
    category: "Personal/Financial",
    type: "Promissory Note",
    patterns: [/promissory note/i, /promise to pay/i, /principal amount/i, /payee/i, /maker/i],
    rationale: "Contains promissory note terminology."
  },
  {
    category: "Property",
    type: "Power of Attorney (Property)",
    patterns: [/power of attorney/i, /poa/i, /attorney/i, /immovable property/i, /authorize/i],
    rationale: "Contains property POA terminology."
  },
  {
    category: "Property",
    type: "Partition Deed",
    patterns: [/partition deed/i, /partition/i, /joint family/i, /coparcener/i, /share/i],
    rationale: "Contains partition deed terminology."
  },
  {
    category: "Property",
    type: "Release Deed",
    patterns: [/release deed/i, /relinquish/i, /release/i, /right title interest/i],
    rationale: "Contains release deed terminology."
  },
  {
    category: "Identity/Government",
    type: "Medical Certificate / Prescription",
    patterns: [/medical certificate/i, /prescription/i, /diagnosed/i, /patient/i, /doctor/i, /physician/i, /treatment/i, /medication/i, /hospital/i, /clinic/i],
    rationale: "Contains medical/health terminology."
  },
  {
    category: "Business/Corporate",
    type: "Purchase Order / Work Order",
    patterns: [/purchase order/i, /work order/i, /po\s*number/i, /wo\s*number/i, /order\s*date/i, /delivery\s*date/i, /quantity/i, /unit\s*price/i],
    rationale: "Contains purchase/work order terminology."
  },
  {
    category: "Consumer",
    type: "Receipt / Payment Receipt",
    patterns: [/receipt/i, /payment\s*received/i, /received\s*from/i, /paid\s*amount/i, /transaction\s*id/i, /payment\s*mode/i],
    rationale: "Contains receipt/payment terminology."
  },
  {
    category: "Legal/Court",
    type: "Affidavit for Court / Legal Affidavit",
    patterns: [/affidavit/i, /sworn\s*statement/i, /before\s*the\s*court/i, /hon'?ble\s*court/i, /judicial\s*magistrate/i],
    rationale: "Contains legal affidavit terminology with court context."
  },
  {
    category: "Identity/Government",
    type: "Domicile Certificate",
    patterns: [/domicile\s*certificate/i, /resident\s*of/i, /permanent\s*resident/i, /residing\s*since/i],
    rationale: "Contains domicile certificate terminology."
  },
  {
    category: "Identity/Government",
    type: "Caste Certificate",
    patterns: [/caste\s*certificate/i, /sc\s*certificate/i, /st\s*certificate/i, /obc\s*certificate/i, /belongs\s*to\s*caste/i],
    rationale: "Contains caste certificate terminology."
  },
  {
    category: "Identity/Government",
    type: "Income Certificate",
    patterns: [/income\s*certificate/i, /annual\s*income/i, /family\s*income/i, /income\s*from\s*all\s*sources/i],
    rationale: "Contains income certificate terminology."
  },
  {
    category: "Personal/Financial",
    type: "Cheque",
    patterns: [/cheque/i, /check/i, /pay\s*to\s*the\s*order\s*of/i, /bearer/i, /ifsc\s*code/i, /micr\s*code/i, /cheque\s*number/i],
    rationale: "Contains cheque/check terminology."
  }
] as const;

function classifyWithTaxonomy(documentText: string): TaxonomyResult {
  const text = String(documentText || "");
  const hits: { category: string; type: string; score: number; rationale: string }[] = [];

  for (const entry of TAXONOMY) {
    let score = 0;
    for (const pat of entry.patterns) {
      if (pat.test(text)) score += 1;
    }
    if (score > 0) {
      hits.push({ category: entry.category, type: entry.type, score, rationale: entry.rationale });
    }
  }

  if (!hits.length) {
    return { category: "General", documentType: "Legal Document (General)", confidence: 0.35, rationale: "No strong taxonomy match; treating as general." };
  }

  hits.sort((a, b) => b.score - a.score);
  const top = hits[0];
  // confidence heuristic: more pattern hits => higher confidence
  const confidence = clamp01(0.55 + Math.min(0.35, top.score * 0.12));
  return { category: top.category, documentType: top.type, confidence, rationale: top.rationale };
}

function buildCategoryGuidance(category: string, documentType: string): { risksFocus: string; recsFocus: string; lawRefsHint: string } {
  // Special handling for Resume/CV
  if (/resume|curriculum vitae|cv/i.test(documentType)) {
    return {
      risksFocus: "Focus on missing contact information, unclear job titles/dates, unexplained gaps, typos/formatting issues, privacy concerns with personal data.",
      recsFocus: "Recommend adding quantifiable achievements, clarifying dates/timelines, tailoring to job description, proofreading, removing sensitive personal info like Aadhaar/PAN.",
      lawRefsHint: "Not applicable for resumes."
    };
  }
  
  switch (category) {
    case "Identity/Government":
      return {
        risksFocus: "Focus on mismatches, missing issuer/registration details, validity, privacy/data exposure, verification steps. Avoid contract boilerplate.",
        recsFocus: "Recommend verification, corrections via authority, masking sensitive fields, and safe sharing practices.",
        lawRefsHint: "If relevant, mention privacy/data handling at a high level; avoid inventing section numbers."
      };
    case "Property":
      return {
        risksFocus: "Focus on title defects, encumbrances, stamp duty/registration, possession, boundaries/schedule, consideration, witnesses.",
        recsFocus: "Recommend EC check, registration/stamp duty compliance, due diligence, mutation, and clause clarifications.",
        lawRefsHint: "Best-effort: Registration Act, Stamp Act, Transfer of Property Act (without hallucinating sections)."
      };
    case "Business/Corporate":
      return {
        risksFocus: "For contracts: scope, term/survival, liability, indemnity, IP, governing law, dispute resolution. For MOA/AOA: compliance and governance.",
        recsFocus: "Recommend clearer definitions, caps, compliant governance, and dispute resolution clarity.",
        lawRefsHint: "Best-effort: Indian Contract Act, Companies Act, Arbitration & Conciliation Act (avoid section hallucinations)."
      };
    case "Personal/Financial":
      return {
        risksFocus: "Focus on capacity, witnesses, notarization, ambiguity, repayment/interest, enforceability, jurisdiction.",
        recsFocus: "Recommend notarization/registration where needed, clearer terms, and dispute mechanisms.",
        lawRefsHint: "Best-effort: Indian Contract Act, Succession Act (for wills) (avoid sections unless sure)."
      };
    case "Legal/Court":
      return {
        risksFocus: "Focus on parties, relief sought/granted, deadlines, compliance, next hearing, consequences of non-compliance.",
        recsFocus: "Recommend tracking timelines, obtaining certified copies, and legal counsel steps.",
        lawRefsHint: "Avoid hallucinating. Mention procedural laws generally if needed."
      };
    case "Consumer":
      return {
        risksFocus: "Focus on product/service defects, warranty validity, complaint timelines, documentation of issues, refund/replacement eligibility.",
        recsFocus: "Recommend preserving invoices/bills, filing complaint within time limits, escalation steps, consumer forum approach.",
        lawRefsHint: "Consumer Protection Act 2019, relevant warranty terms."
      };
    case "Tax/Financial":
      return {
        risksFocus: "Focus on accuracy of income/deductions, TDS compliance, filing deadlines, discrepancies, audit risks.",
        recsFocus: "Recommend verification against Form 26AS, timely filing, keeping supporting documents, consulting CA if discrepancies.",
        lawRefsHint: "Income Tax Act, GST Act as applicable."
      };
    default:
      return {
        risksFocus: "Keep analysis generic and cautious; request more context if needed.",
        recsFocus: "Recommend human legal review for high-stakes decisions.",
        lawRefsHint: "Avoid citations if unsure."
      };
  }
}

function stripCodeFences(s: string) {
  return s.replace(/```json\s*/gi, "```").replace(/```/g, "").trim();
}

function extractFirstJson(text: string): any | null {
  const cleaned = stripCodeFences(String(text || ""));
  // Try full parse first
  try {
    return JSON.parse(cleaned);
  } catch {}
  // Fallback: substring between first { and last }
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const candidate = cleaned.slice(start, end + 1);
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}

function toStringSafe(v: any): string {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v)) return v.map(toStringSafe).filter(Boolean).join(" ");
  try { return String(v).trim(); } catch { return ""; }
}

function toStringArray(v: any): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map(toStringSafe).filter(Boolean);
  const s = toStringSafe(v);
  if (!s) return [];
  return s.split(/\n|•|\r|\t|\-/g).map(x => x.trim()).filter(Boolean).slice(0, 12);
}

function buildResumeAnalysis(tax: TaxonomyResult, guide: ReturnType<typeof buildCategoryGuidance>, keyPoints: string[], text: string): DocAnalysis {
  const risks: string[] = [
    "Contact information may be incomplete (missing email/phone/LinkedIn)",
    "Dates and timelines should be clearly specified for each role/education",
    "Achievements should be quantified with metrics where possible",
    "Generic objectives/summaries may not stand out to recruiters"
  ];
  
  const recommendations: string[] = [
    "Use action verbs and quantify achievements (e.g., 'Increased sales by 30%')",
    "Tailor resume to specific job descriptions and highlight relevant skills",
    "Ensure consistent formatting and no typos/grammatical errors",
    "Include links to portfolio/GitHub/LinkedIn to showcase work",
    "Remove sensitive personal information like Aadhaar/PAN numbers",
    "Keep resume concise (1-2 pages) and use clear section headings"
  ];
  
  // Check for common issues
  if (!text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
    risks.push("Email address not found - essential for recruiters to contact you");
  }
  if (!text.match(/(?:\+91[\s-]?)?[6-9]\d{9}/)) {
    risks.push("Phone number not found or unclear");
  }
  if (!text.match(/linkedin\.com/i) && !text.match(/github\.com/i)) {
    recommendations.push("Consider adding LinkedIn or GitHub profile for professional presence");
  }
  
  return {
    category: tax.category,
    documentType: tax.documentType,
    confidence: Math.min(0.95, tax.confidence + 0.15),
    rationale: tax.rationale,
    summary: `Professional resume/CV detected. Document appears to be a job application resume with candidate information, work experience, education, and skills. Focus on ensuring completeness, clarity, and relevance to target positions.`,
    keyPoints: keyPoints.slice(0, 10),
    risks,
    recommendations,
    analysis: "Resume structure detected. Ensure all sections (contact, experience, education, skills) are complete and well-formatted. Quantify achievements, use action verbs, and tailor content to target roles. Remove any sensitive personal identifiers.",
    indianLawRefs: ["Not applicable for resumes/CVs"]
  };
}

function heuristic(documentText: string): DocAnalysis {
  const tax = classifyWithTaxonomy(documentText);
  const guide = buildCategoryGuidance(tax.category, tax.documentType);

  // Improved key points extraction with actual details
  const text = String(documentText || "");
  const keyPoints: string[] = [];
  
  // Special handling for Resume/CV
  const isResume = /resume|curriculum vitae|cv/i.test(tax.documentType);
  if (isResume) {
    // Extract name (usually at the top)
    const nameMatch = text.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/m);
    if (nameMatch) keyPoints.push(`Candidate: ${nameMatch[1]}`);
    
    // Extract contact info
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
    if (emailMatch) keyPoints.push(`Email: ${emailMatch[0]}`);
    
    const phoneMatch = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}/i);
    if (phoneMatch) keyPoints.push(`Phone: ${phoneMatch[0]}`);
    
    // Extract LinkedIn/GitHub
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
    if (linkedinMatch) keyPoints.push(`LinkedIn: ${linkedinMatch[0]}`);
    
    const githubMatch = text.match(/github\.com\/[\w-]+/i);
    if (githubMatch) keyPoints.push(`GitHub: ${githubMatch[0]}`);
    
    // Extract education
    const educationMatch = text.match(/(?:B\.?Tech|M\.?Tech|B\.?E\.?|M\.?E\.?|B\.?Sc|M\.?Sc|BCA|MCA|MBA)(?:[^\n]{0,100})/i);
    if (educationMatch) keyPoints.push(`Education: ${educationMatch[0].trim().slice(0, 80)}`);
    
    // Extract years of experience
    const expMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?experience/i);
    if (expMatch) keyPoints.push(`Experience: ${expMatch[0]}`);
    
    // Extract skills section highlights
    const skillsSection = text.match(/(?:skills|technologies|technical skills)[:\s]*([^\n]{50,200})/i);
    if (skillsSection) keyPoints.push(`Skills: ${skillsSection[1].trim().slice(0, 100)}`);
    
    // If we have good resume data, return early
    if (keyPoints.length >= 4) {
      return buildResumeAnalysis(tax, guide, keyPoints, text);
    }
  }
  
  // Extract dates (various formats) - exclude CGPA patterns
  const datePattern = /(?<!\d\.)\b(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{2,4})\b(?!\/10)/gi;
  const dates = text.match(datePattern);
  if (dates && dates.length > 0) {
    // Filter out patterns that look like CGPA or ratings (e.g., 8.4/10)
    const validDates = dates.filter(d => !/(\d\.\d|\d{1,2}\/10|cgpa|gpa)/i.test(d));
    const uniqueDates = [...new Set(validDates.slice(0, 3))];
    uniqueDates.forEach(date => keyPoints.push(`Date mentioned: ${date}`));
  }
  
  // Extract amounts (Indian currency format)
  const amountPattern = /(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{2})?(?:\/-)?)|(?:amount|sum|consideration|price|value|payment|salary|compensation)\s*(?:of|:|is)?\s*(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d{2})?)/gi;
  const amounts = text.match(amountPattern);
  if (amounts && amounts.length > 0) {
    const uniqueAmounts = [...new Set(amounts.slice(0, 3))];
    uniqueAmounts.forEach(amt => keyPoints.push(`Amount: ${amt.trim()}`));
  }
  
  // Extract names (capitalized words after common markers)
  const namePattern = /(?:name|party|between|applicant|respondent|plaintiff|defendant|owner|tenant|employee|employer|vendor|purchaser|donor|donee)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/g;
  let nameMatch: RegExpExecArray | null;
  while ((nameMatch = namePattern.exec(text)) !== null && keyPoints.length < 10) {
    const matchedName = nameMatch[1];
    if (matchedName && !keyPoints.some(p => p.includes(matchedName))) {
      keyPoints.push(`Party/Person: ${matchedName}`);
    }
  }
  
  // Extract IDs/Numbers
  const idPattern = /(?:registration|case|application|policy|invoice|bill|pan|aadhaar|passport|license|voter|epic|roll)\s*(?:no\.?|number)?\s*:?\s*([A-Z0-9\/-]+)/gi;
  let idMatch: RegExpExecArray | null;
  while ((idMatch = idPattern.exec(text)) !== null && keyPoints.length < 12) {
    if (idMatch[1] && idMatch[1].length >= 4) {
      keyPoints.push(`ID/Number: ${idMatch[0].trim()}`);
    }
  }
  
  // Extract addresses (common address patterns)
  const addressPattern = /(?:address|property|located|situated)\s*:?\s*([A-Z][\w\s,.-]+(?:Block|Plot|House|Flat|Sector|Road|Street|Area|City|District|State|Pin|Pincode)[\w\s,.-]{10,100})/gi;
  const addresses = text.match(addressPattern);
  if (addresses && addresses.length > 0 && keyPoints.length < 12) {
    keyPoints.push(`Address: ${addresses[0].trim().slice(0, 100)}`);
  }
  
  // Extract validity/expiry
  const validityPattern = /(?:valid|expiry|expires?|validity period|valid till|valid from|valid upto)\s*:?\s*([\d\s\w,.-]+)/gi;
  const validity = text.match(validityPattern);
  if (validity && validity.length > 0) {
    keyPoints.push(`Validity: ${validity[0].trim()}`);
  }
  
  // If still not enough points, extract important looking lines
  if (keyPoints.length < 4) {
    const lines = text
      .split(/\n+/)
      .map(l => l.trim())
      .filter(l => l.length >= 20 && l.length <= 150)
      .filter(l => /:|\d|[A-Z]/.test(l)); // Lines with structure
    
    lines.slice(0, 6 - keyPoints.length).forEach(line => {
      if (!keyPoints.some(p => p.includes(line.slice(0, 30)))) {
        keyPoints.push(line);
      }
    });
  }

  // Category-specific risks/recommendations templates
  let risks: string[] = [];
  let recommendations: string[] = [];
  let summary = "";
  let analysis = "";
  let indianLawRefs: string[] = [];

  if (tax.category === "Identity/Government") {
    summary = `Detected an identity/government document (${tax.documentType}). Main value is verification of facts/fields rather than contractual clauses.`;
    risks = [
      "Mismatch in name/DOB/address/parent details can cause rejection in official processes",
      "Missing issuer/registration number/authority details may reduce acceptability",
      "Sharing full document publicly can create privacy/identity theft risk"
    ];
    recommendations = [
      "Cross-check key fields against other IDs/records before submission",
      "If any field is incorrect, request correction through the issuing authority/portal",
      "Mask/redact sensitive IDs (full numbers, QR) when sharing screenshots"
    ];
    analysis = `Use official verification methods where available (QR/portal/authority). ${guide.risksFocus}`;
    indianLawRefs = ["Best practice: follow issuing authority verification; protect personal data when sharing."];
  } else if (tax.category === "Property") {
    summary = `Detected a property document (${tax.documentType}). Focus on title, encumbrances, registration, and property schedule details.`;
    risks = [
      "Title defects or unclear ownership history can invalidate transfer",
      "Encumbrances/charges/litigation may exist if due diligence is incomplete",
      "Stamp duty/registration non-compliance can affect enforceability"
    ];
    recommendations = [
      "Obtain and review Encumbrance Certificate (EC) and title chain documents",
      "Verify stamp duty and registration status with the Sub-Registrar office",
      "Confirm property schedule/boundaries/possession clauses match reality"
    ];
    analysis = `${guide.risksFocus} ${guide.lawRefsHint}`;
    indianLawRefs = ["Registration Act (general)", "Indian Stamp Act / State Stamp laws (general)", "Transfer of Property Act (general)"];
  } else if (tax.category === "Business/Corporate") {
    summary = `Detected a business/corporate document (${tax.documentType}). Focus on obligations, term, liability, and dispute resolution where applicable.`;
    risks = [
      "Ambiguous definitions/scope can create disputes or over-broad obligations",
      "Missing/unclear term, termination, or survival clauses can create uncertainty",
      "Liability/indemnity and dispute resolution clauses may be unfavorable if not clearly limited"
    ];
    recommendations = [
      "Clarify scope/definitions, permitted disclosures, and exceptions (if contract/NDA)",
      "Add/confirm term, termination, and survival clauses appropriate to the document",
      "Define liability caps/indemnity scope and set clear dispute resolution (seat/venue)"
    ];
    analysis = `${guide.risksFocus} ${guide.lawRefsHint}`;
    indianLawRefs = ["Indian Contract Act (general)", "Companies Act (if MOA/AOA/Corporate)", "Arbitration & Conciliation Act (general)"];
  } else if (tax.category === "Personal/Financial") {
    summary = `Detected a personal/financial document (${tax.documentType}). Focus on clarity, witnesses/notarization, enforceability, and repayment/rights.`;
    risks = [
      "Ambiguous wording or missing witness/notarization details can reduce enforceability",
      "Unclear repayment/interest/penalty terms can cause disputes (for loans)",
      "Authority/consent issues can invalidate the document (POA/affidavit)"
    ];
    recommendations = [
      "Ensure names/IDs/addresses are accurate and consistent across records",
      "Use witnesses/notarization/registration where required or standard practice",
      "Clarify key obligations, timelines, and dispute resolution"
    ];
    analysis = `${guide.risksFocus} ${guide.lawRefsHint}`;
    indianLawRefs = ["Indian Contract Act (general)", "Succession Act (for wills, general)"];
  } else if (tax.category === "Legal/Court") {
    summary = `Detected a legal/court document (${tax.documentType}). Focus on parties, relief, directions, deadlines, and next steps.`;
    risks = [
      "Missing deadlines/next hearing dates can cause non-compliance issues",
      "Misinterpreting relief/directions can lead to adverse consequences",
      "Incomplete annexures/records can weaken compliance or appeals"
    ];
    recommendations = [
      "Extract and track all deadlines, directions, and next hearing dates",
      "Keep certified copies and supporting annexures organized",
      "Consult a qualified advocate for interpretation and compliance"
    ];
    analysis = `${guide.risksFocus}`;
    indianLawRefs = ["Procedural compliance depends on forum; avoid relying on summaries for legal action."];
  } else if (tax.category === "Consumer") {
    summary = `Detected a consumer document (${tax.documentType}). Focus on product/service details, warranty terms, and complaint timelines.`;
    risks = [
      "Warranty may have expired or specific conditions may not be met",
      "Missing original invoice/bill can weaken consumer complaint",
      "Complaint time limits under Consumer Protection Act may apply",
      "Defect documentation (photos, records) may be insufficient for claim"
    ];
    recommendations = [
      "Preserve original invoice, warranty card, and all purchase receipts",
      "Document defects with photos, videos, and written records",
      "File complaint within prescribed time limits (typically 2 years from cause of action)",
      "Consider approaching Consumer Forum if seller/manufacturer doesn't respond"
    ];
    analysis = `${guide.risksFocus} ${guide.lawRefsHint}`;
    indianLawRefs = ["Consumer Protection Act 2019 (general)", "E-Commerce Rules 2020 (for online purchases)"];
  } else if (tax.category === "Tax/Financial") {
    summary = `Detected a tax/financial document (${tax.documentType}). Focus on accuracy, compliance, and supporting documentation.`;
    risks = [
      "Discrepancies between declared income and Form 26AS can trigger scrutiny",
      "Missing deduction proofs can lead to disallowance and additional tax liability",
      "Filing deadline misses can result in penalties and interest",
      "GST input credit mismatches can cause compliance issues"
    ];
    recommendations = [
      "Cross-verify income details with Form 26AS/AIS before filing",
      "Keep supporting documents for all claimed deductions (80C, 80D, HRA, etc.)",
      "File returns within due dates to avoid penalties",
      "Consult a Chartered Accountant for complex tax situations"
    ];
    analysis = `${guide.risksFocus} ${guide.lawRefsHint}`;
    indianLawRefs = ["Income Tax Act 1961 (general)", "GST Act 2017 (for GST documents)", "Tax Procedure Rules (general)"];
  } else {
    summary = "Document type is unclear; providing a cautious general analysis.";
    risks = ["Insufficient context may lead to incorrect interpretation", "Missing issuer/party details may reduce enforceability/acceptability"];
    recommendations = ["Share full text (mask sensitive numbers) for better accuracy", "Seek legal review for high-stakes decisions"];
    analysis = "General analysis only. Provide clearer text for classification.";
  }

  // Improve keyPoints if empty
  const finalKeyPoints = keyPoints.length ? keyPoints : ["Provide the full document text for better extraction."];

  return {
    category: tax.category,
    documentType: tax.documentType,
    confidence: tax.confidence,
    rationale: tax.rationale,
    summary,
    keyPoints: finalKeyPoints,
    risks,
    recommendations,
    analysis,
    indianLawRefs
  };
}



function looksLikeNdaBoilerplate(lines: string[]): boolean {
  const joined = lines.join(" ").toLowerCase();
  return /(termination|survival clause|indemn|liability|confidentiality obligations|permitted disclosures|nda)/.test(joined);
}

function isContractLikeText(documentText: string): boolean {
  const t = documentText.toLowerCase();
  return /(agreement|hereby|party|parties|whereas|consideration|confidential|non[- ]?disclosure|indemn|liability|termination|arbitration|jurisdiction)/.test(t);
}

function sanitizeNonContract(out: DocAnalysis, documentText: string): DocAnalysis {
  const t = documentText.toLowerCase();

  // Detect non-contract / certificate / application style docs
  const nonContractByText =
    /(birth certificate|passport seva|application|appointment|psk|acknowledg(e)?ment|certificate|marks|report card|school|uidai|aadhaar|pan card|income tax department)/.test(t);

  const nonContractByType =
    /(birth certificate|passport seva|application|certificate|report card|marksheet|aadhaar|pan)/i.test(out.documentType);

  // If LLM calls it NDA but text is clearly not contract-like, override using heuristic
  if (/nda|non-?disclosure/i.test(out.documentType) && (nonContractByText && !isContractLikeText(documentText))) {
    return heuristic(documentText);
  }

  // If it's non-contract, remove NDA boilerplate risks/recs
  if (nonContractByText || nonContractByType) {
    const bad = /(termination|survival|indemn|liability|confidentiality obligations|permitted disclosures|nda)/i;

    const filteredRisks = (out.risks || []).filter((x) => !bad.test(x));
    const filteredRecs = (out.recommendations || []).filter((x) => !bad.test(x));

    // If model produced NDA boilerplate, swap to heuristic risks/recs for that doc type
    if (looksLikeNdaBoilerplate(out.risks || []) || looksLikeNdaBoilerplate(out.recommendations || [])) {
      const h = heuristic(documentText);
      return {
        ...out,
        documentType: out.documentType && !/nda/i.test(out.documentType) ? out.documentType : h.documentType,
        summary: out.summary || h.summary,
        keyPoints: (out.keyPoints && out.keyPoints.length) ? out.keyPoints : h.keyPoints,
        risks: (filteredRisks.length ? filteredRisks : h.risks),
        recommendations: (filteredRecs.length ? filteredRecs : h.recommendations),
        analysis: out.analysis || h.analysis,
        indianLawRefs: h.indianLawRefs
      };
    }

    // Otherwise keep but ensure not empty
    const h = heuristic(documentText);
    return {
      ...out,
      risks: filteredRisks.length ? filteredRisks : h.risks,
      recommendations: filteredRecs.length ? filteredRecs : h.recommendations
    };
  }

  return out;
}

function normalizeAnalysis(raw: any, documentText: string): DocAnalysis {
  const h = heuristic(documentText);
  const category = toStringSafe(raw?.category) || h.category;
  const docType = toStringSafe(raw?.documentType) || h.documentType;
  const confidence = Number.isFinite(raw?.confidence) ? Number(raw.confidence) : h.confidence;
  const rationale = toStringSafe(raw?.rationale) || h.rationale;
  const summary = toStringSafe(raw?.summary) || h.summary;
  const keyPoints = toStringArray(raw?.keyPoints);
  const risks = toStringArray(raw?.risks);
  const recommendations = toStringArray(raw?.recommendations);
  const analysis = toStringSafe(raw?.analysis) || toStringSafe(raw?.detailedAnalysis) || h.analysis;
  const indianLawRefs = Array.isArray(raw?.indianLawRefs) ? raw.indianLawRefs.map(toStringSafe).filter(Boolean).slice(0, 10) : h.indianLawRefs;
  const out: DocAnalysis = {
    category,
    documentType: docType,
    confidence: clamp01(confidence),
    rationale,
    summary,
    keyPoints: keyPoints.length ? keyPoints : h.keyPoints,
    risks: risks.length ? risks : h.risks,
    recommendations: recommendations.length ? recommendations : h.recommendations,
    analysis
  };

  // If model did not provide category/type confidently, apply taxonomy
const tax = classifyWithTaxonomy(documentText);
if (!out.category) out.category = tax.category;
if (!out.documentType) out.documentType = tax.documentType;
if (typeof out.confidence !== "number") out.confidence = tax.confidence;
out.confidence = clamp01(out.confidence);
if (!out.rationale) out.rationale = tax.rationale;

return sanitizeNonContract(out, documentText);

}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function callOllama(documentText: string): Promise<DocAnalysis> {
  const timeoutMs = 120000; // 2 minutes timeout for complex documents
  const res = await fetchWithTimeout(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      stream: false,
      messages: [
        { role: "system", content: ANALYSIS_PROMPT },
        { role: "user", content: documentText }
      ],
      options: { temperature: 0.2, num_predict: 2048 }
    }),
  }, timeoutMs);

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Ollama error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const content = data?.message?.content || data?.response || "";
  const parsed = extractFirstJson(String(content));
  if (!parsed) throw new Error("Ollama did not return valid JSON");
  return normalizeAnalysis(parsed, documentText);
}

async function callGemini(documentText: string): Promise<DocAnalysis> {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(`${ANALYSIS_PROMPT}\n\nDOCUMENT:\n${documentText}`);
  const text = result.response.text();
  const parsed = extractFirstJson(text);
  if (!parsed) throw new Error("Gemini did not return valid JSON");
  return normalizeAnalysis(parsed, documentText);
}

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.toLowerCase();

  let rawText = "";
  
  if (fileName.endsWith(".pdf")) {
    const data = await pdfParse(buffer);
    rawText = data.text || "";
  } else if (fileName.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer });
    rawText = result.value || "";
  } else {
    // default to text
    rawText = buffer.toString("utf-8");
  }
  
  // Preprocess the extracted text
  return preprocessDocumentText(rawText);
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let documentText = "";
    let fileName: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      fileName = file.name;
      documentText = await extractTextFromFile(file);
    } else {
      const body = await req.json().catch(() => ({}));
      documentText = preprocessDocumentText(String(body?.text || ""));
    }

    if (!documentText || documentText.trim().length < 30) {
      return NextResponse.json({ error: "Document text is too short" }, { status: 400 });
    }

    // Prefer Ollama local LLaMA, fallback to Gemini if configured, else fallback deterministic
    let analysis: DocAnalysis | null = null;
    const warnings: string[] = [];
    let engineUsed: 'ollama' | 'gemini' | 'fallback' = 'fallback';

    if (OLLAMA_ENABLE) {
      try {
        analysis = await callOllama(documentText);
        engineUsed = 'ollama';
      } catch (e: any) {
        warnings.push(`Ollama failed: ${e?.message ?? "unknown"}`);
      }
    }

    if (!analysis) {
      try {
        analysis = await callGemini(documentText);
        engineUsed = 'gemini';
        warnings.push("Used Gemini fallback.");
      } catch (e: any) {
        warnings.push(`Gemini fallback failed: ${e?.message ?? "unknown"}`);
      }
    }

    if (!analysis) {
      // last fallback: simple heuristic response
      analysis = heuristic(documentText);
      engineUsed = 'fallback';
      warnings.push('LLM unavailable: used heuristic fallback.');
    }

    return NextResponse.json({
      ok: true,
      fileName,
      result: analysis,
      warnings: warnings.length ? warnings : undefined,
      engine: engineUsed
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to analyze document" },
      { status: 500 }
    );
  }
}


export async function GET() {
  return NextResponse.json({
    ok: true,
    engine: 'sample',
    result: {
      documentType: 'Sample NDA',
      summary: 'Sample response from backend. If you see this, routing works.',
      keyPoints: ['Point A', 'Point B'],
      risks: ['Risk A'],
      recommendations: ['Add termination clause'],
      analysis: 'Detailed analysis sample.'
    }
  });
}
