import { aiJson } from "@/lib/ai";

export type Meal = { name: string; kcal: number; protein: number };
export type MealDay = { day: string; meals: Meal[] };
export type MealPlan = { days: MealDay[]; shoppingList: string[] };

export type MealPlanInput = {
  targetKcal: number | null;
  proteinG: number | null;
  carbsG?: number | null;
  fatG?: number | null;
  foodWindowStart?: string | null;
  foodWindowEnd?: string | null;
  goalBodyFat?: number | null;
  preferences?: string | null;
};

// Generates a 7-day menu + consolidated shopping list. Returns null if AI is
// unavailable (this is an AI-only feature, no rule-based fallback).
export async function generateMealPlan(input: MealPlanInput): Promise<MealPlan | null> {
  if (!input.targetKcal || !input.proteinG) return null;

  const prefsText = input.preferences ? `\nGustos y preferencias del usuario: ${input.preferences}` : "";

  const plan = await aiJson<{ days: { day: string; meals: Meal[] }[]; shoppingList: string[] }>(
    "Eres un nutricionista deportivo. Diseña 3 DÍAS DISTINTOS de menú realista para dar variedad.",
    `Objetivo diario: ${input.targetKcal} kcal, ${input.proteinG} g proteína, ${input.carbsG ?? "?"} g carbos, ${input.fatG ?? "?"} g grasa.
Ventana de comida: ${input.foodWindowStart ?? "libre"} a ${input.foodWindowEnd ?? "libre"}.${prefsText}
Devuelve JSON EXACTO con esta forma:
{"days":[{"day":"Día 1","meals":[{"name":"Desayuno: ...","kcal":number,"protein":number}]}, {"day":"Día 2",...}, {"day":"Día 3",...}], "shoppingList":["item 1", "item 2"]}
Reglas: 3-4 comidas por día que sumen el objetivo. Menús variados entre los 3 días adaptados a los gustos. Lista de compras breve. Español.`,
    800 // maxTokens allowed for 3 days
  );

  if (!plan || !Array.isArray(plan.days) || plan.days.length === 0) return null;

  // Sanitize days
  const safeDays = plan.days.slice(0, 3).map((d) => ({
    meals: (Array.isArray(d.meals) ? d.meals : []).slice(0, 6).map((m) => ({
      name: String(m.name ?? "Comida"),
      kcal: Math.max(0, Math.round(Number(m.kcal) || 0)),
      protein: Math.max(0, Math.round(Number(m.protein) || 0)),
    })),
  }));

  const shoppingList = (Array.isArray(plan.shoppingList) ? plan.shoppingList : []).slice(0, 30).map((s) => String(s));

  // Map 3 days to 7 days
  const d1 = safeDays[0];
  const d2 = safeDays[1] || d1;
  const d3 = safeDays[2] || d1;
  
  const fullDays = [
    { day: "Lunes", meals: d1.meals },
    { day: "Martes", meals: d2.meals },
    { day: "Miércoles", meals: d3.meals },
    { day: "Jueves", meals: d1.meals },
    { day: "Viernes", meals: d2.meals },
    { day: "Sábado", meals: d3.meals },
    { day: "Domingo", meals: d1.meals },
  ];

  return {
    days: fullDays,
    shoppingList,
  };
}
