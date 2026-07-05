"use client";

import { useMemo, useState } from "react";
import { SLOTS, slotLabel, slotIcon, slotOrder, nextDose } from "@/lib/supplements";

type Supp = {
  id: string;
  name: string;
  dosage: string | null;
  slot: string;
  time: string | null;
  notes: string | null;
  active: boolean;
};

export default function SupplementManager({ initial }: { initial: Supp[] }) {
  const [supps, setSupps] = useState<Supp[]>(initial);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [slot, setSlot] = useState<string>("MORNING");
  const [time, setTime] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nowHHMM = useMemo(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }, []);
  const upcoming = nextDose(supps, nowHHMM);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    const res = await fetch("/api/supplements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, dosage, slot, time }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "No se pudo guardar");
    } else {
      setSupps((p) => [...p, data.supplement]);
      setName(""); setDosage(""); setTime("");
    }
    setSaving(false);
  }

  async function toggle(s: Supp) {
    setSupps((p) => p.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)));
    await fetch("/api/supplements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: s.id, active: !s.active }),
    });
  }

  async function remove(id: string) {
    setSupps((p) => p.filter((x) => x.id !== id));
    await fetch("/api/supplements", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  const grouped = SLOTS.map((sl) => ({
    ...sl,
    items: supps.filter((s) => s.slot === sl.key).sort((a, b) => (a.time ?? "99").localeCompare(b.time ?? "99")),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      {/* Next dose */}
      {upcoming && (
        <div className="glass-card p-5 border-l-4 border-primary flex items-center gap-4">
          <span className="material-symbols-outlined text-primary-fixed-dim text-3xl">notifications_active</span>
          <div>
            <p className="font-label-caps text-label-caps text-primary-fixed-dim">PRÓXIMA TOMA</p>
            <p className="text-on-surface">
              <span className="font-bold">{upcoming.name}</span>
              {upcoming.dosage ? ` · ${upcoming.dosage}` : ""} — {upcoming.time} ({slotLabel(upcoming.slot)})
            </p>
          </div>
        </div>
      )}

      {/* Add form */}
      <form onSubmit={add} className="glass-card p-6 space-y-4">
        <span className="font-label-caps text-label-caps text-on-surface-variant">AÑADIR SUPLEMENTO</span>
        {error && <div className="text-sm text-error border border-error/40 bg-error/10 px-3 py-2 rounded">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="NOMBRE" value={name} onChange={setName} placeholder="Creatina" />
          <Field label="DOSIS" value={dosage} onChange={setDosage} placeholder="5 g" />
          <label className="block">
            <span className="font-label-caps text-label-caps text-on-surface-variant">MOMENTO</span>
            <select value={slot} onChange={(e) => setSlot(e.target.value)} className="mt-1 w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-2 py-2 rounded">
              {SLOTS.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="font-label-caps text-label-caps text-on-surface-variant">HORA (OPCIONAL)</span>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2" />
          </label>
        </div>
        <button type="submit" disabled={saving} className="w-full py-3 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold hover:brightness-110 transition disabled:opacity-50">
          {saving ? "GUARDANDO..." : "AÑADIR AL PLAN"}
        </button>
      </form>

      {/* Plan grouped by slot */}
      {supps.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">medication</span>
          <p className="mt-3 text-on-surface-variant">Tu plan está vacío. Añade tu primer suplemento arriba.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map((g) => (
            <div key={g.key} className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">{slotIcon(g.key)}</span>
                <span className="font-label-caps text-label-caps">{g.label.toUpperCase()}</span>
              </div>
              <div className="divide-y divide-outline-variant">
                {g.items.map((s) => (
                  <div key={s.id} className={"py-3 flex items-center justify-between " + (s.active ? "" : "opacity-40")}>
                    <div>
                      <p className="text-on-surface">
                        {s.name}
                        {s.dosage ? <span className="text-on-surface-variant"> · {s.dosage}</span> : null}
                      </p>
                      {s.time && <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">{s.time}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggle(s)}
                        className="font-label-caps text-label-caps text-primary hover:underline"
                        title={s.active ? "Pausar" : "Activar"}
                      >
                        {s.active ? "ACTIVO" : "PAUSADO"}
                      </button>
                      <button onClick={() => remove(s.id)} className="material-symbols-outlined text-on-surface-variant hover:text-error text-base" title="Eliminar">
                        delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* slots order hint uses slotOrder to keep referenced */}
          <p className="sr-only">{grouped.map((g) => slotOrder(g.key)).join(",")}</p>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="font-label-caps text-label-caps text-on-surface-variant">{label}</span>
      <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2" />
    </label>
  );
}
