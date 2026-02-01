'use client';

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Search, ArrowRight } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Footer } from "../../components/Footer";
import { guides, categoryLabels } from "../../data/kyr";

export default function GuidesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("ALL");

  const categories = useMemo(() => {
    const set = new Set(guides.map((g) => g.category));
    return ["ALL", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guides.filter((g) => {
      const matchesQ =
        !q ||
        g.title.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        g.steps.join(" ").toLowerCase().includes(q);
      const matchesC = category === "ALL" || g.category === category;
      return matchesQ && matchesC;
    });
  }, [query, category]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <PageHeader
        title="Comprehensive Guides"
        description="Step-by-step checklists for common legal situations."
        icon={<BookOpen className="w-6 h-6 text-amber-600" />}
        accentColor="amber"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides (e.g., FIR, cyber, harassment)…"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="pl-3 pr-8 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTEgMSIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:12px] bg-[center_right_0.75rem] bg-no-repeat"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "ALL" ? "All categories" : (categoryLabels[c] ?? c)}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((g) => (
            <Link
              key={g.id}
              href={`/know-your-rights/guides/${g.id}`}
              className="group rounded-2xl border border-neutral-200 bg-white hover:shadow-md transition-all p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-amber-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-neutral-900 font-bold text-lg group-hover:text-amber-700 transition-colors">{g.title}</h2>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-600 transition-colors" />
                  </div>
                  <p className="text-neutral-500 text-sm mt-1">{g.summary}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-600">
                      {(categoryLabels[g.category] ?? g.category)}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-700">
                      Steps: {g.steps.length}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 text-center text-neutral-500">
            No guides found. Try a different search.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
