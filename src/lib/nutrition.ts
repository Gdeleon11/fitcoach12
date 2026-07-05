// Core nutrition/energy math used by onboarding and the adaptive engine.

export type Gender = "MALE" | "FEMALE" | "OTHER";

const ACTIVITY_FACTORS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

// Mifflin-St Jeor BMR
export function bmr(weightKg: number, heightCm: number, age: number, gender: Gender): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === "MALE") return base + 5;
  if (gender === "FEMALE") return base - 161;
  return base - 78; // neutral average
}

export function tdee(weightKg: number, heightCm: number, age: number, gender: Gender, activityLevel: string): number {
  const factor = ACTIVITY_FACTORS[activityLevel] ?? 1.375;
  return Math.round(bmr(weightKg, heightCm, age, gender) * factor);
}

// Safety layer: never program below 1200 kcal.
export const MIN_SAFE_KCAL = 1200;

// Target calories for a lean-focused cut toward low body fat, with a modest deficit.
export function targetKcal(tdeeVal: number, goalBodyFat: number, currentBf?: number): number {
  // If a cut is warranted, apply ~18% deficit, else maintenance.
  const shouldCut = currentBf == null ? true : currentBf > goalBodyFat + 1;
  const raw = shouldCut ? Math.round(tdeeVal * 0.82) : tdeeVal;
  return Math.max(MIN_SAFE_KCAL, raw);
}

export function macros(kcal: number, weightKg: number) {
  // High protein for lean mass retention (2.2 g/kg), 25% fat, remainder carbs.
  const proteinG = Math.round(weightKg * 2.2);
  const fatG = Math.round((kcal * 0.25) / 9);
  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  const carbsG = Math.max(0, Math.round((kcal - proteinKcal - fatKcal) / 4));
  return { proteinG, carbsG, fatG };
}
