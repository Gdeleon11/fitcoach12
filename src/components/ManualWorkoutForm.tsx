"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Row = { name: string; sets: string; reps: string; weight: string; rir: string };
const empty: Row = { name: "", sets: "3", reps: "", weight: "", rir: "" };

export default function ManualWorkoutForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [name, setName] = useState("");
  const [type, setType] = useState("STRENGTH");
  const [rpe, setRpe] = useState("");
  const [rows, setRows] = useState<Row[]>([{ ...empty }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(i: number, k: keyof Row, val: string) {
    setRows((p) => p.map((r, idx) => (idx === i ? { ...r, [k]: val } : r)));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    // Expand each exercise into its set count for correct volume.
    const sets: { exerciseName: string; reps?: number; weightKg?: number; rir?: number }[] = [];
    for (const r of rows) {
      if (!r.name.trim()) continue;
      const n = Math.max(1, Math.round(Number(r.sets) || 1));
      for (let i = 0; i < n; i++) {
        sets.push({
          exerciseName: r.name.trim(),
          reps: r.reps ? Number(r.reps) : undefined,
          weightKg: r.weight ? Number(r.weight) : undefined,
          rir: r.rir ? Number(r.rir) : undefined,
        });
      }
    }
    if (sets.length === 0) {
      setError("Añade al menos un ejercicio con nombre.");
      setSaving(false);
      return;
    }
    const payload: Record<string, unknown> = { date, name: name || "Sesión", type, sets };
    if (rpe) payload.rpe = Number(rpe);
    const res = await fetch("/api/workouts", {
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
    setName(""); setRpe(""); setRows([{ ...empty }]);
    setSaving(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="glass-card w-full p-4 flex items-center justify-center gap-2 text-on-surface-variant hover:text-primary hover:border-primary transition font-label-caps text-label-caps"
      >
        <span className="material-symbols-outlined text-base">history</span>
        REGISTRAR SESIÓN PASADA (MANUAL)
      </button>
    );
  }

  return (
    <form onSubmit={save} className="glass-card p-6 space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-label-caps text-label-caps text-on-surface-variant">SESIÓN MANUAL / PASADA</span>
        <button type="button" onClick={() => setOpen(false)} className="material-symbols-outlined text-on-surface-variant hover:text-error text-base">close</button>
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="font-label-caps text-label-caps text-on-surface-variant">FECHA</span>
          <input type="date" value={date} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2" />
        </label>
        <label className="block">
          <span className="font-label-caps text-label-caps text-on-surface-variant">TIPO</span>
          <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-2 py-2 rounded">
            <option value="STRENGTH">Fuerza</option>
            <option value="CARDIO">Cardio</option>
            <option value="SPORT">Deporte</option>
            <option value="MOBILITY">Movilidad</option>
          </select>
        </label>
        <label className="block">
          <span className="font-label-caps text-label-caps text-on-surface-variant">NOMBRE</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Empuje A" className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2" />
        </label>
        <label className="block">
          <span className="font-label-caps text-label-caps text-on-surface-variant">RPE</span>
          <input type="number" step="any" value={rpe} onChange={(e) => setRpe(e.target.value)} className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2" />
        </label>
      </div>

      <div>
        <span className="font-label-caps text-label-caps text-on-surface-variant">EJERCICIOS</span>
        <div className="mt-2 space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input value={r.name} onChange={(e) => update(i, "name", e.target.value)} placeholder="Ejercicio" className="col-span-4 bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-1.5 text-sm" />
              <input value={r.sets} onChange={(e) => update(i, "sets", e.target.value)} placeholder="series" type="number" className="col-span-2 bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-1.5 text-sm" />
              <input value={r.reps} onChange={(e) => update(i, "reps", e.target.value)} placeholder="reps" type="number" className="col-span-2 bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-1.5 text-sm" />
              <input value={r.weight} onChange={(e) => update(i, "weight", e.target.value)} placeholder="kg" type="number" step="any" className="col-span-2 bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-1.5 text-sm" />
              <input value={r.rir} onChange={(e) => update(i, "rir", e.target.value)} placeholder="RIR" type="number" className="col-span-1 bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-1.5 text-sm" />
              <button type="button" onClick={() => setRows((p) => p.filter((_, idx) => idx !== i))} className="col-span-1 material-symbols-outlined text-on-surface-variant hover:text-error text-base">close</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setRows((p) => [...p, { ...empty }])} className="mt-2 font-label-caps text-label-caps text-primary hover:underline">
          + AÑADIR EJERCICIO
        </button>
      </div>

      <button type="submit" disabled={saving} className="w-full py-3 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold hover:brightness-110 transition disabled:opacity-50">
        {saving ? "GUARDANDO..." : "GUARDAR SESIÓN"}
      </button>
    </form>
  );
}
