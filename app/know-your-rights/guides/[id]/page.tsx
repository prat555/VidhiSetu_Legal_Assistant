import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, PhoneCall, Scale } from "lucide-react";
import { PageHeader } from "../../../components/PageHeader";
import { Footer } from "../../../components/Footer";
import { guides, helplines, provisions, categoryLabels } from "../../../data/kyr";

export default async function GuideDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guide = guides.find((g) => g.id === id);
  if (!guide) return notFound();

  const relatedHelplines = helplines.filter((h) => guide.relatedHelplines.includes(h.id));
  const relatedProvisions = provisions.filter((p) => guide.relatedProvisions.includes(p.id));

  return (
    <div className="min-h-screen bg-neutral-50">
      <PageHeader
        title={guide.title}
        description={guide.summary}
        icon={<BookOpen className="w-6 h-6 text-amber-600" />}
        accentColor="amber"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs px-2 py-1 rounded-full border border-neutral-200 bg-white text-neutral-600">
            {categoryLabels[guide.category] ?? guide.category}
          </span>
          <Link href="/know-your-rights/guides" className="text-sm text-neutral-500 hover:text-neutral-900">
            ← Back to guides
          </Link>
        </div>

        <Section title="Step-by-step checklist" icon={<BookOpen className="w-5 h-5 text-amber-600" />}>
          <ol className="space-y-2 list-decimal list-inside text-neutral-700 text-sm">
            {guide.steps.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
        </Section>

        <div className="grid gap-4 md:grid-cols-2">
          <Section title="Documents needed" icon={<Scale className="w-5 h-5 text-blue-600" />}>
            <Bullets items={guide.documents} />
          </Section>

          <Section title="Typical timeline" icon={<Scale className="w-5 h-5 text-purple-600" />}>
            <Bullets items={guide.timeline} />
          </Section>
        </div>

        <Section title="FAQs" icon={<BookOpen className="w-5 h-5 text-amber-600" />}>
          <div className="space-y-3">
            {guide.faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="text-neutral-900 font-semibold">{f.q}</div>
                <div className="text-neutral-600 text-sm mt-1">{f.a}</div>
              </div>
            ))}
          </div>
        </Section>

        <div className="grid gap-4 md:grid-cols-2">
          <Section title="Related helplines" icon={<PhoneCall className="w-5 h-5 text-emerald-600" />}>
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
                      className="px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors text-sm"
                    >
                      Call {h.number}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-500 text-sm">No helplines linked for this guide.</div>
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
              <div className="text-neutral-500 text-sm">No provisions linked for this guide.</div>
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
        <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-200">{icon}</div>
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
