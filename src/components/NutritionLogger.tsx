"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Log = {
  id: string;
  mealName: string | null;
  totalKcal: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  aiEstimated: boolean;
};

type Target = { kcal: number | null; protein: number | null; carbs: number | null; fat: number | null };

export default function NutritionLogger({ target, initialLogs }: { target: Target; initialLogs: Log[] }) {
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>(initialLogs);
  const [mealName, setMealName] = useState("");
  const [desc, setDesc] = useState("");
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [aiEstimated, setAiEstimated] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const sum = (k: keyof Log) => logs.reduce((a, l) => a + ((l[k] as number) ?? 0), 0);
  const totalKcal = sum("totalKcal");
  const totalProtein = sum("proteinG");

  async function estimate() {
    if (desc.trim().length < 3) return;
    setEstimating(true);
    setNote(null);
    const res = await fetch("/api/nutrition/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: desc }),
    });
    const data = await res.json();
    if (res.ok && data.estimate) {
      setKcal(String(data.estimate.totalKcal));
      setProtein(String(data.estimate.proteinG));
      setCarbs(String(data.estimate.carbsG));
      setFat(String(data.estimate.fatG));
      setAiEstimated(true);
      setNote(data.estimate.note || null);
      if (!mealName) setMealName(desc.slice(0, 40));
    }
    setEstimating(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload: Record<string, unknown> = { mealName: mealName || desc.slice(0, 40), description: desc, aiEstimated };
    if (kcal) payload.totalKcal = Number(kcal);
    if (protein) payload.proteinG = Number(protein);
    if (carbs) payload.carbsG = Number(carbs);
    if (fat) payload.fatG = Number(fat);
    const res = await fetch("/api/nutrition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok && data.log) {
      setLogs((p) => [...p, data.log]);
      setMealName(""); setDesc(""); setKcal(""); setProtein(""); setCarbs(""); setFat(""); setAiEstimated(false); setNote(null);
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={save} className="glass-card p-6 space-y-4">
        <span className="font-label-caps text-label-caps text-on-surface-variant">AÑADIR COMIDA</span>
        <label className="block">
          <span className="font-label-caps text-label-caps text-on-surface-variant">DESCRIPCIÓN (para estimación IA)</span>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={2}
            placeholder="200g pechuga de pollo, 150g arroz, ensalada"
            className="mt-1 w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-2 py-2 rounded"
          />
        </label>
        <button
          type="button"
          onClick={estimate}
          disabled={estimating}
          className="w-full py-2 border border-outline-variant text-primary font-label-caps text-label-caps hover:border-primary transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-base">smart_toy</span>
          {estimating ? "ESTIMANDO..." : "ESTIMAR MACROS CON IA"}
        </button>
        {note && <p className="text-xs text-on-surface-variant">{note}</p>}
        <div className="grid grid-cols-2 gap-3">
          <MiniField label="NOMBRE" value={mealName} onChange={setMealName} type="text" />
          <MiniField label="KCAL" value={kcal} onChange={setKcal} type="number" />
          <MiniField label="PROT (g)" value={protein} onChange={setProtein} type="number" />
          <MiniField label="CARB (g)" value={carbs} onChange={setCarbs} type="number" />
          <MiniField label="GRASA (g)" value={fat} onChange={setFat} type="number" />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold hover:brightness-110 transition disabled:opacity-50"
        >
          {saving ? "GUARDANDO..." : "REGISTRAR COMIDA"}
        </button>
      </form>

      <div className="space-y-6">
        <div className="glass-card p-6">
          <span className="font-label-caps text-label-caps text-on-surface-variant">TOTAL HOY</span>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="font-data-point text-display-lg text-primary">{totalKcal}</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">/ {target.kcal ?? "—"} KCAL</span>
          </div>
          <div className="w-full bg-surface-container-highest h-2 mt-3">
            <div
              className="bg-primary-container h-2"
              style={{ width: `${target.kcal ? Math.min(100, Math.round((totalKcal / target.kcal) * 100)) : 0}%` }}
            />
          </div>
          <p className="mt-3 font-label-caps text-label-caps text-on-surface-variant">
            PROTEÍNA: {totalProtein}g / {target.protein ?? "—"}g
          </p>
        </div>

        <div className="glass-card p-6">
          <span className="font-label-caps text-label-caps text-on-surface-variant">COMIDAS DE HOY</span>
          <div className="mt-4 divide-y divide-outline-variant">
            {logs.length === 0 && <p className="text-sm text-on-surface-variant py-4">Aún no registras comidas hoy.</p>}
            {logs.map((l) => (
              <div key={l.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm text-on-surface flex items-center gap-2">
                    {l.mealName || "Comida"}
                    {l.aiEstimated && <span className="material-symbols-outlined text-primary-fixed-dim text-sm">smart_toy</span>}
                  </p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">
                    P{l.proteinG ?? 0} · C{l.carbsG ?? 0} · G{l.fatG ?? 0}
                  </p>
                </div>
                <span className="font-data-point text-data-point text-primary">{l.totalKcal ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniField({ label, value, onChange, type }: { label: string; value: string; onChange: (v: string) => void; type: string }) {
  return (
    <label className="block">
      <span className="font-label-caps text-label-caps text-on-surface-variant">{label}</span>
      <input
        type={type}
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2"
      />
    </label>
  );
}
