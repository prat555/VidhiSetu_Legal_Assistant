import Link from "next/link";
import { notFound } from "next/navigation";
import { Scale, Tag } from "lucide-react";
import { PageHeader } from "../../../components/PageHeader";
import { Footer } from "../../../components/Footer";
import { provisions } from "../../../data/kyr";

export default async function ProvisionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const provision = provisions.find((p) => p.id === id);
  if (!provision) return notFound();

  const related = provision.related
    ? provisions.filter((p) => provision.related!.includes(p.id))
    : [];

  return (
    <div className="min-h-screen bg-neutral-50">
      <PageHeader
        title={`${provision.section} — ${provision.title}`}
        description={provision.act}
        icon={<Scale className="w-6 h-6 text-blue-600" />}
        accentColor="blue"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/know-your-rights/provisions" className="text-sm text-neutral-500 hover:text-neutral-900">
            ← Back to provisions
          </Link>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-neutral-400" />
            <div className="flex flex-wrap gap-2">
              {provision.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Section title="Simple explanation">
          <p className="text-neutral-700 text-sm leading-relaxed">{provision.explanation}</p>
        </Section>

        <Section title="When it applies">
          <ul className="space-y-2">
            {provision.whenItApplies.map((t) => (
              <li key={t} className="text-neutral-700 text-sm flex gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Section>

        {provision.punishment && (
          <Section title="Punishment / consequence">
            <p className="text-neutral-700 text-sm">{provision.punishment}</p>
          </Section>
        )}

        {related.length > 0 && (
          <Section title="Related provisions">
            <div className="space-y-3">
              {related.map((p) => (
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
          </Section>
        )}

        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">
            <span className="text-neutral-900 font-semibold">Note:</span> Laws can be complex and situation-specific. Use this for awareness and confirm details with a lawyer or official source when needed.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm">
      <h2 className="text-neutral-900 font-bold text-lg mb-3">{title}</h2>
      {children}
    </section>
  );
}
