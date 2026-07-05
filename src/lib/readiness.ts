// Readiness score computed from daily check-in wellness markers.
// All sub-scores are normalized to 0-100 (higher = more ready to train hard).

export type ReadinessInput = {
  sleepH: number | null;
  energy: number | null; // 1-5, higher better
  fatigue: number | null; // 1-5, higher = MORE fatigued (worse)
  stress: number | null; // 1-5, higher = MORE stressed (worse)
  digestion: number | null; // 1-5, higher better
};

export type Component = { key: string; label: string; score: number | null };

const scale5 = (v: number) => Math.max(0, Math.min(100, ((v - 1) / 4) * 100));
const invScale5 = (v: number) => Math.max(0, Math.min(100, ((5 - v) / 4) * 100));

// Sleep: 8h+ = 100, 5h = ~40, 4h or less floors out.
function sleepScore(h: number) {
  if (h >= 8) return 100;
  if (h <= 4) return 20;
  return Math.round(20 + ((h - 4) / 4) * 80);
}

export type ReadinessResult = {
  score: number | null;
  band: "optimal" | "caution" | "recover" | "unknown";
  headline: string;
  recommendation: string;
  components: Component[];
};

export function computeReadiness(input: ReadinessInput): ReadinessResult {
  const components: Component[] = [
    { key: "sleep", label: "Sueño", score: input.sleepH != null ? sleepScore(input.sleepH) : null },
    { key: "energy", label: "Energía", score: input.energy != null ? scale5(input.energy) : null },
    { key: "fatigue", label: "Recuperación", score: input.fatigue != null ? invScale5(input.fatigue) : null },
    { key: "stress", label: "Estrés", score: input.stress != null ? invScale5(input.stress) : null },
    { key: "digestion", label: "Digestión", score: input.digestion != null ? scale5(input.digestion) : null },
  ];

  // Weighted: sleep and fatigue dominate recovery readiness.
  const weights: Record<string, number> = { sleep: 0.3, energy: 0.2, fatigue: 0.25, stress: 0.15, digestion: 0.1 };
  let sum = 0;
  let wSum = 0;
  for (const c of components) {
    if (c.score != null) {
      sum += c.score * weights[c.key];
      wSum += weights[c.key];
    }
  }
  if (wSum === 0) {
    return {
      score: null,
      band: "unknown",
      headline: "Sin datos de readiness",
      recommendation: "Completa un check-in con sueño, energía y fatiga para calcular tu readiness.",
      components,
    };
  }
  const score = Math.round(sum / wSum);
  let band: ReadinessResult["band"];
  let headline: string;
  let recommendation: string;
  if (score >= 75) {
    band = "optimal";
    headline = "Sistema óptimo";
    recommendation = "Verde para alta intensidad. Ataca tu sesión principal y busca PRs o volumen alto.";
  } else if (score >= 50) {
    band = "caution";
    headline = "Precaución";
    recommendation = "Entrena, pero modera el volumen o la carga. Prioriza técnica y deja 1-2 reps en reserva.";
  } else {
    band = "recover";
    headline = "Prioriza recuperación";
    recommendation = "Readiness baja: sesión ligera, movilidad o descanso. Enfócate en sueño e hidratación hoy.";
  }
  return { score, band, headline, recommendation, components };
}
