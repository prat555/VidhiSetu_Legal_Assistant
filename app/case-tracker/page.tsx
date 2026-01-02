'use client';

import { Clock } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

export default function CaseTracker() {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-900 via-indigo-950/20 to-black">
      <PageHeader
        title="Case Tracker"
        description="Track your legal cases and proceedings"
        icon={<Clock className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mb-6">
              <Clock className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3">
              Coming Soon
            </h2>
            
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              We're working on integrating with the eCourts system to provide real-time case tracking and status updates.
            </p>

            <div className="inline-flex flex-col items-start gap-2 text-left bg-zinc-900 border border-white/10 rounded-lg p-6 max-w-sm mx-auto">
              <h3 className="font-semibold text-white mb-2">Planned Features:</h3>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                  Track case status by CNR/case number
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                  View next hearing dates
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                  Access case documents and orders
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                  Get notifications for updates
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">✓</span>
                  Case history and timeline
                </li>
              </ul>
            </div>

            <div className="mt-8 text-sm text-zinc-500 dark:text-zinc-400">
              For now, visit{' '}
              <a
                href="https://services.ecourts.gov.in/ecourtindia_v6/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                eCourts Services
              </a>
              {' '}to track your cases.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
