"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Item = {
  id: string;
  date: string;
  weightKg: number | null;
  steps: number | null;
  activeKcal: number | null;
  distanceKm: number | null;
};

export default function CheckInHistory({ initial }: { initial: Item[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initial);

  async function remove(id: string) {
    if (!confirm("¿Eliminar este check-in?")) return;
    setItems((p) => p.filter((x) => x.id !== id));
    await fetch("/api/checkins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <div className="glass-card p-6">
      <span className="font-label-caps text-label-caps text-on-surface-variant">HISTORIAL</span>
      <div className="mt-4 divide-y divide-outline-variant">
        {items.length === 0 && <p className="text-sm text-on-surface-variant py-4">Aún no hay check-ins. Registra el primero.</p>}
        {items.map((c) => (
          <div key={c.id} className="py-3 flex justify-between items-center gap-3">
            <span className="font-label-caps text-label-caps text-on-surface-variant shrink-0">{c.date}</span>
            <div className="flex items-center gap-3">
              <span className="font-data-point text-sm text-right">
                {c.weightKg ? `${c.weightKg}kg` : "—"} · {c.steps ? `${c.steps} pasos` : "—"}
                {c.activeKcal ? ` · ${c.activeKcal}kcal act.` : ""}
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
        ))}
      </div>
    </div>
  );
}
