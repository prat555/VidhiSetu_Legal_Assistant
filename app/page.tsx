'use client';

import Link from 'next/link';
import { Scale, MessageSquare, FileText, Search, Shield, FileCheck, ArrowRight, Gavel, LogIn } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const { user, signInWithGoogle } = useAuth();

  const features = [
    {
      title: 'AI Legal Assistant',
      description: 'Get instant answers about Indian law through natural conversation.',
      icon: MessageSquare,
      href: '/chat',
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-100',
      hoverBorder: 'hover:border-orange-200',
      mostPopular: true,
    },
    {
      title: 'Document Analyzer',
      description: 'Upload contracts for AI-powered analysis and risk assessment.',
      icon: FileCheck,
      href: '/document-analyzer',
      color: 'violet',
      bgColor: 'bg-violet-50',
      iconColor: 'text-violet-600',
      borderColor: 'border-violet-100',
      hoverBorder: 'hover:border-violet-200',
    },
    {
      title: 'Legal Forms',
      description: 'Generate NDAs, contracts, agreements, and legal documents.',
      icon: FileText,
      href: '/legal-forms',
      color: 'amber',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-100',
      hoverBorder: 'hover:border-amber-200',
    },
    {
      title: 'Case Law Search',
      description: 'Search Supreme Court and High Court judgments.',
      icon: Search,
      href: '/case-search',
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-100',
      hoverBorder: 'hover:border-emerald-200',
    },
    {
      title: 'Know Your Rights',
      description: 'Interactive scenarios and emergency helplines.',
      icon: Shield,
      href: '/know-your-rights',
      color: 'rose',
      bgColor: 'bg-rose-50',
      iconColor: 'text-rose-600',
      borderColor: 'border-rose-100',
      hoverBorder: 'hover:border-rose-200',
    },
    {
      title: 'Case Tracker',
      description: 'Track your legal cases and court proceedings.',
      icon: Gavel,
      href: '/case-tracker',
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-100',
      hoverBorder: 'hover:border-indigo-200',
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2940&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/95 via-neutral-900/90 to-orange-900/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-white/90">Free AI-Powered Legal Guidance</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Navigate Indian Law
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                with Confidence
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed mb-8 max-w-2xl">
              Get instant legal guidance, analyze documents, generate forms, and understand your rights — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-neutral-900 font-semibold rounded-xl hover:bg-neutral-100 transition-all group"
              >
                <MessageSquare className="w-5 h-5" />
                Start Free Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              
              {!user && (
                <button
                  onClick={signInWithGoogle}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In with Google
                </button>
              )}
            </div>

            {/* Stats */}
              <div className="flex flex-wrap gap-6 sm:gap-8 mt-12 pt-8 border-t border-white/10">
                <div>
                  <p className="text-2xl font-bold text-white">100%</p>
                  <p className="text-sm text-neutral-400">Free to Use</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">Trusted</p>
                  <p className="text-sm text-neutral-400">Legal Sources</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">Encrypted</p>
                  <p className="text-sm text-neutral-400">Your Data is Safe</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">Instant</p>
                  <p className="text-sm text-neutral-400">Responses</p>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Comprehensive legal tools designed for everyone, from AI consultation to document analysis.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className={`group relative bg-white rounded-2xl p-6 border ${feature.borderColor} ${feature.hoverBorder} transition-all hover:shadow-lg`}
                >
                  {feature.comingSoon && (
                    <span className="absolute top-4 right-4 px-2 py-1 text-[10px] font-semibold bg-neutral-100 text-neutral-500 rounded-full">
                      Coming Soon
                    </span>
                  )}
                  {feature.mostPopular && (
                    <span className="absolute top-4 right-4 px-2 py-1 text-[10px] font-semibold bg-orange-50 text-orange-500 rounded-full border border-orange-100">
                      Most Popular
                    </span>
                  )}

                  <div className={`inline-flex p-3 ${feature.bgColor} rounded-xl mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>

                  <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  <span className="inline-flex items-center text-sm font-medium text-orange-600 group-hover:text-orange-700">
                    {feature.comingSoon ? 'Coming Soon' : 'Explore'}
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-neutral-900">Vexora</span>
            </div>
            
            <p className="text-sm text-neutral-500 text-center">
              For educational purposes only • Consult a lawyer for legal advice
            </p>
            
            <p className="text-sm text-neutral-400">© 2026 Vexora</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
