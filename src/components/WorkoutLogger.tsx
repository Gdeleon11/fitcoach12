"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SetRow = { exerciseName: string; reps: string; weightKg: string; rir: string };
type Recent = { id: string; name: string | null; date: string; volumeKg: number | null; rpe: number | null; setCount: number; durationM?: number | null; distanceKm?: number | null };

const empty: SetRow = { exerciseName: "", reps: "", weightKg: "", rir: "" };

const parseVal = (val: string) => {
  if (!val || !val.trim()) return undefined;
  const num = Number(val.trim().replace(",", "."));
  return isNaN(num) ? undefined : num;
};

export default function WorkoutLogger({ recent }: { recent: Recent[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("STRENGTH");
  const [rpe, setRpe] = useState("");
  const [durationM, setDurationM] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [sets, setSets] = useState<SetRow[]>([{ ...empty }]);
  const [list, setList] = useState<Recent[]>(recent);
  const [saving, setSaving] = useState(false);
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 10));

  const volume = sets.reduce((a, s) => a + (parseVal(s.reps) || 0) * (parseVal(s.weightKg) || 0), 0);

  function updateSet(i: number, k: keyof SetRow, val: string) {
    setSets((p) => p.map((s, idx) => (idx === i ? { ...s, [k]: val } : s)));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const cleanSets = sets
      .filter((s) => s.exerciseName.trim())
      .map((s) => ({
        exerciseName: s.exerciseName,
        reps: parseVal(s.reps),
        weightKg: parseVal(s.weightKg),
        rir: parseVal(s.rir),
      }));
    const payload: Record<string, unknown> = { name: name || "Sesión", type };
    
    const rpeNum = parseVal(rpe);
    const durationNum = parseVal(durationM);
    const distanceNum = parseVal(distanceKm);
    
    if (rpeNum !== undefined) payload.rpe = rpeNum;
    if (durationNum !== undefined) payload.durationM = durationNum;
    if (distanceNum !== undefined) payload.distanceKm = distanceNum;
    
    if (type === "STRENGTH" && cleanSets.length) {
      payload.sets = cleanSets;
    }
    
    if (dateStr) payload.date = dateStr; // Send YYYY-MM-DD directly

    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok && data.workout) {
      const w = data.workout;
      setList((p) => [{ id: w.id, name: w.name, date: new Date(w.date).toISOString().slice(0, 10), volumeKg: w.volumeKg, rpe: w.rpe, setCount: (w.sets ?? []).length, durationM: w.durationM, distanceKm: w.distanceKm }, ...p]);
      setName(""); setRpe(""); setDurationM(""); setDistanceKm(""); setSets([{ ...empty }]);
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={save} className="glass-card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block col-span-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant">FECHA (puedes registrar días pasados)</span>
            <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} className="mt-1 w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-2 py-2 rounded" />
          </label>
          <label className="block col-span-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant">NOMBRE SESIÓN</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Empuje A" className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2" />
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
            <span className="font-label-caps text-label-caps text-on-surface-variant">RPE (1-10)</span>
            <input type="number" step="any" value={rpe} onChange={(e) => setRpe(e.target.value)} className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2" />
          </label>
          <label className="block">
            <span className="font-label-caps text-label-caps text-on-surface-variant">DURACIÓN (min)</span>
            <input type="number" value={durationM} onChange={(e) => setDurationM(e.target.value)} placeholder="Ej. 30" className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2" />
          </label>
          {type !== "STRENGTH" && (
            <label className="block">
              <span className="font-label-caps text-label-caps text-on-surface-variant">DISTANCIA (km)</span>
              <input type="number" step="any" value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} placeholder="Ej. 5" className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2" />
            </label>
          )}
        </div>

        {type === "STRENGTH" && (
          <div>
          <span className="font-label-caps text-label-caps text-on-surface-variant">SERIES</span>
          <div className="mt-2 space-y-2">
            {sets.map((s, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input value={s.exerciseName} onChange={(e) => updateSet(i, "exerciseName", e.target.value)} placeholder="Ejercicio" className="col-span-5 bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-1.5 text-sm" />
                <input value={s.reps} onChange={(e) => updateSet(i, "reps", e.target.value)} placeholder="reps" type="number" className="col-span-2 bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-1.5 text-sm" />
                <input value={s.weightKg} onChange={(e) => updateSet(i, "weightKg", e.target.value)} placeholder="kg" type="number" step="any" className="col-span-2 bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-1.5 text-sm" />
                <input value={s.rir} onChange={(e) => updateSet(i, "rir", e.target.value)} placeholder="RIR" type="number" className="col-span-2 bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-1.5 text-sm" />
                <button type="button" onClick={() => setSets((p) => p.filter((_, idx) => idx !== i))} className="col-span-1 material-symbols-outlined text-on-surface-variant hover:text-error text-base">close</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setSets((p) => [...p, { ...empty }])} className="mt-2 font-label-caps text-label-caps text-primary hover:underline">
            + AÑADIR SERIE
          </button>
        </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-outline-variant">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            RESUMEN
          </span>
          <span className="font-data-point text-data-point text-primary">
            {type === "STRENGTH" ? `${sets.filter(s => s.exerciseName).length} series` : `${durationM || 0} min`}
          </span>
        </div>
        <button type="submit" disabled={saving} className="w-full py-3 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold hover:brightness-110 transition disabled:opacity-50">
          {saving ? "GUARDANDO..." : "GUARDAR SESIÓN"}
        </button>
      </form>

      <div className="glass-card p-6">
        <span className="font-label-caps text-label-caps text-on-surface-variant">SESIONES RECIENTES</span>
        <div className="mt-4 divide-y divide-outline-variant">
          {list.length === 0 && <p className="text-sm text-on-surface-variant py-4">Aún no hay sesiones registradas.</p>}
          {list.map((w) => (
            <div key={w.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="text-sm text-on-surface">{w.name || "Sesión"}</p>
                <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">
                  {w.date} · {w.setCount > 0 ? `${w.setCount} series` : (w.distanceKm ? `${w.distanceKm} km` : "0 series")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-data-point text-sm text-primary">
                  {w.durationM ? `${w.durationM} min` : (w.distanceKm ? `${w.distanceKm} km` : "—")}
                </p>
                <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">RPE {w.rpe ?? "—"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
