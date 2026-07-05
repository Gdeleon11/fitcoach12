import { MIN_SAFE_KCAL, macros } from "./nutrition";

export type AdaptiveInput = {
  targetKcal: number | null;
  weightKg: number | null;
  goalBodyFat: number | null;
  // oldest -> newest weight points over ~14 days
  weightSeries: { day: string; value: number }[];
  avgKcalLogged: number | null;
  daysLogged: number;
};

export type AdaptiveResult = {
  currentTarget: number | null;
  suggestedTarget: number | null;
  deltaKcal: number;
  weeklyChangePct: number | null;
  confidence: "high" | "low" | "none";
  status: "on_track" | "increase" | "decrease" | "insufficient";
  reason: string;
  suggestedMacros: { proteinG: number; carbsG: number; fatG: number } | null;
};

function daysBetween(a: string, b: string) {
  return Math.abs((new Date(b).getTime() - new Date(a).getTime()) / (24 * 60 * 60 * 1000));
}

const STEP = 130; // kcal adjustment increment

export function computeAdaptive(input: AdaptiveInput): AdaptiveResult {
  const current = input.targetKcal;
  const series = input.weightSeries;

  const base = {
    currentTarget: current,
    deltaKcal: 0,
    suggestedTarget: current,
    suggestedMacros:
      current && input.weightKg ? macros(current, input.weightKg) : null,
  };

  if (series.length < 2) {
    return {
      ...base,
      weeklyChangePct: null,
      confidence: "none",
      status: "insufficient",
      reason: "Necesitas al menos 2 registros de peso en días distintos para calcular tu tendencia y ajustar el objetivo.",
    };
  }

  const first = series[0];
  const last = series[series.length - 1];
  const span = Math.max(1, daysBetween(first.day, last.day));
  const weeklyChangePct = Math.round(((last.value - first.value) / first.value) * (7 / span) * 1000) / 10;

  const confidence: AdaptiveResult["confidence"] =
    series.length >= 3 && span >= 5 && input.daysLogged >= 3 ? "high" : "low";

  // Assume a fat-loss phase (goal to reduce). Target ~ -0.4% to -1.0% weekly.
  let status: AdaptiveResult["status"] = "on_track";
  let deltaKcal = 0;
  let reason = "";

  if (span < 3) {
    return {
      ...base,
      weeklyChangePct,
      confidence: "low",
      status: "insufficient",
      reason: "Tus registros de peso están muy juntos en el tiempo. Registra el peso a lo largo de varios días para un ajuste fiable.",
    };
  }

  if (weeklyChangePct > -0.25) {
    // Stalling or gaining.
    if (input.daysLogged < 3) {
      status = "insufficient";
      reason = `Tu peso está estancado (${weeklyChangePct}%/sem), pero registraste pocos días de nutrición. Registra 3+ días para confirmar antes de recortar calorías.`;
    } else {
      status = "decrease";
      deltaKcal = -STEP;
      reason = `Peso prácticamente estable (${weeklyChangePct}%/sem) con buena adherencia. Sugerimos recortar ~${STEP} kcal para reactivar el déficit. Alternativa: +1.500 pasos/día.`;
    }
  } else if (weeklyChangePct < -1.1) {
    // Losing too fast — risk to muscle.
    status = "increase";
    deltaKcal = STEP;
    reason = `Estás perdiendo rápido (${weeklyChangePct}%/sem). Para proteger masa magra, sugerimos subir ~${STEP} kcal y mantener proteína alta.`;
  } else {
    status = "on_track";
    reason = `Tu ritmo (${weeklyChangePct}%/sem) está en el rango óptimo de recomposición. Mantén el objetivo actual.`;
  }

  let suggestedTarget = current;
  if (current != null && deltaKcal !== 0) {
    suggestedTarget = Math.max(MIN_SAFE_KCAL, current + deltaKcal);
    // Recompute actual applied delta after safety clamp.
    deltaKcal = suggestedTarget - current;
    if (suggestedTarget === MIN_SAFE_KCAL && deltaKcal <= 0) {
      reason += " (Límite de seguridad: no bajamos de 1.200 kcal.)";
    }
  }

  return {
    currentTarget: current,
    suggestedTarget,
    deltaKcal,
    weeklyChangePct,
    confidence,
    status,
    reason,
    suggestedMacros: suggestedTarget && input.weightKg ? macros(suggestedTarget, input.weightKg) : base.suggestedMacros,
  };
}
