import { aiJson } from "@/lib/ai";

export type Meal = { name: string; kcal: number; protein: number };
export type MealDay = { day: string; meals: Meal[] };
export type MealPlan = { days: MealDay[]; shoppingList: string[] };

export type MealPlanInput = {
  targetKcal: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  foodWindowStart: string | null;
  foodWindowEnd: string | null;
  goalBodyFat: number | null;
};

// Generates a 7-day menu + consolidated shopping list. Returns null if AI is
// unavailable (this is an AI-only feature, no rule-based fallback).
export async function generateMealPlan(input: MealPlanInput): Promise<MealPlan | null> {
  if (!input.targetKcal || !input.proteinG) return null;

  const plan = await aiJson<MealPlan>(
    "Eres un nutricionista deportivo. Diseña un menú semanal realista y variado para alcanzar los objetivos dados.",
    `Objetivo diario: ${input.targetKcal} kcal, ${input.proteinG} g proteína, ${input.carbsG ?? "?"} g carbos, ${input.fatG ?? "?"} g grasa.
Ventana de comida: ${input.foodWindowStart ?? "libre"} a ${input.foodWindowEnd ?? "libre"}. Objetivo grasa corporal: ${input.goalBodyFat ?? 12}%.
Devuelve JSON EXACTO con esta forma:
{"days":[{"day":"Lunes","meals":[{"name":"Desayuno: ...","kcal":number,"protein":number}, ...]}, ... 7 días],
"shoppingList":["item con cantidad aproximada semanal", ...]}
Reglas: 3-4 comidas por día que sumen ~el objetivo diario de kcal y proteína. Nombres concretos de alimentos y porciones. Lista de compras consolidada de toda la semana, agrupada por alimento. Español.`,
    1800
  );

  if (!plan || !Array.isArray(plan.days) || plan.days.length === 0) return null;

  // Sanitize/clamp shape.
  return {
    days: plan.days.slice(0, 7).map((d) => ({
      day: String(d.day ?? "Día"),
      meals: (Array.isArray(d.meals) ? d.meals : []).slice(0, 6).map((m) => ({
        name: String(m.name ?? "Comida"),
        kcal: Math.max(0, Math.round(Number(m.kcal) || 0)),
        protein: Math.max(0, Math.round(Number(m.protein) || 0)),
      })),
    })),
    shoppingList: (Array.isArray(plan.shoppingList) ? plan.shoppingList : []).slice(0, 60).map((s) => String(s)),
  };
}
