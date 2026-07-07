"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckInForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [v, setV] = useState({
    date: new Date().toISOString().slice(0, 10),
    weightKg: "",
    waistCm: "",
    sleepH: "",
    steps: "",
    activeKcal: "",
    basalKcal: "",
    distanceKm: "",
    energy: 3,
    hunger: 3,
    fatigue: 3,
    digestion: 3,
    stress: 3,
    notes: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload: Record<string, unknown> = {
      date: v.date,
      energy: v.energy,
      hunger: v.hunger,
      fatigue: v.fatigue,
      digestion: v.digestion,
      stress: v.stress,
    };
    if (v.weightKg) payload.weightKg = Number(v.weightKg);
    if (v.waistCm) payload.waistCm = Number(v.waistCm);
    if (v.sleepH) payload.sleepH = Number(v.sleepH);
    if (v.steps) payload.steps = Number(v.steps);
    if (v.activeKcal) payload.activeKcal = Number(v.activeKcal);
    if (v.basalKcal) payload.basalKcal = Number(v.basalKcal);
    if (v.distanceKm) payload.distanceKm = Number(v.distanceKm);
    if (v.notes) payload.notes = v.notes;

    const res = await fetch("/api/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "No se pudo guardar");
      setSaving(false);
      return;
    }
    setDone(true);
    setSaving(false);
    setV((p) => ({ ...p, weightKg: "", waistCm: "", sleepH: "", steps: "", activeKcal: "", basalKcal: "", distanceKm: "", notes: "" }));
    router.refresh();
    setTimeout(() => setDone(false), 2500);
  }

  return (
    <form onSubmit={submit} className="glass-card p-6 space-y-5">
      {error && <div className="text-sm text-error border border-error/40 bg-error/10 px-3 py-2 rounded">{error}</div>}
      {done && <div className="text-sm text-secondary-container border border-secondary-container/40 px-3 py-2 rounded">Check-in guardado ✓</div>}
      <label className="block">
        <span className="font-label-caps text-label-caps text-on-surface-variant">FECHA (puedes registrar días pasados)</span>
        <input
          type="date"
          value={v.date}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setV({ ...v, date: e.target.value })}
          className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2"
        />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <Field label="PESO (KG)" value={v.weightKg} onChange={(x) => setV({ ...v, weightKg: x })} type="number" />
        <Field label="CINTURA (CM)" value={v.waistCm} onChange={(x) => setV({ ...v, waistCm: x })} type="number" />
        <Field label="SUEÑO (H)" value={v.sleepH} onChange={(x) => setV({ ...v, sleepH: x })} type="number" />
        <Field label="PASOS" value={v.steps} onChange={(x) => setV({ ...v, steps: x })} type="number" />
        <Field label="CAL. ACTIVAS" value={v.activeKcal} onChange={(x) => setV({ ...v, activeKcal: x })} type="number" />
        <Field label="CAL. BASALES" value={v.basalKcal} onChange={(x) => setV({ ...v, basalKcal: x })} type="number" />
        <Field label="DISTANCIA (KM)" value={v.distanceKm} onChange={(x) => setV({ ...v, distanceKm: x })} type="number" />
      </div>
      <Rating label="ENERGÍA" value={v.energy} onChange={(x) => setV({ ...v, energy: x })} />
      <Rating label="HAMBRE" value={v.hunger} onChange={(x) => setV({ ...v, hunger: x })} />
      <Rating label="FATIGA" value={v.fatigue} onChange={(x) => setV({ ...v, fatigue: x })} />
      <Rating label="DIGESTIÓN" value={v.digestion} onChange={(x) => setV({ ...v, digestion: x })} />
      <Rating label="ESTRÉS" value={v.stress} onChange={(x) => setV({ ...v, stress: x })} />
      <label className="block">
        <span className="font-label-caps text-label-caps text-on-surface-variant">NOTAS</span>
        <textarea
          value={v.notes}
          onChange={(e) => setV({ ...v, notes: e.target.value })}
          rows={2}
          className="mt-1 w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-2 py-2 rounded"
        />
      </label>
      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold hover:brightness-110 transition disabled:opacity-50"
      >
        {saving ? "GUARDANDO..." : "GUARDAR CHECK-IN"}
      </button>
    </form>
  );
}

function Field({ label, value, onChange, type }: { label: string; value: string; onChange: (v: string) => void; type: string }) {
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

function Rating({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-label-caps text-label-caps text-on-surface-variant">{label}</span>
        <span className="font-data-point text-sm text-primary">{value}/5</span>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={
              "flex-1 h-8 rounded transition " +
              (n <= value ? "bg-primary-container" : "bg-surface-container-highest hover:bg-surface-bright")
            }
          />
        ))}
      </div>
    </div>
  );
}
