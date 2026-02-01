"use client";

import React from "react";

type Severity = "low" | "medium" | "high";
export type AnalyzeResult = {
  summary: string[];
  keyTerms: { term: string; value: string; confidence: number }[];
  risks: { title: string; severity: Severity; evidence: string; suggestion: string }[];
  improvements: string[];
  checklist: { item: string; status: "present" | "missing" | "unclear"; note?: string }[];
  meta: { wordCount: number; charCount: number };
};

export default function ResultView({ result }: { result: AnalyzeResult }) {
  return (
    <div style={{ marginTop: 18 }}>
      <Tabs>
        <Tab title="Summary">
          <ul style={{ marginTop: 10 }}>
            {result.summary.map((s) => (
              <li key={s} style={{ marginBottom: 8 }}>{s}</li>
            ))}
          </ul>
        </Tab>

        <Tab title="Key Terms">
          <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
            {result.keyTerms.map((t) => (
              <div key={t.term} style={box}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontWeight: 700 }}>{t.term}</div>
                  <div style={{ fontSize: 12, color: "#555" }}>{t.confidence}%</div>
                </div>
                <div style={{ marginTop: 6, color: "#444" }}>{t.value}</div>
              </div>
            ))}
          </div>
        </Tab>

        <Tab title="Risks">
          <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
            {result.risks.map((r, idx) => (
              <div key={idx} style={box}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontWeight: 700 }}>{r.title}</div>
                  <span style={pill(r.severity)}>{r.severity.toUpperCase()}</span>
                </div>
                <div style={label}>Evidence</div>
                <div style={{ color: "#333" }}>{r.evidence}</div>
                <div style={label}>Suggestion</div>
                <div style={{ color: "#333" }}>{r.suggestion}</div>
              </div>
            ))}
          </div>
        </Tab>

        <Tab title="Improvements">
          <ul style={{ marginTop: 10 }}>
            {result.improvements.map((x) => (
              <li key={x} style={{ marginBottom: 8 }}>{x}</li>
            ))}
          </ul>
        </Tab>

        <Tab title="Checklist">
          <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
            {result.checklist.map((c, idx) => (
              <div key={idx} style={box}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontWeight: 700 }}>{c.item}</div>
                  <span style={pill(c.status === "present" ? "low" : c.status === "unclear" ? "medium" : "high")}>
                    {c.status.toUpperCase()}
                  </span>
                </div>
                {c.note ? <div style={{ marginTop: 6, color: "#444" }}>{c.note}</div> : null}
              </div>
            ))}
          </div>
        </Tab>

        <Tab title="Meta">
          <div style={{ marginTop: 10, ...box }}>
            <div><b>Word count:</b> {result.meta.wordCount}</div>
            <div><b>Character count:</b> {result.meta.charCount}</div>
          </div>
        </Tab>
      </Tabs>

      <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "analysis.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
          style={btnSecondary}
        >
          Export JSON
        </button>
      </div>
    </div>
  );
}

function Tabs({ children }: { children: React.ReactNode }) {
  const items = Array.isArray(children) ? children : [children];
  // @ts-ignore
  const first = items[0]?.props?.title ?? "Tab";
  const [active, setActive] = React.useState(first);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {items.map((child: any) => {
          const title = child.props.title as string;
          const isActive = title === active;
          return (
            <button
              key={title}
              onClick={() => setActive(title)}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                background: isActive ? "#111827" : "white",
                color: isActive ? "white" : "#111827",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {title}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 12 }}>
        {items.map((child: any) => (child.props.title === active ? child : null))}
      </div>
    </div>
  );
}

function Tab({ children }: { title: string; children: React.ReactNode }) {
  return <div>{children}</div>;
}

const box: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 14,
  background: "white",
};

const label: React.CSSProperties = {
  marginTop: 10,
  fontSize: 12,
  color: "#6b7280",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: 0.6,
};

const btnSecondary: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  background: "white",
  cursor: "pointer",
  fontWeight: 700,
};

function pill(sev: Severity) {
  const bg = sev === "high" ? "#fee2e2" : sev === "medium" ? "#fef3c7" : "#dcfce7";
  const fg = sev === "high" ? "#991b1b" : sev === "medium" ? "#92400e" : "#166534";
  return {
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    background: bg,
    color: fg,
    fontSize: 12,
    fontWeight: 800,
  } as React.CSSProperties;
}
