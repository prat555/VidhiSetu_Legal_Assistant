'use client';

import Link from "next/link";
import { useMemo, useState } from "react";
import { Scale, Search, Tag } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Footer } from "../../components/Footer";
import { provisions } from "../../data/kyr";

export default function ProvisionsPage() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string>("ALL");

  const tags = useMemo(() => {
    const set = new Set<string>();
    provisions.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ["ALL", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return provisions.filter((p) => {
      const matchesQ =
        !q ||
        p.act.toLowerCase().includes(q) ||
        p.section.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.explanation.toLowerCase().includes(q);
      const matchesT = tag === "ALL" || p.tags.includes(tag);
      return matchesQ && matchesT;
    });
  }, [query, tag]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <PageHeader
        title="Legal Provisions"
        description="Key laws and sections explained in simple terms, with tags to explore."
        icon={<Scale className="w-6 h-6 text-blue-600" />}
        accentColor="blue"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search provisions (e.g., Article 21, IT Act, bail)…"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-neutral-400" />
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="pl-3 pr-8 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTEgMSIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:12px] bg-[center_right_0.75rem] bg-no-repeat"
            >
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t === "ALL" ? "All tags" : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/know-your-rights/provisions/${p.id}`}
              className="rounded-2xl border border-neutral-200 bg-white hover:shadow-md transition-all p-5"
            >
              <div className="text-neutral-900 font-bold text-lg">{p.section} — {p.title}</div>
              <div className="text-neutral-500 text-sm mt-1">{p.act}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.slice(0, 4).map((t) => (
                  <span key={t} className="text-xs px-2 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 text-center text-neutral-500">
            No provisions found. Try a different search.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
