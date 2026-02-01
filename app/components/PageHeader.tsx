'use client';

import { Navbar } from './Navbar';

interface PageHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  accentColor?: 'orange' | 'purple' | 'blue' | 'emerald' | 'amber' | 'red' | 'indigo' | 'violet';
}

const accentColors = {
  orange: {
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    border: 'border-orange-200',
  },
  purple: {
    bg: 'bg-violet-50',
    iconBg: 'bg-violet-100',
    border: 'border-violet-200',
  },
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    border: 'border-blue-200',
  },
  emerald: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    border: 'border-emerald-200',
  },
  amber: {
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    border: 'border-amber-200',
  },
  red: {
    bg: 'bg-rose-50',
    iconBg: 'bg-rose-100',
    border: 'border-rose-200',
  },
  indigo: {
    bg: 'bg-indigo-50',
    iconBg: 'bg-indigo-100',
    border: 'border-indigo-200',
  },
  violet: {
    bg: 'bg-violet-50',
    iconBg: 'bg-violet-100',
    border: 'border-violet-200',
  },
};

export function PageHeader({ 
  title, 
  description, 
  icon, 
  iconBgColor,
  accentColor = 'orange'
}: PageHeaderProps) {
  const colors = accentColors[accentColor];

  return (
    <>
      {/* Use same Navbar as home page */}
      <Navbar />

      {/* Header */}
      <div className={`px-4 sm:px-6 lg:px-8 py-10 sm:py-12 border-b border-neutral-200 ${colors.bg}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-4">
            <div className={`p-3 ${colors.iconBg} rounded-xl border ${colors.border}`}>
              {icon}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">{title}</h1>
              <p className="text-neutral-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
