'use client';

import { useMemo, useState } from "react";
import { PhoneCall, Search, Copy, Check } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Footer } from "../../components/Footer";
import { helplines, categoryLabels } from "../../data/kyr";

export default function HelplinesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set(helplines.map((h) => h.category));
    return ["ALL", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return helplines.filter((h) => {
      const matchesQ =
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.number.toLowerCase().includes(q) ||
        (h.notes ?? "").toLowerCase().includes(q);
      const matchesC = category === "ALL" || h.category === category;
      return matchesQ && matchesC;
    });
  }, [query, category]);

  async function copyNumber(id: string, number: string) {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <PageHeader
        title="Emergency Helplines"
        description="Quick access to important numbers. Tap to call or copy."
        icon={<PhoneCall className="w-6 h-6 text-emerald-600" />}
        accentColor="emerald"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search helplines (e.g., 1930, women, cyber)…"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="pl-3 pr-8 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTEgMSIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:12px] bg-[center_right_0.75rem] bg-no-repeat"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "All categories" : (categoryLabels[c] ?? c)}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((h) => (
            <div key={h.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-neutral-900 font-bold text-lg">{h.name}</div>
                  <div className="text-neutral-500 text-sm mt-1">
                    {(categoryLabels[h.category] ?? h.category)}
                    {h.availability ? ` • ${h.availability}` : ""}
                  </div>
                  {h.notes && <div className="text-neutral-600 text-sm mt-2">{h.notes}</div>}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => copyNumber(h.id, h.number)}
                    className="p-2 rounded-xl bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 transition-colors"
                    aria-label="Copy number"
                    title="Copy"
                  >
                    {copiedId === h.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-neutral-500" />}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-2xl font-extrabold text-neutral-900 tracking-tight">{h.number}</div>
                <a
                  href={`tel:${h.number}`}
                  className="px-3 py-2 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-700 hover:bg-emerald-200 transition-colors text-sm font-medium"
                >
                  Call now
                </a>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 text-center text-neutral-500">
            No helplines found. Try a different search.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
