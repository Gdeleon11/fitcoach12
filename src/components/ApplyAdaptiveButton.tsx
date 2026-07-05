"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyAdaptiveButton({ label }: { label: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function apply() {
    setLoading(true);
    setErr(null);
    setMsg(null);
    const res = await fetch("/api/adaptive/apply", { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error ?? "No se pudo aplicar");
    } else {
      setMsg(`Objetivo actualizado a ${data.profile.targetKcal} kcal ✓`);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div>
      <button
        onClick={apply}
        disabled={loading}
        className="px-5 py-3 bg-secondary-container text-on-secondary-container font-label-caps text-label-caps font-bold hover:brightness-110 transition disabled:opacity-50"
      >
        {loading ? "APLICANDO..." : label}
      </button>
      {msg && <p className="mt-3 text-sm text-secondary-container">{msg}</p>}
      {err && <p className="mt-3 text-sm text-error">{err}</p>}
    </div>
  );
}
