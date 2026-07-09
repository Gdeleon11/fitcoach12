"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Item = {
  id: string;
  date: string;
  weightKg: number | null;
  steps: number | null;
  activeKcal: number | null;
  basalKcal: number | null;
  distanceKm: number | null;
  aiAnalysis: string | null;
};

export default function CheckInHistory({ initial }: { initial: Item[] }) {
  const router = useRouter();
  // Render straight from the server prop (stays fresh after router.refresh());
  // only track ids being deleted so they disappear immediately.
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const items = initial.filter((x) => !deleting.has(x.id));

  async function remove(id: string) {
    if (!confirm("¿Eliminar este check-in?")) return;
    setDeleting((prev) => new Set(prev).add(id));
    await fetch("/api/checkins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-center">
        <span className="font-label-caps text-label-caps text-on-surface-variant">HISTORIAL</span>
        <span className="font-label-caps text-label-caps text-on-surface-variant opacity-50">{items.length}</span>
      </div>
      <div className="mt-4 divide-y divide-outline-variant">
        {items.length === 0 && <p className="text-sm text-on-surface-variant py-4">Aún no hay check-ins. Registra el primero.</p>}
        {items.map((c) => {
          const totalKcal = (c.activeKcal || 0) + (c.basalKcal || 0);
          return (
            <div key={c.id} className="py-4">
              <div className="flex justify-between items-center gap-3">
                <span className="font-label-caps text-label-caps text-on-surface-variant shrink-0">{c.date}</span>
                <div className="flex items-center gap-3">
                  <span className="font-data-point text-sm text-right">
                    {c.weightKg ? `${c.weightKg}kg` : "—"} · {c.steps ? `${c.steps} pasos` : "—"}
                    {totalKcal > 0 ? ` · ${totalKcal}kcal tot.` : (c.activeKcal ? ` · ${c.activeKcal}kcal act.` : "")}
                    {c.distanceKm ? ` · ${c.distanceKm}km` : ""}
                  </span>
                  <button
                    onClick={() => remove(c.id)}
                    className="material-symbols-outlined text-on-surface-variant hover:text-error text-base"
                    title="Eliminar"
                  >
                    delete
                  </button>
                </div>
              </div>
              {c.aiAnalysis && (
                <div className="mt-3 bg-primary/5 border border-primary/10 rounded p-3 relative">
                  <span className="absolute top-2 right-2 material-symbols-outlined text-primary opacity-30 text-sm">smart_toy</span>
                  <p className="text-xs text-on-surface leading-relaxed pr-6">{c.aiAnalysis}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
