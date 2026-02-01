export type KyrCategory =
  | "POLICE"
  | "FIR"
  | "CYBER"
  | "WOMEN"
  | "TENANCY"
  | "WORKPLACE"
  | "CONSUMER"
  | "GENERAL";

export interface KyrHelpline {
  id: string;
  name: string;
  number: string;
  category: KyrCategory;
  availability?: string; // e.g., 24x7
  notes?: string;
  state?: string; // optional: "TN", "TS", etc.
}

export interface KyrLegalProvision {
  id: string;
  act: string;          // e.g., "Constitution of India"
  section: string;      // e.g., "Article 21"
  title: string;        // short title
  explanation: string;  // plain language
  whenItApplies: string[];
  punishment?: string;
  tags: string[];
  related?: string[];
  sourceHint?: string;  // optional citation hint (not a URL)
}

export interface KyrGuide {
  id: string;
  title: string;
  category: KyrCategory;
  summary: string;
  steps: string[];
  documents: string[];
  timeline: string[];
  faqs: { q: string; a: string }[];
  relatedHelplines: string[]; // helpline ids
  relatedProvisions: string[]; // provision ids
}

export interface KyrScenario {
  id: string;
  title: string;
  category: KyrCategory;
  icon: string; // emoji
  description: string;
  quickRights: string[];
  whatToDoNow: string[];
  whatNotToDo: string[];
  whatYouCanSay: string[];
  relatedHelplines: string[]; // helpline ids
  relatedProvisions: string[]; // provision ids
  safetyNote?: string;
}
