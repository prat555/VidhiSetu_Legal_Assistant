import type { KyrGuide } from "./types";

export const guides: KyrGuide[] = [
  {
    id: "file_fir",
    title: "How to file an FIR (and what to do if police refuse)",
    category: "FIR",
    summary: "A practical checklist to get your complaint recorded and documented.",
    steps: [
      "Write a clear complaint: who/what/when/where, and attach evidence list (photos, chats, receipts).",
      "Go to the nearest police station having jurisdiction. Ask to register FIR and request a copy/acknowledgement.",
      "If they refuse: politely ask for the Station House Officer (SHO) and request a written refusal (if possible).",
      "Send the complaint to the Superintendent of Police (SP/DCP) by email/speed post with proof of delivery.",
      "For certain issues (e.g., cyber fraud), also file an online complaint on the relevant government portal and call the helpline.",
      "If still unresolved, consult a lawyer / legal aid to approach the Magistrate with your documents.",
    ],
    documents: [
      "ID proof",
      "Written complaint (2 copies)",
      "Evidence: screenshots, call logs, receipts, medical report (if any)",
      "Witness details (if any)",
    ],
    timeline: [
      "Same day: attempt at police station + obtain acknowledgement",
      "1–3 days: escalation to SP/DCP with delivery proof",
      "Next step: legal aid/lawyer consultation for Magistrate approach",
    ],
    faqs: [
      { q: "Is FIR copy free?", a: "Generally, you should be able to obtain a copy/acknowledgement. If not provided, document the refusal and escalate." },
      { q: "Should I argue with the police?", a: "Avoid escalation. Stay calm, take notes, and focus on documentation and formal escalation routes." },
    ],
    relatedHelplines: ["police_100", "legal_aid_15100", "emergency_112", "cyber_1930"],
    relatedProvisions: ["crpc_50", "art_21", "art_22"],
  },
  {
    id: "cyber_fraud_first_hour",
    title: "Cyber fraud: what to do in the first 1 hour",
    category: "CYBER",
    summary: "Quick actions that increase your chances of freezing funds and preserving evidence.",
    steps: [
      "Call the cyber helpline (1930) immediately and report the incident.",
      "Contact your bank/payment app to block/freeze transactions and change PIN/passwords.",
      "Preserve evidence: screenshots, transaction IDs, chats, URLs, phone numbers.",
      "File an online complaint through the official cyber reporting channel (keep acknowledgement).",
      "Notify your contacts if your account was compromised to prevent further harm.",
    ],
    documents: [
      "Transaction reference IDs",
      "Screenshots of chats/links",
      "Bank statements (if available)",
      "Device details (phone model, SIM used)",
    ],
    timeline: [
      "0–1 hour: helpline + bank freeze + preserve evidence",
      "Same day: file online complaint + local station diary entry (if needed)",
      "Next 7 days: follow up with bank and police with acknowledgements",
    ],
    faqs: [
      { q: "Should I delete scam messages?", a: "No. Keep them as evidence. Take screenshots and keep backups." },
      { q: "What if I shared my OTP?", a: "Change passwords/PINs immediately and inform the bank. OTP sharing is common in impersonation scams." },
    ],
    relatedHelplines: ["cyber_1930", "emergency_112", "legal_aid_15100"],
    relatedProvisions: ["itact_66c_66d", "itact_43"],
  },
  {
    id: "workplace_harassment",
    title: "Workplace harassment: how to complain safely",
    category: "WORKPLACE",
    summary: "A safe and documented approach to reporting harassment at work.",
    steps: [
      "Write down incidents with date/time/place and keep copies of messages/emails.",
      "Check if your workplace has an Internal Committee (IC) for POSH complaints (for women).",
      "Submit a written complaint to the IC/HR as per policy; ask for acknowledgement.",
      "Request interim relief if needed (transfer, leave, no-contact directions).",
      "If your workplace has no IC or doesn’t respond, seek legal aid and consider external complaints per advice.",
    ],
    documents: ["Incident notes", "Screenshots/emails", "Witness list (if any)", "Employment letter/ID"],
    timeline: ["Same week: document + submit complaint", "2–4 weeks: follow-ups and hearings (varies)", "Ongoing: keep a record of all communications"],
    faqs: [
      { q: "Do I need a lawyer?", a: "Not always for internal processes, but legal aid can help if you face retaliation or non-compliance." },
    ],
    relatedHelplines: ["women_181", "women_1091", "legal_aid_15100"],
    relatedProvisions: ["posh_act"],
  },
];
