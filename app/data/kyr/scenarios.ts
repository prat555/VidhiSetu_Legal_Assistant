import type { KyrScenario } from "./types";

export const scenarios: KyrScenario[] = [
  {
    id: "police_stop_search",
    title: "Police stop & search",
    category: "POLICE",
    icon: "👮",
    description: "What to do when you're stopped by police for questioning or a search.",
    quickRights: [
      "You can ask the reason for being stopped and the officer's identification.",
      "You have the right to remain calm and not self-incriminate.",
      "If you are detained/arrested, you can ask to inform a family member/lawyer.",
    ],
    whatToDoNow: [
      "Stay calm, keep hands visible, and be polite.",
      "Ask: name, badge/ID, and reason for stop.",
      "If they want to search your belongings, ask the legal basis and request it be done respectfully.",
      "If you feel unsafe, call 112 on speaker (if appropriate) and share location with a trusted person.",
    ],
    whatNotToDo: [
      "Don't argue aggressively or physically resist.",
      "Don't sign blank papers; read before signing.",
      "Don't volunteer extra information you're unsure about.",
    ],
    whatYouCanSay: [
      "Officer, may I know the reason for stopping me?",
      "May I have your name and badge/ID number?",
      "I'd like to speak to my lawyer / inform my family if I'm being detained."
    ],
    relatedHelplines: ["emergency_112", "police_100", "legal_aid_15100"],
    relatedProvisions: ["art_21", "art_22", "crpc_41", "crpc_50"],
    safetyNote: "If you believe there is immediate danger, prioritise safety and call 112.",
  },
  {
    id: "arrest_detention",
    title: "Arrest / detention",
    category: "POLICE",
    icon: "⛓️",
    description: "Your rights and immediate steps if you or someone you know is being arrested.",
    quickRights: [
      "Right to know the grounds of arrest.",
      "Right to consult a lawyer and inform a family member.",
      "Right to be produced before a magistrate within a legally required time window (generally 24 hours).",
    ],
    whatToDoNow: [
      "Ask clearly: \"Am I under arrest?\" If yes, ask the grounds and request it be recorded.",
      "Call a family member/friend and a lawyer; share location and officer details.",
      "Request an arrest memo / documentation; keep copies if provided.",
      "If you have injuries or illness, request medical help and keep records.",
    ],
    whatNotToDo: [
      "Don't try to run or resist physically.",
      "Don't make forced confessions; avoid signing statements you don't understand.",
    ],
    whatYouCanSay: [
      "Please tell me the grounds of arrest.",
      "I want to consult my lawyer and inform my family.",
      "Please provide documentation/acknowledgement of my arrest."
    ],
    relatedHelplines: ["emergency_112", "legal_aid_15100"],
    relatedProvisions: ["art_21", "art_22", "crpc_50"],
  },
  {
    id: "cyber_fraud",
    title: "Online fraud / UPI scam",
    category: "CYBER",
    icon: "💳",
    description: "What to do immediately after a scam, fraudulent transaction, or account takeover.",
    quickRights: [
      "You can report quickly to improve chances of freezing funds.",
      "You can demand acknowledgement/reference numbers for complaints.",
    ],
    whatToDoNow: [
      "Call 1930 immediately and report the fraud (keep reference number).",
      "Contact bank/payment app to block cards/UPI and reset credentials.",
      "Take screenshots: transaction IDs, chats, numbers, links, emails.",
      "File an online complaint and keep acknowledgement.",
    ],
    whatNotToDo: [
      "Don't delete messages or links—save as evidence.",
      "Don't click new links from the scammer or share OTPs.",
    ],
    whatYouCanSay: [
      "I need to report a cyber fraud transaction. Here's the transaction ID and time.",
      "Please block/freeze and give me a complaint/reference number."
    ],
    relatedHelplines: ["cyber_1930", "emergency_112", "legal_aid_15100"],
    relatedProvisions: ["itact_66c_66d", "itact_43"],
  },
  {
    id: "workplace_posh",
    title: "Workplace harassment (POSH)",
    category: "WORKPLACE",
    icon: "🏢",
    description: "Steps to document and report harassment at the workplace.",
    quickRights: [
      "You can document incidents and seek internal redressal through policy/committee (where applicable).",
      "You can seek interim relief (no-contact, transfer, leave) depending on the process.",
      "Every organization with 10+ employees must have an Internal Committee (IC).",
      "You have a right to confidentiality during the inquiry process.",
    ],
    whatToDoNow: [
      "Document incidents (date/time/place) and preserve evidence.",
      "Identify your workplace complaint mechanism (IC/HR) and submit written complaint with acknowledgement.",
      "Ask for interim measures if you feel unsafe.",
      "Keep a personal diary with chronological notes of incidents.",
    ],
    whatNotToDo: [
      "Don't confront alone if it feels unsafe—prioritise safety and documentation.",
      "Don't share evidence publicly before getting advice; keep originals safe.",
      "Don't resign impulsively; it may affect your legal standing.",
    ],
    whatYouCanSay: [
      "I'm submitting a formal complaint and requesting acknowledgement.",
      "I request interim protection/no-contact during the inquiry.",
      "Please provide me details of the Internal Committee as required by law."
    ],
    relatedHelplines: ["women_181", "women_1091", "legal_aid_15100"],
    relatedProvisions: ["posh_act"],
  },
  {
    id: "domestic_violence",
    title: "Domestic violence",
    category: "WOMEN",
    icon: "🏠",
    description: "Know your rights and immediate steps if you or someone you know faces domestic violence.",
    quickRights: [
      "Right to reside in shared household (even if it's not in your name).",
      "Right to protection orders that can prevent the abuser from contacting you.",
      "Right to monetary relief and maintenance.",
      "Right to custody of children in appropriate cases.",
    ],
    whatToDoNow: [
      "If in immediate danger, call 112 or 181 (Women Helpline) immediately.",
      "Reach out to a Protection Officer (appointed in every district) or Service Provider.",
      "Document injuries with photos and get a medical examination.",
      "File a complaint at the nearest police station or directly to a Magistrate.",
      "Seek shelter at a designated shelter home if you need to leave immediately.",
    ],
    whatNotToDo: [
      "Don't ignore escalating threats or violence—seek help early.",
      "Don't destroy evidence of abuse (messages, photos, medical records).",
      "Don't let abuser know you're planning to seek help if it could put you at risk.",
    ],
    whatYouCanSay: [
      "I want to file a domestic violence complaint and need a Protection Order.",
      "Please connect me with the Protection Officer of this district.",
      "I need information about shelter homes in this area."
    ],
    relatedHelplines: ["emergency_112", "women_181", "women_1091", "legal_aid_15100"],
    relatedProvisions: ["dv_act", "art_21"],
    safetyNote: "If you are in immediate physical danger, prioritize your safety. Call 112 or leave to a safe location first.",
  },
  {
    id: "consumer_fraud",
    title: "Consumer fraud / defective product",
    category: "CONSUMER",
    icon: "🛒",
    description: "What to do when you receive defective goods or face unfair trade practices.",
    quickRights: [
      "Right to receive goods/services of proper quality and quantity.",
      "Right to seek compensation for defective products or deficient services.",
      "Right to be heard and redress through consumer forums.",
      "No need for a lawyer to file consumer complaints.",
    ],
    whatToDoNow: [
      "Preserve all receipts, bills, warranty cards, and communication with seller.",
      "Send a formal complaint/notice to the seller/service provider.",
      "If unresolved, file a complaint on the National Consumer Helpline (1915) or consumer forum.",
      "For online purchases, also file on e-commerce platform's grievance portal.",
      "Consider approaching consumer court if the value justifies (District/State/National based on amount).",
    ],
    whatNotToDo: [
      "Don't throw away packaging or receipts—you'll need them as evidence.",
      "Don't accept verbal promises without written confirmation.",
      "Don't miss limitation period (2 years from date of cause of action).",
    ],
    whatYouCanSay: [
      "I received a defective product and want a replacement/refund as per Consumer Protection Act.",
      "Please provide me with a written acknowledgment of my complaint.",
      "I intend to escalate this to consumer forum if not resolved within 15 days."
    ],
    relatedHelplines: ["legal_aid_15100", "emergency_112"],
    relatedProvisions: [],
  },
  {
    id: "tenant_eviction",
    title: "Wrongful eviction / landlord dispute",
    category: "TENANCY",
    icon: "🏘️",
    description: "Your rights as a tenant and what to do if facing illegal eviction.",
    quickRights: [
      "Landlord cannot evict without following due legal process.",
      "Right to reasonable notice period as per agreement or local rent control laws.",
      "Right to essential services (water, electricity) even during disputes.",
      "Security deposit must be returned as per agreement terms.",
    ],
    whatToDoNow: [
      "Review your rent agreement for notice period and eviction clauses.",
      "Document all communication with landlord (keep screenshots, recordings if legal).",
      "If threatened, file a police complaint for criminal intimidation.",
      "Send a formal reply to any eviction notice through registered post.",
      "Approach Rent Control Authority or Civil Court if landlord acts illegally.",
    ],
    whatNotToDo: [
      "Don't vacate under pressure without verifying legality.",
      "Don't stop paying rent during disputes—pay by money order if landlord refuses.",
      "Don't damage property or make changes without permission.",
    ],
    whatYouCanSay: [
      "Please provide written notice as required by our agreement and law.",
      "I have rights under the Rent Control Act and will seek legal remedy if needed.",
      "I am documenting this interaction and reserving my legal rights."
    ],
    relatedHelplines: ["legal_aid_15100", "police_100"],
    relatedProvisions: ["art_21"],
    safetyNote: "If you face physical threats or lock-out, immediately call police (100 or 112).",
  },
  {
    id: "medical_negligence",
    title: "Medical negligence",
    category: "GENERAL",
    icon: "🏥",
    description: "Steps to take if you or a loved one faces medical malpractice.",
    quickRights: [
      "Right to receive proper standard of medical care.",
      "Right to complete medical records and treatment history.",
      "Right to informed consent before any procedure.",
      "Right to seek compensation for negligence.",
    ],
    whatToDoNow: [
      "Request complete medical records immediately (hospital must provide within 72 hours).",
      "Get a second opinion from another qualified doctor.",
      "Document everything—preserve all bills, prescriptions, reports.",
      "File complaint with hospital's grievance cell first.",
      "If serious, file with State/National Medical Commission or consumer forum.",
    ],
    whatNotToDo: [
      "Don't delay getting medical records—hospitals may delay or alter.",
      "Don't settle verbally without proper written documentation.",
      "Don't destroy any medication or samples that might be evidence.",
    ],
    whatYouCanSay: [
      "I formally request complete medical records as per my legal right.",
      "I want to file a grievance regarding the treatment provided.",
      "Please provide me the registration details of the treating doctor."
    ],
    relatedHelplines: ["emergency_112", "legal_aid_15100"],
    relatedProvisions: ["art_21"],
  },
];

