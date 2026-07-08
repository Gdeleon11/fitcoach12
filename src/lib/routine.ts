import { aiJson } from "@/lib/ai";

export type PlanExercise = {
  name: string;
  sets: number;
  reps: string; // "6-8" or "8"
  suggestedWeightKg: number | null;
  note?: string;
};

export const FOCUS_OPTIONS = [
  { key: "full", label: "Full body" },
  { key: "push", label: "Empuje (pecho/hombro/tríceps)" },
  { key: "pull", label: "Tirón (espalda/bíceps)" },
  { key: "legs", label: "Pierna" },
  { key: "upper", label: "Tren superior" },
  { key: "lower", label: "Tren inferior" },
  { key: "hiit", label: "HIIT (Alta intensidad)" },
  { key: "cardio", label: "Cardio (Resistencia)" },
] as const;

export type FocusKey = (typeof FOCUS_OPTIONS)[number]["key"];

export function focusLabel(key: string): string {
  return FOCUS_OPTIONS.find((f) => f.key === key)?.label ?? "Full body";
}

// Rule-based fallback templates (used when AI is unavailable).
const TEMPLATES: Record<string, { name: string; exercises: Omit<PlanExercise, "suggestedWeightKg">[] }> = {
  push: {
    name: "Empuje",
    exercises: [
      { name: "Press de banca", sets: 4, reps: "6-8" },
      { name: "Press militar", sets: 3, reps: "8-10" },
      { name: "Press inclinado con mancuernas", sets: 3, reps: "10" },
      { name: "Elevaciones laterales", sets: 3, reps: "12-15" },
      { name: "Extensión de tríceps en polea", sets: 3, reps: "12" },
    ],
  },
  pull: {
    name: "Tirón",
    exercises: [
      { name: "Dominadas", sets: 4, reps: "6-8" },
      { name: "Remo con barra", sets: 4, reps: "8" },
      { name: "Jalón al pecho", sets: 3, reps: "10-12" },
      { name: "Curl de bíceps con barra", sets: 3, reps: "10-12" },
      { name: "Face pull", sets: 3, reps: "15" },
    ],
  },
  legs: {
    name: "Pierna",
    exercises: [
      { name: "Sentadilla", sets: 4, reps: "6-8" },
      { name: "Peso muerto rumano", sets: 3, reps: "8-10" },
      { name: "Prensa", sets: 3, reps: "10-12" },
      { name: "Curl femoral", sets: 3, reps: "12" },
      { name: "Elevación de gemelos", sets: 4, reps: "15" },
    ],
  },
  upper: {
    name: "Tren superior",
    exercises: [
      { name: "Press de banca", sets: 4, reps: "8" },
      { name: "Remo con barra", sets: 4, reps: "8" },
      { name: "Press militar", sets: 3, reps: "10" },
      { name: "Jalón al pecho", sets: 3, reps: "10-12" },
      { name: "Curl de bíceps", sets: 3, reps: "12" },
    ],
  },
  lower: {
    name: "Tren inferior",
    exercises: [
      { name: "Sentadilla", sets: 4, reps: "8" },
      { name: "Peso muerto rumano", sets: 3, reps: "8-10" },
      { name: "Zancadas", sets: 3, reps: "10" },
      { name: "Curl femoral", sets: 3, reps: "12" },
      { name: "Elevación de gemelos", sets: 4, reps: "15" },
    ],
  },
  full: {
    name: "Full body",
    exercises: [
      { name: "Sentadilla", sets: 3, reps: "8" },
      { name: "Press de banca", sets: 3, reps: "8" },
      { name: "Remo con barra", sets: 3, reps: "8-10" },
      { name: "Press militar", sets: 3, reps: "10" },
      { name: "Curl de bíceps", sets: 3, reps: "12" },
    ],
  },
  hiit: {
    name: "HIIT",
    exercises: [
      { name: "Burpees", sets: 4, reps: "45 seg" },
      { name: "Mountain Climbers", sets: 4, reps: "45 seg" },
      { name: "Jumping Jacks", sets: 4, reps: "45 seg" },
      { name: "Sentadilla con salto", sets: 4, reps: "45 seg" },
      { name: "Plancha", sets: 4, reps: "45 seg" },
    ],
  },
  cardio: {
    name: "Cardio",
    exercises: [
      { name: "Trotadora / Correr", sets: 1, reps: "20 min" },
      { name: "Remo ergómetro", sets: 1, reps: "10 min" },
      { name: "Bicicleta estática", sets: 1, reps: "15 min" },
    ],
  },
};

