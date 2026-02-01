'use client';

import { Clock, Calendar, FileText, Bell, History, ExternalLink, CheckCircle, Gavel } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Footer } from '../components/Footer';

const plannedFeatures = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Track by CNR/Case Number",
    description: "Enter your case details to get instant status updates"
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "Next Hearing Dates",
    description: "Never miss a court date with upcoming hearing information"
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Access Documents",
    description: "View case documents, orders, and judgments online"
  },
  {
    icon: <Bell className="w-5 h-5" />,
    title: "Smart Notifications",
    description: "Get alerts for case updates, hearing changes, and orders"
  },
  {
    icon: <History className="w-5 h-5" />,
    title: "Case Timeline",
    description: "Complete history and timeline of all case proceedings"
  },
];

export default function CaseTracker() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <PageHeader
        title="Case Tracker"
        description="Track your legal cases and proceedings in real-time"
        icon={<Gavel className="w-6 h-6 text-indigo-600" />}
        accentColor="indigo"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Coming Soon Hero */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-10 text-center border-b border-neutral-100">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium mb-4">
              <Clock className="w-3.5 h-3.5" />
              In Development
            </span>
            
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">
              Coming Soon
            </h2>
            
            <p className="text-neutral-600 max-w-lg mx-auto">
              We're building an integration with the eCourts system to bring you real-time case tracking, 
              status updates, and hearing notifications—all in one place.
            </p>
          </div>

          {/* Features Grid */}
          <div className="p-8">
            <h3 className="text-base font-semibold text-neutral-900 mb-5 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
              Planned Features
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {plannedFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-100"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-neutral-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="px-8 py-5 bg-neutral-50 border-t border-neutral-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-neutral-500 text-sm">
                Need to track your case now?
              </p>
              <a
                href="https://services.ecourts.gov.in/ecourtindia_v6/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
              >
                Visit eCourts Portal
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="font-semibold text-neutral-900 mb-2">What is CNR?</h3>
            <p className="text-sm text-neutral-500">
              CNR (Case Number Record) is a unique 16-digit number assigned to each case filed in Indian courts. 
              You can find it on your court summons or case documents.
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="font-semibold text-neutral-900 mb-2">Need Help?</h3>
            <p className="text-sm text-neutral-500">
              If you need assistance understanding your case status or legal proceedings, 
              try our AI Legal Assistant or consult with a lawyer.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
