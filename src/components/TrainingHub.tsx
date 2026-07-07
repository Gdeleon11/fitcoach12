"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FOCUS_OPTIONS, focusLabel, type PlanExercise } from "@/lib/routine";
import ManualWorkoutForm from "@/components/ManualWorkoutForm";

type ActivePlan = {
  id: string;
  name: string;
  focus: string | null;
  source: string;
  rationale: string | null;
  exercises: PlanExercise[];
};
type Recent = { id: string; name: string | null; date: string; volumeKg: number | null; setCount: number };

type RowState = { sets: string; reps: string; weight: string; rir: string; done: boolean };

export default function TrainingHub({ activePlan, recent }: { activePlan: ActivePlan | null; recent: Recent[] }) {
  const router = useRouter();
  const [focus, setFocus] = useState<string>("full");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [deletingW, setDeletingW] = useState<Set<string>>(new Set());

  async function deleteWorkout(id: string) {
    if (!confirm("¿Eliminar esta sesión?")) return;
    setDeletingW((prev) => new Set(prev).add(id));
    await fetch("/api/workouts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }
  const visibleRecent = recent.filter((w) => !deletingW.has(w.id));

  async function generate() {
    setGenerating(true);
    setGenError(null);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 50000);
    try {
      const res = await fetch("/api/workout-plans/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ focus }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setGenError(d.error ?? "No se pudo generar la rutina");
      } else {
        router.refresh();
      }
    } catch {
      setGenError("La generación tardó demasiado. Intenta de nuevo.");
    } finally {
      clearTimeout(timer);
      setGenerating(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {activePlan ? (
          <RoutineRunner plan={activePlan} />
        ) : (
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary-fixed-dim">smart_toy</span>
              <span className="font-label-caps text-label-caps">GENERAR RUTINA CON IA</span>
            </div>
            <label className="block mb-4">
              <span className="font-label-caps text-label-caps text-on-surface-variant">FOCO DE LA SESIÓN</span>
              <select
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className="mt-1 w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-2 py-2 rounded"
              >
                {FOCUS_OPTIONS.map((f) => (
                  <option key={f.key} value={f.key}>{f.label}</option>
                ))}
              </select>
            </label>
            {genError && <p className="text-sm text-error mb-3">{genError}</p>}
            <button
              onClick={generate}
              disabled={generating}
              className="w-full py-3 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">{generating ? "hourglass_top" : "auto_awesome"}</span>
              {generating ? "GENERANDO RUTINA..." : "GENERAR RUTINA"}
            </button>
            <p className="mt-3 text-xs text-on-surface-variant opacity-70">
              La IA arma la sesión usando tus cargas previas. Si la IA no está disponible, se usa una plantilla.
            </p>
          </div>
        )}
        <ManualWorkoutForm />
      </div>

      <div className="glass-card p-6 h-fit">
        <span className="font-label-caps text-label-caps text-on-surface-variant">SESIONES RECIENTES</span>
        <div className="mt-4 divide-y divide-outline-variant">
          {visibleRecent.length === 0 && <p className="text-sm text-on-surface-variant py-4">Aún no hay sesiones registradas.</p>}
          {visibleRecent.map((w) => (
            <div key={w.id} className="py-3 flex justify-between items-center gap-3">
              <div>
                <p className="text-sm text-on-surface">{w.name || "Sesión"}</p>
                <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">{w.date} · {w.setCount} series</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-data-point text-sm text-primary">{w.volumeKg ? `${Math.round(w.volumeKg).toLocaleString()}kg` : "—"}</p>
                <button onClick={() => deleteWorkout(w.id)} className="material-symbols-outlined text-on-surface-variant hover:text-error text-base" title="Eliminar">delete</button>
              </div>
            </div>
          ))}
        </div>
        <Link href="/training/volume" className="mt-4 inline-block font-label-caps text-label-caps text-primary hover:underline">
          VER VOLUMEN IA →
        </Link>
      </div>
    </div>
  );
}

function RoutineRunner({ plan }: { plan: ActivePlan }) {
  const router = useRouter();
  const [rows, setRows] = useState<RowState[]>(
    plan.exercises.map((e) => ({
      sets: String(e.sets),
      reps: "",
      weight: e.suggestedWeightKg != null ? String(e.suggestedWeightKg) : "",
      rir: "",
      done: false,
    }))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(i: number, patch: Partial<RowState>) {
    setRows((p) => p.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  const doneCount = rows.filter((r) => r.done).length;

  async function finish() {
    setSaving(true);
    setError(null);
    const results = plan.exercises.map((e, i) => ({
      name: e.name,
      sets: rows[i].sets ? Math.max(1, Math.round(Number(rows[i].sets))) : e.sets,
      reps: rows[i].reps !== "" ? Math.round(Number(rows[i].reps)) : null,
      weightKg: rows[i].weight !== "" ? Number(rows[i].weight) : null,
      rir: rows[i].rir !== "" ? Math.round(Number(rows[i].rir)) : null,
      done: rows[i].done,
    }));
    const res = await fetch("/api/workout-plans/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: plan.id, results }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "No se pudo guardar la sesión");
      setSaving(false);
      return;
    }
    router.refresh();
  }

  async function discard() {
    await fetch("/api/workout-plans", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: plan.id }),
    });
    router.refresh();
  }

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">fitness_center</span>
            <h3 className="font-headline-md text-lg">{plan.name}</h3>
          </div>
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60 mt-1">
            {focusLabel(plan.focus ?? "full").toUpperCase()} · {plan.source === "ai" ? "GENERADA POR IA" : "PLANTILLA"}
          </p>
        </div>
        <button onClick={discard} className="font-label-caps text-label-caps text-on-surface-variant hover:text-error">DESCARTAR</button>
      </div>

      {plan.rationale && (
        <div className="mb-4 flex items-start gap-2 bg-surface-container-high border border-outline-variant rounded p-3">
          <span className="material-symbols-outlined text-primary-fixed-dim text-base">smart_toy</span>
          <p className="text-sm text-on-surface">{plan.rationale}</p>
        </div>
      )}

      <div className="space-y-3">
        {plan.exercises.map((e, i) => (
          <div key={i} className={"border rounded p-4 transition " + (rows[i].done ? "border-secondary-container bg-secondary-container/5" : "border-outline-variant")}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-on-surface font-bold">{e.name}</p>
                <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">
                  OBJETIVO: {e.sets} series × {e.reps} reps{e.suggestedWeightKg != null ? ` · sugerido ~${e.suggestedWeightKg}kg` : ""}
                  {e.note ? ` · ${e.note}` : ""}
                </p>
              </div>
              <button
                onClick={() => update(i, { done: !rows[i].done })}
                className={
                  "shrink-0 flex items-center gap-1 px-3 py-1.5 rounded font-label-caps text-label-caps border transition " +
                  (rows[i].done
                    ? "bg-secondary-container text-on-secondary-container border-secondary-container"
                    : "border-outline-variant text-on-surface-variant hover:border-primary")
                }
              >
                <span className="material-symbols-outlined text-base">{rows[i].done ? "check_circle" : "radio_button_unchecked"}</span>
                {rows[i].done ? "HECHO" : "MARCAR"}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Mini label="SERIES" value={rows[i].sets} onChange={(v) => update(i, { sets: v })} placeholder={String(e.sets)} />
              <Mini label="REPS" value={rows[i].reps} onChange={(v) => update(i, { reps: v })} placeholder={e.reps} />
              <Mini label="PESO (KG)" value={rows[i].weight} onChange={(v) => update(i, { weight: v })} placeholder="kg" />
              <Mini label="RIR" value={rows[i].rir} onChange={(v) => update(i, { rir: v })} placeholder="ej. 2" />
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-error mt-4">{error}</p>}
      <button
        onClick={finish}
        disabled={saving || doneCount === 0}
        className="mt-5 w-full py-3 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold hover:brightness-110 transition disabled:opacity-50"
      >
        {saving ? "GUARDANDO..." : `FINALIZAR Y GUARDAR SESIÓN (${doneCount}/${plan.exercises.length})`}
      </button>
    </div>
  );
}

function Mini({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="font-label-caps text-label-caps text-on-surface-variant">{label}</span>
      <input
        type="number"
        step="any"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2"
      />
    </label>
  );
}
