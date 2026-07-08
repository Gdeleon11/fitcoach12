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

  const plan = await aiJson<{ day: string; meals: Meal[]; shoppingList: string[] }>(
    "Eres un nutricionista deportivo. Diseña UN SOLO DÍA de menú realista para alcanzar los objetivos dados.",
    `Objetivo diario: ${input.targetKcal} kcal, ${input.proteinG} g proteína, ${input.carbsG ?? "?"} g carbos, ${input.fatG ?? "?"} g grasa.
Ventana de comida: ${input.foodWindowStart ?? "libre"} a ${input.foodWindowEnd ?? "libre"}. Objetivo grasa corporal: ${input.goalBodyFat ?? 12}%.
Devuelve JSON EXACTO con esta forma:
{"day":"Día Base","meals":[{"name":"Desayuno: ...","kcal":number,"protein":number}], "shoppingList":["item 1", "item 2"]}
Reglas: 3-4 comidas que sumen ~el objetivo diario de kcal y proteína. Nombres concretos. Lista de compras breve. Español.`,
    350 // maxTokens reduced!
  );

  if (!plan || !Array.isArray(plan.meals) || plan.meals.length === 0) return null;

  // Sanitize
  const meals = plan.meals.slice(0, 6).map((m) => ({
    name: String(m.name ?? "Comida"),
    kcal: Math.max(0, Math.round(Number(m.kcal) || 0)),
    protein: Math.max(0, Math.round(Number(m.protein) || 0)),
  }));

  const shoppingList = (Array.isArray(plan.shoppingList) ? plan.shoppingList : []).slice(0, 30).map((s) => String(s));

  // Clone into 7 days
  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const fullDays = daysOfWeek.map((dayName) => ({
    day: dayName,
    meals: [...meals], // same meals for simplicity and speed
  }));

  return {
    days: fullDays,
    shoppingList,
  };
}
