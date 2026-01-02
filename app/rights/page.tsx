'use client';

import { useState } from 'react';
import { Shield, ChevronDown, Phone, ExternalLink } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface Scenario {
  id: string;
  title: string;
  icon: string;
  description: string;
  rights: string[];
  steps: string[];
  laws: string[];
  helplines: { name: string; number: string }[];
}

export default function KnowYourRights() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const scenarios: Scenario[] = [
    {
      id: 'police_stop',
      title: 'Police Stop & Search',
      icon: '👮',
      description: 'What to do when stopped by police',
      rights: [
        'Police must identify themselves and state the reason for stopping you',
        'You have the right to know the charges if being arrested',
        'Women can only be arrested in presence of female officer',
        'You have right to refuse search without warrant (except in specific cases)',
        'Right to inform family member or friend about arrest',
      ],
      steps: [
        'Stay calm and be polite',
        'Ask for officer\'s name and ID',
        'Request the reason for being stopped',
        'Do not resist if being arrested',
        'Ask for written memo of arrest',
        'Inform your family/lawyer immediately',
      ],
      laws: [
        'Article 21 - Right to Life and Personal Liberty',
        'Article 22 - Protection against arrest and detention',
        'Section 41 CrPC - When police may arrest without warrant',
        'Section 50 CrPC - Person arrested to be informed of grounds',
        'Section 51 CrPC - Search of arrested person',
      ],
      helplines: [
        { name: 'Police Control Room', number: '100' },
        { name: 'Women Helpline', number: '1091' },
        { name: 'Legal Aid', number: '15100' },
      ],
    },
    {
      id: 'arrest',
      title: 'Arrest Procedures',
      icon: '⚖️',
      description: 'Your rights during arrest',
      rights: [
        'Right to know grounds of arrest',
        'Right to be produced before magistrate within 24 hours',
        'Right to consult and be defended by a lawyer',
        'Right to be medically examined if requested',
        'Right against self-incrimination',
        'Right to bail (in bailable offenses)',
      ],
      steps: [
        'Do not resist arrest',
        'Ask for arrest memo with signature of witness',
        'Request to inform family member',
        'Get copy of FIR',
        'Seek immediate legal counsel',
        'Request medical examination if injured',
      ],
      laws: [
        'Article 22(1) - Right to be informed of grounds of arrest',
        'Article 22(2) - Right to consult and be defended by lawyer',
        'Section 41A CrPC - Notice of appearance before police officer',
        'Section 57 CrPC - Person arrested not to be detained beyond 24 hours',
        'Section 304 CrPC - General provisions regarding bail',
      ],
      helplines: [
        { name: 'Police Emergency', number: '100' },
        { name: 'Legal Services Authority', number: '15100' },
        { name: 'Human Rights Commission', number: '14433' },
      ],
    },
    {
      id: 'domestic_violence',
      title: 'Domestic Violence',
      icon: '🏠',
      description: 'Protection from domestic abuse',
      rights: [
        'Right to live in shared household',
        'Right to protection order against abuser',
        'Right to monetary relief and compensation',
        'Right to custody of children',
        'Right to reside in shelter home',
        'Right to free legal aid',
      ],
      steps: [
        'Document all incidents with dates and details',
        'Seek medical help and keep records',
        'Inform trusted family/friends',
        'File complaint with police or Protection Officer',
        'Apply for protection order from Magistrate',
        'Seek counseling and legal support',
      ],
      laws: [
        'Protection of Women from Domestic Violence Act, 2005',
        'Section 498A IPC - Cruelty by husband or relatives',
        'Section 304B IPC - Dowry death',
        'Section 406 IPC - Criminal breach of trust',
      ],
      helplines: [
        { name: 'Women Helpline', number: '1091' },
        { name: 'Domestic Violence Helpline', number: '181' },
        { name: 'National Commission for Women', number: '7827170170' },
      ],
    },
    {
      id: 'workplace',
      title: 'Workplace Harassment',
      icon: '💼',
      description: 'Protection at workplace',
      rights: [
        'Right to work in harassment-free environment',
        'Right to file complaint with Internal Complaints Committee',
        'Right to confidentiality during inquiry',
        'Right to interim relief during inquiry',
        'Right to compensation if complaint is upheld',
        'Protection against retaliation',
      ],
      steps: [
        'Document all incidents in detail',
        'File written complaint with ICC within 3 months',
        'Cooperate with inquiry committee',
        'Seek support from colleagues/witnesses',
        'Request interim measures if needed',
        'Follow up on inquiry proceedings',
      ],
      laws: [
        'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013',
        'Section 354A IPC - Sexual harassment',
        'Section 509 IPC - Insulting modesty of woman',
        'Article 14 & 15 - Right to Equality',
      ],
      helplines: [
        { name: 'Women Helpline', number: '1091' },
        { name: 'She Teams (varies by state)', number: '100' },
        { name: 'Labour Department', number: 'State-specific' },
      ],
    },
    {
      id: 'consumer',
      title: 'Consumer Rights',
      icon: '🛡️',
      description: 'Your rights as a consumer',
      rights: [
        'Right to safety from hazardous products',
        'Right to be informed about quality and price',
        'Right to choose from variety of products',
        'Right to be heard in consumer forums',
        'Right to seek redressal of grievances',
        'Right to consumer education',
      ],
      steps: [
        'Keep all bills and receipts',
        'Document the defect/problem',
        'Contact seller/manufacturer first',
        'Send legal notice if issue not resolved',
        'File complaint in consumer forum within 2 years',
        'Attend hearings with evidence',
      ],
      laws: [
        'Consumer Protection Act, 2019',
        'Sale of Goods Act, 1930',
        'Indian Contract Act, 1872',
        'Legal Metrology Act, 2009',
      ],
      helplines: [
        { name: 'National Consumer Helpline', number: '1800-11-4000' },
        { name: 'Consumer Forum', number: 'District-specific' },
      ],
    },
    {
      id: 'cyber_crime',
      title: 'Cyber Crime',
      icon: '💻',
      description: 'Protection from online crimes',
      rights: [
        'Right to report cyber crimes to authorities',
        'Right to privacy of personal data',
        'Right to compensation for data breach',
        'Right to block/remove offensive content',
        'Right to seek interim orders from court',
      ],
      steps: [
        'Do not delete any evidence',
        'Take screenshots of everything',
        'Note dates, times, and URLs',
        'Report to cybercrime.gov.in immediately',
        'File FIR at nearest cyber crime cell',
        'Block/report offending accounts',
      ],
      laws: [
        'Information Technology Act, 2000',
        'Section 66A, 66C, 66D IT Act - Cyber offenses',
        'Section 67 IT Act - Publishing obscene content',
        'Section 354C IPC - Voyeurism',
        'Section 509 IPC - Insulting modesty',
      ],
      helplines: [
        { name: 'Cyber Crime Helpline', number: '1930' },
        { name: 'Report at', number: 'cybercrime.gov.in' },
        { name: 'Women Cyber Crime', number: '7827170170' },
      ],
    },
  ];

  const selected = scenarios.find(s => s.id === selectedScenario);

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 via-emerald-950/20 to-black">
      <PageHeader
        title="Know Your Rights"
        description="Learn about your legal rights in various situations"
        icon={<Shield className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {!selected ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-left hover:border-emerald-500 dark:hover:border-emerald-600 transition-all hover:shadow-md"
                >
                  <div className="text-4xl mb-3">{scenario.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {scenario.title}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    {scenario.description}
                  </p>
                  <div className="mt-4 flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                    Learn More
                    <ChevronDown className="w-4 h-4 ml-1 -rotate-90" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={() => setSelectedScenario(null)}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm font-medium flex items-center gap-2"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
                Back to all scenarios
              </button>

              {/* Header */}
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-4xl">{selected.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selected.title}</h2>
                    <p className="text-zinc-400">{selected.description}</p>
                  </div>
                </div>
              </div>

              {/* Your Rights */}
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Rights</h3>
                <ul className="space-y-2">
                  {selected.rights.map((right, index) => (
                    <li key={index} className="flex gap-3 text-zinc-300">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{right}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps to Take */}
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Steps to Take</h3>
                <ol className="space-y-3">
                  {selected.steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-zinc-300 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Relevant Laws */}
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Relevant Laws</h3>
                <ul className="space-y-2">
                  {selected.laws.map((law, index) => (
                    <li key={index} className="flex gap-2 text-zinc-300">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                      {law}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Helplines */}
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-red-600 dark:text-red-400" />
                  Emergency Helplines
                </h3>
                <div className="space-y-3">
                  {selected.helplines.map((helpline, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-zinc-900 rounded-lg">
                      <span className="text-zinc-300 font-medium">{helpline.name}</span>
                      <a
                        href={`tel:${helpline.number}`}
                        className="text-red-600 dark:text-red-400 font-bold hover:text-red-700 dark:hover:text-red-300"
                      >
                        {helpline.number}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
