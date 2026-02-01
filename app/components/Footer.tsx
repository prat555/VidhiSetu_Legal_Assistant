'use client';

import { Scale } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-linear-to-br from-orange-500 to-amber-500 rounded-lg">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-neutral-900">VidhiSetu</span>
          </div>
          
          <p className="text-sm text-neutral-500 text-center">
            For educational purposes only • Consult a lawyer for legal advice
          </p>
          
          <p className="text-sm text-neutral-400">© 2026 VidhiSetu</p>
        </div>
      </div>
    </footer>
  );
}
