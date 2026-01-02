import Link from 'next/link';
import { Scale, MessageSquare, FileText, Search, Shield, FileCheck, Sparkles, ArrowRight, Gavel } from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'AI Legal Assistant',
      description: 'Chat with our AI to get instant answers about Indian law, legal procedures, and your rights.',
      icon: MessageSquare,
      iconColor: 'text-blue-600 dark:text-blue-400',
      href: '/chat',
      badge: 'Most Popular'
    },
    {
      title: 'Document Analyzer',
      description: 'Upload legal documents, contracts, or agreements. Get AI-powered analysis and risk assessment.',
      icon: FileCheck,
      iconColor: 'text-purple-600 dark:text-purple-400',
      href: '/document-analyzer',
      badge: 'New'
    },
    {
      title: 'Legal Forms Generator',
      description: 'Generate legal documents like FIRs, legal notices, RTI applications, and more with AI assistance.',
      icon: FileText,
      iconColor: 'text-amber-600 dark:text-orange-400',
      href: '/legal-forms',
      badge: null
    },
    {
      title: 'Case Law Search',
      description: 'Search through Indian Supreme Court and High Court judgments. Find relevant case laws and precedents.',
      icon: Search,
      iconColor: 'text-green-600 dark:text-green-400',
      href: '/case-search',
      badge: null
    },
    {
      title: 'Know Your Rights',
      description: 'Learn about your legal rights through interactive scenarios and practical guides for common situations.',
      icon: Shield,
      iconColor: 'text-red-600 dark:text-red-400',
      href: '/rights',
      badge: null
    },
    {
      title: 'Court Case Tracker',
      description: 'Track your court cases, get hearing date reminders, and monitor case status across Indian courts.',
      icon: Gavel,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      href: '/case-tracker',
      badge: 'Coming Soon'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      {/* Animated Background with Legal Theme */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-orange-900/20 via-zinc-900 to-blue-900/20" />
        
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating legal icons */}
        <div className="absolute inset-0 overflow-hidden">
          <Scale className="absolute top-20 left-10 w-24 h-24 text-orange-500/5 animate-float" />
          <Gavel className="absolute top-40 right-20 w-32 h-32 text-blue-500/5 animate-float animation-delay-2000" />
          <Shield className="absolute bottom-32 left-1/4 w-28 h-28 text-purple-500/5 animate-float animation-delay-4000" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="px-4 sm:px-6 lg:px-8 py-5 border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <Scale className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <span className="text-xl font-bold text-white block">
                    VidhiSetu
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">
                    Legal Help Made Simple
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href="#features"
                  className="px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
                >
                  Get Started
                </a>
                <Link 
                  href="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-black bg-orange-400 hover:bg-orange-300 rounded-lg transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-105"
                >
                  Login / Signup
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto text-center">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-white mb-5">
              Your Legal Rights,
              <br />
              <span className="bg-linear-to-r from-orange-500 via-orange-400 to-orange-300 bg-clip-text text-transparent">
                Simplified with AI
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto mb-8">
              Navigate the complexities of Indian law with confidence. Get instant AI-powered legal guidance, analyze documents, and understand your rights.
            </p>

            {/* CTA Button */}
            <Link
              href="/chat"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-400 text-black rounded-xl font-bold transition-all shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
            >
              <MessageSquare className="w-5 h-5" />
              Start Chatting Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
                <div className="text-3xl font-bold text-orange-400 mb-1">5+</div>
                <div className="text-zinc-300 text-sm font-medium">AI Features</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
                <div className="text-3xl font-bold text-orange-400 mb-1">24/7</div>
                <div className="text-zinc-300 text-sm font-medium">Available</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
                <div className="text-3xl font-bold text-orange-400 mb-1">100%</div>
                <div className="text-zinc-300 text-sm font-medium">Free</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Comprehensive Legal Tools
              </h2>
              <p className="text-base text-zinc-400 max-w-2xl mx-auto">
                Everything you need to understand and navigate Indian law
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link
                    key={feature.title}
                    href={feature.href}
                    className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/20"
                  >
                    {/* Badge */}
                    {feature.badge && (
                      <div className="absolute top-4 right-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          feature.badge === 'Most Popular' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                          feature.badge === 'New' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                          'bg-zinc-500/20 text-zinc-300 border border-zinc-500/40'
                        }`}>
                          {feature.badge}
                        </span>
                      </div>
                    )}

                    {/* Icon */}
                    <div className="mb-4">
                      <div className="inline-flex p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 group-hover:bg-orange-500/20 group-hover:scale-110 transition-all">
                        <Icon className="w-6 h-6 text-orange-400" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                      {feature.description}
                    </p>

                    {/* Action */}
                    <div className="flex items-center text-orange-400 font-semibold text-sm">
                      {feature.badge === 'Coming Soon' ? 'Coming Soon' : 'Access Now'}
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-4 sm:px-6 lg:px-8 py-8 border-t border-white/10 bg-black/20 backdrop-blur-xl mt-20">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <Scale className="w-4 h-4 text-orange-400" />
              </div>
              <span className="text-base font-bold text-white">VidhiSetu</span>
            </div>
            <p className="text-zinc-500 text-xs mb-2">
              Educational purposes only • Consult a lawyer for legal advice
            </p>
            <p className="text-zinc-600 text-xs">
              © 2026 VidhiSetu. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
