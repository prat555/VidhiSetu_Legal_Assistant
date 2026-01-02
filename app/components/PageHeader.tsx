'use client';

import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor?: string;
}

export function PageHeader({ title, description, icon, iconBgColor = 'bg-zinc-100 dark:bg-zinc-800' }: PageHeaderProps) {
  return (
    <>
      {/* Navigation with Gradient */}
      <nav className="px-4 sm:px-6 lg:px-8 py-5 border-b border-white/10 bg-black/20 backdrop-blur-xl relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-purple-500/10 via-amber-500/10 to-blue-500/10" />
        
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-white transition-all hover:bg-white/10 rounded-lg">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-lg font-bold text-white">VidhiSetu</span>
          </div>
        </div>
      </nav>

      {/* Header with Enhanced Design */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 border-b border-white/10 bg-linear-to-br from-zinc-900 to-black relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${iconBgColor} rounded-2xl mb-4 border border-zinc-700 shadow-lg`}>
            {icon}
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">{title}</h1>
          <p className="text-zinc-400 text-base max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </div>
    </>
  );
}
