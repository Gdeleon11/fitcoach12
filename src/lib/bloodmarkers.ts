// Blood biomarker reference ranges and interpretation.
// Ranges are common adult conventional-unit references and are for general
// orientation only — NOT medical diagnosis. Sex-specific where relevant.

export type Range = { min: number; max: number };
export type MarkerDef = {
  key: string;
  name: string;
  unit: string;
  category: string;
  // higherIsBetter markers (e.g. HDL, Vitamin D): being ABOVE max is not a concern.
  higherIsBetter?: boolean;
  ranges: { default?: Range; MALE?: Range; FEMALE?: Range };
  info?: string;
};

export const MARKERS: MarkerDef[] = [
  { key: "glucose", name: "Glucosa (ayuno)", unit: "mg/dL", category: "Metabólico", ranges: { default: { min: 70, max: 99 } } },
  { key: "hba1c", name: "HbA1c", unit: "%", category: "Metabólico", ranges: { default: { min: 4.0, max: 5.6 } } },
  { key: "insulin", name: "Insulina (ayuno)", unit: "µUI/mL", category: "Metabólico", ranges: { default: { min: 2, max: 10 } } },
  { key: "total_cholesterol", name: "Colesterol total", unit: "mg/dL", category: "Lípidos", ranges: { default: { min: 125, max: 199 } } },
  { key: "ldl", name: "LDL", unit: "mg/dL", category: "Lípidos", ranges: { default: { min: 0, max: 99 } } },
  { key: "hdl", name: "HDL", unit: "mg/dL", category: "Lípidos", higherIsBetter: true, ranges: { MALE: { min: 40, max: 200 }, FEMALE: { min: 50, max: 200 } } },
  { key: "triglycerides", name: "Triglicéridos", unit: "mg/dL", category: "Lípidos", ranges: { default: { min: 0, max: 149 } } },
  { key: "testosterone_total", name: "Testosterona total", unit: "ng/dL", category: "Hormonal", ranges: { MALE: { min: 300, max: 1000 }, FEMALE: { min: 15, max: 70 } } },
  { key: "tsh", name: "TSH", unit: "mUI/L", category: "Hormonal", ranges: { default: { min: 0.4, max: 4.0 } } },
  { key: "vitamin_d", name: "Vitamina D (25-OH)", unit: "ng/mL", category: "Vitaminas", higherIsBetter: true, ranges: { default: { min: 30, max: 100 } } },
  { key: "ferritin", name: "Ferritina", unit: "ng/mL", category: "Hematología", ranges: { MALE: { min: 30, max: 400 }, FEMALE: { min: 15, max: 150 } } },
  { key: "hemoglobin", name: "Hemoglobina", unit: "g/dL", category: "Hematología", ranges: { MALE: { min: 13.5, max: 17.5 }, FEMALE: { min: 12.0, max: 15.5 } } },
  { key: "hs_crp", name: "PCR ultrasensible", unit: "mg/L", category: "Inflamación", ranges: { default: { min: 0, max: 3.0 } } },
  { key: "alt", name: "ALT (TGP)", unit: "U/L", category: "Hígado", ranges: { MALE: { min: 7, max: 55 }, FEMALE: { min: 7, max: 45 } } },
  { key: "ast", name: "AST (TGO)", unit: "U/L", category: "Hígado", ranges: { default: { min: 8, max: 48 } } },
  { key: "creatinine", name: "Creatinina", unit: "mg/dL", category: "Riñón", ranges: { MALE: { min: 0.7, max: 1.3 }, FEMALE: { min: 0.6, max: 1.1 } } },
];

export function findMarker(key: string): MarkerDef | undefined {
  return MARKERS.find((m) => m.key === key);
}

export type Sex = "MALE" | "FEMALE" | "OTHER" | null | undefined;
export type MarkerStatus = "low" | "normal" | "high" | "unknown";

export type Interpretation = {
  status: MarkerStatus;
  range: Range | null;
  label: string;
  color: string; // hex
  note: string;
};

const COLORS = { normal: "#c3f400", low: "#FFCC00", high: "#FF3B30", unknown: "#849495" };

function rangeFor(marker: MarkerDef, sex: Sex): Range | null {
  if (sex === "MALE" && marker.ranges.MALE) return marker.ranges.MALE;
  if (sex === "FEMALE" && marker.ranges.FEMALE) return marker.ranges.FEMALE;
  return marker.ranges.default ?? marker.ranges.MALE ?? marker.ranges.FEMALE ?? null;
}

export function interpret(key: string, value: number, sex: Sex): Interpretation {
  const marker = findMarker(key);
  if (!marker) {
    return { status: "unknown", range: null, label: "Sin referencia", color: COLORS.unknown, note: "Marcador personalizado: sin rango de referencia." };
  }
  const range = rangeFor(marker, sex);
  if (!range) {
    return { status: "unknown", range: null, label: "Sin referencia", color: COLORS.unknown, note: "Sin rango disponible." };
  }
  if (value < range.min) {
    return {
      status: "low",
      range,
      label: "Bajo",
      color: marker.higherIsBetter ? COLORS.high : COLORS.low,
      note: `Por debajo del rango (${range.min}–${range.max} ${marker.unit}).`,
    };
  }
  if (value > range.max) {
    return {
      status: "high",
      range,
      label: marker.higherIsBetter ? "Alto (favorable)" : "Alto",
      color: marker.higherIsBetter ? COLORS.normal : COLORS.high,
      note: marker.higherIsBetter
        ? `Por encima del mínimo recomendado — favorable.`
        : `Por encima del rango (${range.min}–${range.max} ${marker.unit}).`,
    };
  }
  return { status: "normal", range, label: "Normal", color: COLORS.normal, note: `Dentro del rango (${range.min}–${range.max} ${marker.unit}).` };
}
