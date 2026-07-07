// Relative Fat Mass (RFM) — a validated body-fat estimate that needs only
// height and waist circumference (same units). Orientative, not a measurement.
// Men:   RFM = 64 − 20 × (height / waist)
// Women: RFM = 76 − 20 × (height / waist)

export type Sex = "MALE" | "FEMALE" | "OTHER" | null | undefined;

export function estimateBodyFatRFM(heightCm: number | null, waistCm: number | null, sex: Sex): number | null {
  if (!heightCm || !waistCm || waistCm <= 0) return null;
  const ratio = heightCm / waistCm;
  const base = sex === "FEMALE" ? 76 : sex === "OTHER" ? 70 : 64;
  const rfm = base - 20 * ratio;
  return Math.round(Math.max(3, Math.min(60, rfm)) * 10) / 10;
}

// Color + label comparing an estimate to a goal (lower is better).
export function bodyFatStatus(estimate: number | null, goal: number | null): { color: string; gap: number | null; label: string } {
  if (estimate == null || goal == null) return { color: "#849495", gap: null, label: "—" };
  const gap = Math.round((estimate - goal) * 10) / 10;
  if (gap <= 0) return { color: "#c3f400", gap, label: "En objetivo" };
  if (gap <= 3) return { color: "#FFCC00", gap, label: `+${gap}% del objetivo` };
  return { color: "#FF3B30", gap, label: `+${gap}% del objetivo` };
}
