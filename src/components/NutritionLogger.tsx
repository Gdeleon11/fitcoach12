"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Log = {
  id: string;
  date: string; // YYYY-MM-DD
  mealName: string | null;
  totalKcal: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  aiEstimated: boolean;
};

type Target = { kcal: number | null; protein: number | null; carbs: number | null; fat: number | null };

const today = () => new Date().toISOString().slice(0, 10);

export default function NutritionLogger({ target, initialLogs }: { target: Target; initialLogs: Log[] }) {
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>(initialLogs);
  const [mealDate, setMealDate] = useState(today());
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

  const todays = logs.filter((l) => l.date === today());
  const totalKcal = todays.reduce((a, l) => a + (l.totalKcal ?? 0), 0);
  const totalProtein = todays.reduce((a, l) => a + (l.proteinG ?? 0), 0);

  // Group non-today logs by day (desc).
  const historyDays = Array.from(new Set(logs.filter((l) => l.date !== today()).map((l) => l.date))).sort((a, b) =>
    b.localeCompare(a)
  );

  async function estimate() {
    if (desc.trim().length < 3) return;
    setEstimating(true);
    setNote(null);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const res = await fetch("/api/nutrition/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: desc }),
        signal: controller.signal,
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
      } else {
        setNote(data.error || "No se pudo estimar. Ingresa los valores manualmente.");
      }
    } catch {
      setNote("La estimación tardó demasiado o falló. Ingresa los valores manualmente.");
    } finally {
      clearTimeout(timer);
      setEstimating(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload: Record<string, unknown> = { date: mealDate, mealName: mealName || desc.slice(0, 40), description: desc, aiEstimated };
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
      setLogs((p) => [{ ...data.log, date: data.log.date.slice(0, 10) }, ...p]);
      setMealName(""); setDesc(""); setKcal(""); setProtein(""); setCarbs(""); setFat(""); setAiEstimated(false); setNote(null);
      router.refresh();
    }
    setSaving(false);
  }

  async function remove(id: string) {
    setLogs((p) => p.filter((x) => x.id !== id));
    await fetch("/api/nutrition", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={save} className="glass-card p-6 space-y-4">
          <span className="font-label-caps text-label-caps text-on-surface-variant">AÑADIR COMIDA</span>
          <label className="block">
            <span className="font-label-caps text-label-caps text-on-surface-variant">FECHA (puedes registrar días pasados)</span>
            <input
              type="date"
              value={mealDate}
              max={today()}
              onChange={(e) => setMealDate(e.target.value)}
              className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2"
            />
          </label>
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
              {todays.length === 0 && <p className="text-sm text-on-surface-variant py-4">Aún no registras comidas hoy.</p>}
              {todays.map((l) => (
                <MealRow key={l.id} log={l} onDelete={() => remove(l.id)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {historyDays.length > 0 && (
        <div className="glass-card p-6">
          <span className="font-label-caps text-label-caps text-on-surface-variant">HISTORIAL (30 DÍAS)</span>
          <div className="mt-4 space-y-5">
            {historyDays.map((day) => {
              const dayLogs = logs.filter((l) => l.date === day);
              const dayKcal = dayLogs.reduce((a, l) => a + (l.totalKcal ?? 0), 0);
              const dayProt = dayLogs.reduce((a, l) => a + (l.proteinG ?? 0), 0);
              return (
                <div key={day}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-label-caps text-label-caps text-primary">{day}</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant opacity-60">{dayKcal} kcal · {dayProt}g P</span>
                  </div>
                  <div className="divide-y divide-outline-variant">
                    {dayLogs.map((l) => (
                      <MealRow key={l.id} log={l} onDelete={() => remove(l.id)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MealRow({ log, onDelete }: { log: Log; onDelete: () => void }) {
  return (
    <div className="py-3 flex justify-between items-center gap-3">
      <div>
        <p className="text-sm text-on-surface flex items-center gap-2">
          {log.mealName || "Comida"}
          {log.aiEstimated && <span className="material-symbols-outlined text-primary-fixed-dim text-sm">smart_toy</span>}
        </p>
        <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">
          P{log.proteinG ?? 0} · C{log.carbsG ?? 0} · G{log.fatG ?? 0}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-data-point text-data-point text-primary">{log.totalKcal ?? 0}</span>
        <button onClick={onDelete} className="material-symbols-outlined text-on-surface-variant hover:text-error text-base" title="Eliminar">
          delete
        </button>
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
