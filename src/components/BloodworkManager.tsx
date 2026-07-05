"use client";

import { useMemo, useState } from "react";
import { MARKERS, findMarker, interpret, type Sex } from "@/lib/bloodmarkers";

type Marker = {
  id: string;
  markerKey: string;
  name: string;
  value: number;
  unit: string;
  panelDate: string; // YYYY-MM-DD
};

export default function BloodworkManager({ initial, sex }: { initial: Marker[]; sex: Sex }) {
  const [markers, setMarkers] = useState<Marker[]>(initial);
  const [markerKey, setMarkerKey] = useState(MARKERS[0].key);
  const [value, setValue] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedDef = findMarker(markerKey);

  // Latest value per marker for the summary.
  const latestByMarker = useMemo(() => {
    const map = new Map<string, Marker>();
    for (const m of markers) {
      const cur = map.get(m.markerKey);
      if (!cur || m.panelDate > cur.panelDate) map.set(m.markerKey, m);
    }
    return [...map.values()];
  }, [markers]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const v = Number(value);
    if (!Number.isFinite(v)) {
      setError("Ingresa un valor numérico");
      return;
    }
    setSaving(true);
    setError(null);
    const res = await fetch("/api/bloodwork", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markerKey, value: v, unit: selectedDef?.unit, panelDate: date }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "No se pudo guardar");
    } else {
      setMarkers((p) => [{ ...data.marker, panelDate: data.marker.panelDate.slice(0, 10) }, ...p]);
      setValue("");
    }
    setSaving(false);
  }

  async function remove(id: string) {
    setMarkers((p) => p.filter((x) => x.id !== id));
    await fetch("/api/bloodwork", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  const flagged = latestByMarker.filter((m) => {
    const s = interpret(m.markerKey, m.value, sex).status;
    return s === "low" || s === "high";
  });

  return (
    <div className="space-y-6">
      {/* Add form */}
      <form onSubmit={add} className="glass-card p-6 space-y-4">
        <span className="font-label-caps text-label-caps text-on-surface-variant">AÑADIR BIOMARCADOR</span>
        {error && <div className="text-sm text-error border border-error/40 bg-error/10 px-3 py-2 rounded">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <label className="block md:col-span-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant">MARCADOR</span>
            <select value={markerKey} onChange={(e) => setMarkerKey(e.target.value)} className="mt-1 w-full bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-2 py-2 rounded">
              {MARKERS.map((m) => (
                <option key={m.key} value={m.key}>{m.name} ({m.unit})</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="font-label-caps text-label-caps text-on-surface-variant">VALOR {selectedDef ? `(${selectedDef.unit})` : ""}</span>
            <input type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)} className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2" />
          </label>
          <label className="block">
            <span className="font-label-caps text-label-caps text-on-surface-variant">FECHA</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2" />
          </label>
        </div>
        <button type="submit" disabled={saving} className="w-full py-3 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold hover:brightness-110 transition disabled:opacity-50">
          {saving ? "GUARDANDO..." : "AÑADIR RESULTADO"}
        </button>
        <p className="text-xs text-on-surface-variant opacity-70">
          Interpretación orientativa según rangos de referencia. No sustituye el criterio de un profesional de salud.
        </p>
      </form>

      {markers.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">labs</span>
          <p className="mt-3 text-on-surface-variant">Aún no hay resultados. Ingresa tus valores de laboratorio arriba y la app los interpreta.</p>
        </div>
      ) : (
        <>
          {/* Flags summary */}
          {flagged.length > 0 && (
            <div className="glass-card p-6 border-l-4 border-error">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-error">warning</span>
                <span className="font-label-caps text-label-caps text-error">FUERA DE RANGO ({flagged.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {flagged.map((m) => {
                  const it = interpret(m.markerKey, m.value, sex);
                  return (
                    <span key={m.id} className="px-3 py-1 rounded border font-label-caps text-label-caps" style={{ borderColor: it.color, color: it.color }}>
                      {m.name}: {m.value}{m.unit} · {it.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Latest panel summary */}
          <div className="glass-card p-6">
            <h3 className="font-headline-md text-lg mb-4">Último valor por marcador</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {latestByMarker.map((m) => {
                const it = interpret(m.markerKey, m.value, sex);
                return (
                  <div key={m.id} className="flex items-center justify-between border border-outline-variant rounded p-3">
                    <div>
                      <p className="text-on-surface">{m.name}</p>
                      <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">
                        {it.range ? `ref ${it.range.min}–${it.range.max} ${m.unit}` : "sin referencia"} · {m.panelDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-data-point text-data-point" style={{ color: it.color }}>{m.value}<span className="text-xs text-on-surface-variant"> {m.unit}</span></p>
                      <p className="font-label-caps text-label-caps" style={{ color: it.color }}>{it.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full history */}
          <div className="glass-card p-6">
            <h3 className="font-headline-md text-lg mb-4">Historial</h3>
            <div className="divide-y divide-outline-variant">
              {markers.map((m) => {
                const it = interpret(m.markerKey, m.value, sex);
                return (
                  <div key={m.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-on-surface">{m.name} <span className="text-on-surface-variant">· {m.value}{m.unit}</span></p>
                      <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">{m.panelDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-label-caps text-label-caps" style={{ color: it.color }}>{it.label}</span>
                      <button onClick={() => remove(m.id)} className="material-symbols-outlined text-on-surface-variant hover:text-error text-base" title="Eliminar">delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
