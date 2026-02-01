export async function GET() {
  const base = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  try {
    const res = await fetch(`${base}/api/tags`, { cache: "no-store" });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return Response.json({ ok: false, baseUrl: base, status: res.status, detail: txt.slice(0, 300) });
    }
    const data = await res.json().catch(() => ({}));
    return Response.json({ ok: true, baseUrl: base, models: data?.models?.map((m:any)=>m?.name).filter(Boolean) ?? [] });
  } catch (e: any) {
    return Response.json({ ok: false, baseUrl: base, error: e?.message ?? "Failed to reach Ollama" });
  }
}
