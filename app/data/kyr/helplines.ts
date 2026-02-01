import type { KyrHelpline } from "./types";

export const helplines: KyrHelpline[] = [
  { id: "emergency_112", name: "National Emergency", number: "112", category: "GENERAL", availability: "24x7" },
  { id: "police_100", name: "Police", number: "100", category: "POLICE", availability: "24x7" },
  { id: "women_181", name: "Women Helpline", number: "181", category: "WOMEN", availability: "24x7" },
  { id: "women_1091", name: "Women Helpline (Police)", number: "1091", category: "WOMEN" },
  { id: "child_1098", name: "Childline", number: "1098", category: "GENERAL", availability: "24x7" },
  { id: "cyber_1930", name: "Cyber Crime Helpline", number: "1930", category: "CYBER", availability: "24x7", notes: "Report financial cyber fraud immediately." },
  { id: "legal_aid_15100", name: "NALSA / Legal Aid", number: "15100", category: "GENERAL", notes: "Legal aid / advice referrals (availability varies by state)." },
];
