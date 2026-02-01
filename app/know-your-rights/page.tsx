import Link from "next/link";
import { Shield, BookOpen, PhoneCall, Scale, ArrowRight, AlertTriangle, Users } from "lucide-react";
import { PageHeader } from "../components/PageHeader";import { Footer } from '../components/Footer';
const cards = [
  {
    title: "Interactive Scenarios",
    description: "Step-by-step guidance for real-life situations like police encounters, cyber fraud, and workplace issues.",
    href: "/know-your-rights/scenarios",
    icon: Shield,
    bgColor: "bg-violet-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    borderColor: "border-violet-100",
    stats: "8+ Scenarios",
    badge: "Most Used",
  },
  {
    title: "Comprehensive Guides",
    description: "Detailed checklists for filing FIRs, handling cyber fraud, workplace complaints, and more legal procedures.",
    href: "/know-your-rights/guides",
    icon: BookOpen,
    bgColor: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    borderColor: "border-amber-100",
    stats: "Step-by-Step",
    badge: null,
  },
  {
    title: "Emergency Helplines",
    description: "Quick access to 112, 1930, women & child helplines, legal aid, and other critical emergency numbers.",
    href: "/know-your-rights/helplines",
    icon: PhoneCall,
    bgColor: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-100",
    stats: "24/7 Available",
    badge: "Critical",
  },
  {
    title: "Legal Provisions",
    description: "Key laws and sections explained simply with real-world examples. Know your constitutional rights.",
    href: "/know-your-rights/provisions",
    icon: Scale,
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    borderColor: "border-blue-100",
    stats: "10+ Laws",
    badge: null,
  },
];

const quickTips = [
  {
    icon: AlertTriangle,
    title: "During Police Stop",
    tip: "Stay calm, ask for officer's ID, and remember you can call a family member.",
  },
  {
    icon: PhoneCall,
    title: "Cyber Fraud?",
    tip: "Call 1930 immediately. The faster you report, the better the chance of fund recovery.",
  },
  {
    icon: Users,
    title: "Workplace Harassment",
    tip: "Document everything with dates and times. Your company must have an Internal Committee.",
  },
];

export default function KnowYourRightsHome() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <PageHeader
        title="Know Your Rights"
        description="Interactive scenarios, step-by-step guides, emergency helplines, and legal provisions — everything you need to understand and exercise your rights."
        icon={<Shield className="w-6 h-6 text-rose-600" />}
        accentColor="red"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.href}
                href={c.href}
                className={`group relative bg-white rounded-2xl border ${c.borderColor} hover:shadow-md transition-all p-5`}
              >
                {c.badge && (
                  <span className={`absolute top-4 right-4 px-2 py-1 rounded-full text-[10px] font-semibold ${
                    c.badge === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-violet-100 text-violet-700'
                  }`}>
                    {c.badge}
                  </span>
                )}

                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${c.iconBg}`}>
                    <Icon className={`w-6 h-6 ${c.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-1 group-hover:text-orange-600 transition-colors">{c.title}</h2>
                    <p className="text-sm text-neutral-500 leading-relaxed mb-3">{c.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400 font-medium">{c.stats}</span>
                      <span className="inline-flex items-center text-orange-600 text-sm font-medium">
                        Explore
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Tips Section */}
        <div className="mt-10">
          <h3 className="text-sm font-semibold text-neutral-700 mb-4">QUICK TIPS</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {quickTips.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <div key={i} className="bg-white rounded-xl border border-neutral-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-amber-600" />
                    <h4 className="text-sm font-medium text-neutral-900">{tip.title}</h4>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">{tip.tip}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 bg-amber-50 rounded-xl border border-amber-200 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-neutral-700">
                <span className="font-semibold text-amber-700">Important:</span> This information is for educational purposes only. 
                For emergencies, call <span className="text-neutral-900 font-medium">112</span> immediately. 
                For legal advice specific to your situation, consult a qualified lawyer.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