function templateFor(focus: string) {
  return TEMPLATES[focus] ?? TEMPLATES.full;
}

// Best (max) weight the user has previously used per normalized exercise name.
export function bestWeightByExercise(
  history: { exerciseName: string; weightKg: number | null }[]
): Map<string, number> {
  const map = new Map<string, number>();
  for (const s of history) {
    if (typeof s.weightKg !== "number") continue;
    const key = s.exerciseName.trim().toLowerCase();
    map.set(key, Math.max(map.get(key) ?? 0, s.weightKg));
  }
  return map;
}

function attachSuggestedWeights(
  exercises: Omit<PlanExercise, "suggestedWeightKg">[],
  best: Map<string, number>
): PlanExercise[] {
  return exercises.map((e) => ({
    ...e,
    suggestedWeightKg: best.get(e.name.trim().toLowerCase()) ?? null,
  }));
}

export type BuiltRoutine = {
  name: string;
  focus: string;
  source: "ai" | "template";
  rationale: string | null;
  exercises: PlanExercise[];
};

// Builds a routine: tries AI first, falls back to templates. Always succeeds.
export async function buildRoutine(params: {
  focus: string;
  phase?: string | null;
  goalBodyFat?: number | null;
  best: Map<string, number>;
}): Promise<BuiltRoutine> {
  const { focus, best } = params;
  const label = focusLabel(focus);

  const knownLifts = [...best.entries()]
    .slice(0, 12)
    .map(([name, w]) => `${name}: ${w}kg`)
    .join(", ");

  const ai = await aiJson<{ name?: string; rationale?: string; exercises?: PlanExercise[] }>(
    "Eres un entrenador de fuerza. Diseña UNA sesión de entrenamiento para el foco indicado.",
    `Foco: ${label}. Objetivo grasa corporal: ${params.goalBodyFat ?? 12}%. Fase: ${params.phase ?? "hipertrofia"}.
Pesos previos del usuario (para sugerir cargas realistas): ${knownLifts || "sin historial"}.
Devuelve JSON con esta forma exacta:
{"name": string, "rationale": string breve, "exercises": [{"name": string, "sets": number, "reps": string (ej "6-8"), "suggestedWeightKg": number|null, "note": string opcional}]}
Entre 4 y 6 ejercicios. Usa nombres de ejercicios en español.`
  );

  if (ai && Array.isArray(ai.exercises) && ai.exercises.length >= 3) {
    const exercises: PlanExercise[] = ai.exercises.slice(0, 7).map((e) => ({
      name: String(e.name ?? "Ejercicio"),
      sets: Math.max(1, Math.min(8, Math.round(Number(e.sets) || 3))),
      reps: String(e.reps ?? "8-10"),
      suggestedWeightKg:
        typeof e.suggestedWeightKg === "number"
          ? e.suggestedWeightKg
          : best.get(String(e.name ?? "").trim().toLowerCase()) ?? null,
      note: e.note ? String(e.note) : undefined,
    }));
    return {
      name: ai.name || `${label}`,
      focus,
      source: "ai",
      rationale: ai.rationale ?? null,
      exercises,
    };
  }

  // Fallback: template.
  const t = templateFor(focus);
  return {
    name: t.name,
    focus,
    source: "template",
    rationale: "Rutina base por plantilla (IA no disponible en este momento).",
    exercises: attachSuggestedWeights(t.exercises, best),
  };
}
