'use client';

import { Scale, BookOpen, FileText, Users } from 'lucide-react';

interface WelcomeScreenProps {
  onQuestionClick: (question: string) => void;
}

export default function WelcomeScreen({ onQuestionClick }: WelcomeScreenProps) {
  const sampleQuestions = [
    {
      icon: FileText,
      text: 'What are my rights as a tenant in India?',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Users,
      text: 'How do I file a consumer complaint?',
      color: 'from-emerald-500 to-green-600',
    },
    {
      icon: BookOpen,
      text: 'Explain Section 498A of IPC',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: Scale,
      text: 'What is the process for registering a startup?',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 max-w-4xl mx-auto">
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 mb-5 shadow-xl">
          <Scale className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 tracking-tight">
          VidhiSetu
        </h1>
        <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Get guidance on Indian law, legal procedures, and your rights
        </p>
      </div>

      <div className="w-full max-w-3xl">
        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3 px-1">
          Popular questions
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sampleQuestions.map((question, index) => {
            const Icon = question.icon;
            return (
              <button
                key={index}
                onClick={() => onQuestionClick(question.text)}
                className="group relative overflow-hidden rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-4 text-left transition-all hover:shadow-md hover:scale-[1.01] hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 w-9 h-9 rounded-lg bg-linear-to-br ${question.color} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors leading-relaxed">
                    {question.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 backdrop-blur-sm border border-amber-200/60 dark:border-amber-900/40 max-w-2xl hidden md:block">
        <p className="text-xs md:text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed">
          <strong className="font-semibold">Disclaimer:</strong> This assistant provides general legal information only. It is not a substitute for professional legal advice. Please consult with a qualified lawyer for specific legal matters.
        </p>
      </div>
    </div>
  );
}
