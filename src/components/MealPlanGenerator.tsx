"use client";

import { useState } from "react";
import type { MealPlan } from "@/lib/mealplan";

export default function MealPlanGenerator() {
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 55000);
    try {
      const res = await fetch("/api/nutrition/mealplan", { method: "POST", signal: controller.signal });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "No se pudo generar el menú.");
      else setPlan(data.plan);
    } catch {
      setError("La generación tardó demasiado o falló. Intenta de nuevo.");
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  }

  return (
    <div className="glass-card p-6 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-fixed-dim">menu_book</span>
          <span className="font-label-caps text-label-caps text-primary-fixed-dim">MENÚ SEMANAL + LISTA DE COMPRAS (IA)</span>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="px-4 py-2 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-base">{loading ? "hourglass_top" : "auto_awesome"}</span>
          {loading ? "GENERANDO..." : plan ? "REGENERAR" : "GENERAR MENÚ"}
        </button>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}
      {!plan && !error && (
        <p className="text-sm text-on-surface-variant">
          Genera un menú de 7 días ajustado a tu objetivo calórico y de proteína, con lista de compras consolidada.
        </p>
      )}

      {plan && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.days.map((d, i) => {
              const dayKcal = d.meals.reduce((a, m) => a + m.kcal, 0);
              const dayProt = d.meals.reduce((a, m) => a + m.protein, 0);
              return (
                <div key={i} className="border border-outline-variant rounded p-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <p className="font-bold text-on-surface">{d.day}</p>
                    <span className="font-label-caps text-label-caps text-on-surface-variant opacity-60">{dayKcal} kcal · {dayProt}g P</span>
                  </div>
                  <ul className="space-y-1">
                    {d.meals.map((m, j) => (
                      <li key={j} className="flex justify-between gap-3 text-sm">
                        <span className="text-on-surface">{m.name}</span>
                        <span className="font-data-point text-on-surface-variant shrink-0">{m.kcal}kcal</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="border border-outline-variant rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary">shopping_cart</span>
              <span className="font-label-caps text-label-caps">LISTA DE COMPRAS</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              {plan.shoppingList.map((item, i) => (
                <li key={i} className="text-sm text-on-surface flex items-start gap-2">
                  <span className="text-primary-fixed-dim">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
