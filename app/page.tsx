import Link from 'next/link';
import { Scale, MessageSquare, Shield, BookOpen, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-zinc-950 dark:via-blue-950 dark:to-indigo-950 relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop"
          alt="Indian law background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-br from-slate-900/90 via-blue-900/85 to-indigo-900/90"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Navigation */}
        <nav className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Scale className="w-8 h-8 text-amber-400" />
              <span className="text-xl sm:text-2xl font-bold text-white">
                VidhiSetu
              </span>
            </div>
            <Link 
              href="/chat"
              className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
            >
              Launch App
            </Link>
          </div>
        </nav>

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Text Content */}
              <div className="text-center lg:text-left space-y-6">
                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-white">
                    Your Legal Rights,
                  </span>
                  <br />
                  <span className="bg-linear-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                    Simplified
                  </span>
                </h1>

                {/* Subheading */}
                <p className="text-lg sm:text-xl text-blue-100 leading-relaxed">
                  Get instant, accurate answers about Indian law. From constitutional rights to legal procedures, 
                  our AI assistant is here to help you understand the law better.
                </p>

                {/* CTA Button */}
                <div className="pt-4">
                  <Link 
                    href="/chat"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold text-lg shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105"
                  >
                    Start Chatting Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                  <div className="text-center lg:text-left">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500/20 rounded-lg mb-2 border border-amber-400/30">
                      <MessageSquare className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="text-sm text-blue-200 font-medium">Instant Answers</p>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-2 border border-blue-400/30">
                      <BookOpen className="w-6 h-6 text-blue-400" />
                    </div>
                    <p className="text-sm text-blue-200 font-medium">Comprehensive</p>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg mb-2 border border-green-400/30">
                      <Shield className="w-6 h-6 text-green-400" />
                    </div>
                    <p className="text-sm text-blue-200 font-medium">Your Rights</p>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mb-2 border border-purple-400/30">
                      <Scale className="w-6 h-6 text-purple-400" />
                    </div>
                    <p className="text-sm text-blue-200 font-medium">Guidance</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Visual Element */}
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-amber-500/20 to-orange-500/20 rounded-3xl blur-3xl"></div>
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
                      alt="Indian legal system"
                      className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                    />
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white text-sm">AI Assistant Available 24/7</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                        <span className="text-white text-sm">100% Free Legal Information</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-blue-200 text-xs sm:text-sm">
              This AI assistant provides general legal information for educational purposes only. 
              Not a substitute for professional legal advice.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
