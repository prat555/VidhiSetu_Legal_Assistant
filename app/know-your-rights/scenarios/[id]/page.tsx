import Link from "next/link";
import { notFound } from "next/navigation";
import { Shield, PhoneCall, BookOpen, Scale } from "lucide-react";
import { PageHeader } from "../../../components/PageHeader";
import { Footer } from "../../../components/Footer";
import { scenarios, helplines, provisions, categoryLabels } from "../../../data/kyr";

export default async function ScenarioDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scenario = scenarios.find((s) => s.id === id);
  if (!scenario) return notFound();

  const relatedHelplines = helplines.filter((h) => scenario.relatedHelplines.includes(h.id));
  const relatedProvisions = provisions.filter((p) => scenario.relatedProvisions.includes(p.id));

  return (
    <div className="min-h-screen bg-neutral-50">
      <PageHeader
        title={scenario.title}
        description={scenario.description}
        icon={<Shield className="w-6 h-6 text-violet-600" />}
        accentColor="violet"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs px-2 py-1 rounded-full border border-neutral-200 bg-white text-neutral-600">
            {categoryLabels[scenario.category] ?? scenario.category}
          </span>
          <Link href="/know-your-rights/scenarios" className="text-sm text-neutral-500 hover:text-neutral-900">
            ← Back to scenarios
          </Link>
        </div>

        {scenario.safetyNote && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
            <div className="font-semibold">Safety note</div>
            <div className="text-sm mt-1 text-amber-700">{scenario.safetyNote}</div>
          </div>
        )}

        <Section title="Quick rights" icon={<Shield className="w-5 h-5 text-violet-600" />}>
          <Bullets items={scenario.quickRights} />
        </Section>

        <Section title="What to do now" icon={<BookOpen className="w-5 h-5 text-amber-600" />}>
          <Numbered items={scenario.whatToDoNow} />
        </Section>

        <Section title="What NOT to do" icon={<Scale className="w-5 h-5 text-blue-600" />}>
          <Bullets items={scenario.whatNotToDo} />
        </Section>

        <Section title="What you can say" icon={<Shield className="w-5 h-5 text-emerald-600" />}>
          <div className="grid gap-3 sm:grid-cols-2">
            {scenario.whatYouCanSay.map((line) => (
              <div key={line} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
                “{line}”
              </div>
            ))}
          </div>
        </Section>

        <div className="grid gap-4 md:grid-cols-2">
          <Section title="Emergency helplines" icon={<PhoneCall className="w-5 h-5 text-emerald-600" />}>
            {relatedHelplines.length ? (
              <div className="space-y-3">
                {relatedHelplines.map((h) => (
                  <div key={h.id} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-neutral-900 font-semibold">{h.name}</div>
                      <div className="text-neutral-500 text-sm">{h.availability ?? ""}{h.notes ? (h.availability ? " • " : "") + h.notes : ""}</div>
                    </div>
                    <a
                      href={`tel:${h.number}`}
                      className="px-3 py-2 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-700 hover:bg-emerald-200 transition-colors text-sm font-medium"
                    >
                      Call {h.number}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-500 text-sm">No helplines linked for this scenario.</div>
            )}
          </Section>

          <Section title="Relevant legal provisions" icon={<Scale className="w-5 h-5 text-blue-600" />}>
            {relatedProvisions.length ? (
              <div className="space-y-3">
                {relatedProvisions.map((p) => (
                  <Link
                    key={p.id}
                    href={`/know-your-rights/provisions/${p.id}`}
                    className="block rounded-xl border border-neutral-200 bg-neutral-50 p-4 hover:bg-neutral-100 transition-colors"
                  >
                    <div className="text-neutral-900 font-semibold">{p.section} — {p.title}</div>
                    <div className="text-neutral-500 text-sm mt-1">{p.act}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-neutral-500 text-sm">No provisions linked for this scenario.</div>
            )}
          </Section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-xl bg-neutral-100 border border-neutral-200">{icon}</div>
        <h2 className="text-neutral-900 font-bold text-lg">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((t) => (
        <li key={t} className="text-neutral-700 text-sm flex gap-2">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Numbered({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2 list-decimal list-inside text-neutral-700 text-sm">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ol>
  );
}
