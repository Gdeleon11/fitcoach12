"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Form = {
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  activityLevel: string;
  goalBodyFat: number;
  foodWindowStart: string;
  foodWindowEnd: string;
};

const ACTIVITY = [
  ["sedentary", "Sedentario"],
  ["light", "Ligero"],
  ["moderate", "Moderado"],
  ["active", "Activo"],
  ["athlete", "Atleta"],
];

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState<Form>({
    name: "",
    age: 30,
    heightCm: 175,
    weightKg: 75,
    gender: "MALE",
    activityLevel: "moderate",
    goalBodyFat: 12,
    foodWindowStart: "07:00",
    foodWindowEnd: "17:00",
  });

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const steps = ["Perfil", "Cuerpo", "Actividad", "Objetivo & Ayuno"];

  async function finish() {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...f, onboardingDone: true }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "No se pudo guardar el perfil");
      setSaving(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-margin-mobile py-12">
      <div className="w-full max-w-lg">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">
          INITIALIZE OPERATOR // {String(step + 1).padStart(2, "0")}/04
        </p>
        <h1 className="font-headline-md text-headline-md mb-2">Configura tu sistema</h1>
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className={"h-1 flex-1 " + (i <= step ? "bg-primary-container" : "bg-surface-container-highest")} />
          ))}
        </div>

        <div className="glass-panel p-8 rounded-lg space-y-5">
          {error && (
            <div className="text-sm text-error border border-error/40 bg-error/10 px-3 py-2 rounded">{error}</div>
          )}

          {step === 0 && (
            <>
              <Text label="NOMBRE" value={f.name} onChange={(v) => set("name", v)} placeholder="Tu nombre" />
              <Num label="EDAD" value={f.age} onChange={(v) => set("age", v)} min={10} max={100} />
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant">SEXO BIOLÓGICO</span>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(["MALE", "FEMALE", "OTHER"] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => set("gender", g)}
                      className={
                        "py-2 font-label-caps text-label-caps border rounded transition " +
                        (f.gender === g
                          ? "bg-primary-container text-on-primary-container border-primary"
                          : "border-outline-variant text-on-surface-variant hover:border-primary")
                      }
                    >
                      {g === "MALE" ? "M" : g === "FEMALE" ? "F" : "OTRO"}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <Slider label="ALTURA" unit="CM" value={f.heightCm} min={140} max={220} onChange={(v) => set("heightCm", v)} />
              <Slider label="PESO" unit="KG" value={f.weightKg} min={40} max={180} onChange={(v) => set("weightKg", v)} />
            </>
          )}

          {step === 2 && (
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant">NIVEL DE ACTIVIDAD</span>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {ACTIVITY.map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => set("activityLevel", val)}
                    className={
                      "py-3 px-4 text-left font-label-caps text-label-caps border rounded transition " +
                      (f.activityLevel === val
                        ? "bg-primary-container text-on-primary-container border-primary"
                        : "border-outline-variant text-on-surface-variant hover:border-primary")
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <>
              <Slider label="OBJETIVO GRASA CORPORAL" unit="%" value={f.goalBodyFat} min={8} max={30} onChange={(v) => set("goalBodyFat", v)} />
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">INICIO VENTANA</span>
                  <input
                    type="time"
                    value={f.foodWindowStart}
                    onChange={(e) => set("foodWindowStart", e.target.value)}
                    className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2"
                  />
                </label>
                <label className="block">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">FIN VENTANA</span>
                  <input
                    type="time"
                    value={f.foodWindowEnd}
                    onChange={(e) => set("foodWindowEnd", e.target.value)}
                    className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2"
                  />
                </label>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 py-3 border border-outline-variant text-on-surface-variant font-label-caps text-label-caps hover:border-primary transition"
              >
                ATRÁS
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="flex-1 py-3 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold hover:brightness-110 transition"
              >
                SIGUIENTE
              </button>
            ) : (
              <button
                onClick={finish}
                disabled={saving}
                className="flex-1 py-3 bg-secondary-container text-on-secondary-container font-label-caps text-label-caps font-bold hover:brightness-110 transition disabled:opacity-50"
              >
                {saving ? "CALCULANDO..." : "GENERAR PLAN"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Text({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="font-label-caps text-label-caps text-on-surface-variant">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2"
      />
    </label>
  );
}

function Num({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <label className="block">
      <span className="font-label-caps text-label-caps text-on-surface-variant">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full bg-surface-container-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-on-surface px-1 py-2"
      />
    </label>
  );
}

function Slider({ label, unit, value, min, max, onChange }: { label: string; unit: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="font-label-caps text-label-caps text-on-surface-variant">{label}</span>
        <span className="font-data-point text-data-point text-primary">
          {value}
          <span className="text-label-caps text-on-surface-variant ml-1">{unit}</span>
        </span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}
