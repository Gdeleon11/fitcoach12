// Aggregation helpers for the Weekly and Composition reports.

export type CheckInLite = {
  date: Date;
  weightKg: number | null;
  waistCm: number | null;
  steps: number | null;
  sleepH: number | null;
  energy: number | null;
};
export type NutritionLite = { date: Date; totalKcal: number | null; proteinG: number | null };
export type WorkoutLite = { date: Date; volumeKg: number | null; rpe: number | null };

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const num = (x: number | null | undefined): x is number => typeof x === "number";

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export type MetricTrend = {
  first: number | null;
  last: number | null;
  delta: number | null;
  average: number | null;
  series: { day: string; value: number }[];
};

// Build an ordered (oldest→newest) trend for a numeric check-in field.
export function trend(checkins: CheckInLite[], field: "weightKg" | "waistCm"): MetricTrend {
  const points = checkins
    .filter((c) => num(c[field]))
    .map((c) => ({ day: dayKey(c.date), value: c[field] as number }))
    .sort((a, b) => a.day.localeCompare(b.day));
  if (points.length === 0) return { first: null, last: null, delta: null, average: null, series: [] };
  const first = points[0].value;
  const last = points[points.length - 1].value;
  return {
    first,
    last,
    delta: Math.round((last - first) * 10) / 10,
    average: Math.round((avg(points.map((p) => p.value)) as number) * 10) / 10,
    series: points,
  };
}

export function nutritionAdherence(logs: NutritionLite[], targetKcal: number | null, targetProtein: number | null) {
  // Sum per calendar day, then average across logged days.
  const byDay = new Map<string, { kcal: number; protein: number }>();
  for (const l of logs) {
    const k = dayKey(l.date);
    const cur = byDay.get(k) ?? { kcal: 0, protein: 0 };
    cur.kcal += l.totalKcal ?? 0;
    cur.protein += l.proteinG ?? 0;
    byDay.set(k, cur);
  }
  const days = [...byDay.values()];
  const avgKcal = days.length ? Math.round((avg(days.map((d) => d.kcal)) as number)) : null;
  const avgProtein = days.length ? Math.round((avg(days.map((d) => d.protein)) as number)) : null;
  return {
    daysLogged: days.length,
    avgKcal,
    avgProtein,
    kcalAdherencePct: avgKcal != null && targetKcal ? Math.round((avgKcal / targetKcal) * 100) : null,
    proteinAdherencePct: avgProtein != null && targetProtein ? Math.round((avgProtein / targetProtein) * 100) : null,
  };
}

export function trainingSummary(workouts: WorkoutLite[]) {
  const volumes = workouts.map((w) => w.volumeKg).filter(num);
  const rpes = workouts.map((w) => w.rpe).filter(num);
  return {
    sessions: workouts.length,
    totalVolume: volumes.length ? Math.round(volumes.reduce((a, b) => a + b, 0)) : 0,
    avgRpe: rpes.length ? Math.round((avg(rpes) as number) * 10) / 10 : null,
  };
}

export function checkinAverages(checkins: CheckInLite[]) {
  return {
    avgSteps: (() => {
      const v = checkins.map((c) => c.steps).filter(num);
      return v.length ? Math.round(avg(v) as number) : null;
    })(),
    avgSleep: (() => {
      const v = checkins.map((c) => c.sleepH).filter(num);
      return v.length ? Math.round((avg(v) as number) * 10) / 10 : null;
    })(),
    avgEnergy: (() => {
      const v = checkins.map((c) => c.energy).filter(num);
      return v.length ? Math.round((avg(v) as number) * 10) / 10 : null;
    })(),
  };
}
