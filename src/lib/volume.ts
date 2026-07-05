// Training volume & progression engine. Operates purely on a user's own logged
// workouts/sets — no seeded data. Every function returns safe empty results when
// the user has not logged anything yet.

export type SetLite = {
  exerciseName: string;
  reps: number | null;
  weightKg: number | null;
  rir: number | null;
};
export type WorkoutLite = {
  date: Date;
  volumeKg: number | null;
  rpe: number | null;
  sets: SetLite[];
};

// Monday (ISO) of the week for a given date, as YYYY-MM-DD.
export function weekStart(d: Date): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = date.getUTCDay(); // 0 Sun .. 6 Sat
  const diff = (day === 0 ? -6 : 1) - day; // shift to Monday
  date.setUTCDate(date.getUTCDate() + diff);
  return date.toISOString().slice(0, 10);
}

export type WeekVolume = { week: string; volume: number; sessions: number };

// Weekly total volume for the last `weeks` calendar weeks (oldest -> newest).
export function weeklyVolume(workouts: WorkoutLite[], weeks = 6): WeekVolume[] {
  const now = new Date();
  const buckets: string[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i * 7);
    buckets.push(weekStart(d));
  }
  const map = new Map<string, { volume: number; sessions: number }>();
  buckets.forEach((w) => map.set(w, { volume: 0, sessions: 0 }));
  for (const w of workouts) {
    const key = weekStart(w.date);
    if (!map.has(key)) continue;
    const cur = map.get(key)!;
    const vol = w.volumeKg ?? w.sets.reduce((a, s) => a + (s.reps ?? 0) * (s.weightKg ?? 0), 0);
    cur.volume += vol;
    cur.sessions += 1;
  }
  return buckets.map((w) => ({ week: w, volume: Math.round(map.get(w)!.volume), sessions: map.get(w)!.sessions }));
}

export type VolumeTrend = {
  current: number;
  previous: number;
  changePct: number | null;
  direction: "up" | "down" | "flat" | "none";
};

export function volumeTrend(weekly: WeekVolume[]): VolumeTrend {
  if (weekly.length < 2) return { current: weekly.at(-1)?.volume ?? 0, previous: 0, changePct: null, direction: "none" };
  const current = weekly[weekly.length - 1].volume;
  const previous = weekly[weekly.length - 2].volume;
  if (previous === 0) return { current, previous, changePct: null, direction: current > 0 ? "up" : "none" };
  const changePct = Math.round(((current - previous) / previous) * 100);
  const direction = changePct > 3 ? "up" : changePct < -3 ? "down" : "flat";
  return { current, previous, changePct, direction };
}

// Epley estimated 1RM.
function epley(weight: number, reps: number): number {
  return Math.round(weight * (1 + reps / 30));
}

export type ExerciseStat = {
  name: string;
  totalSets: number;
  topWeight: number | null;
  best1RM: number | null;
  lastDate: string | null;
  lastWeight: number | null;
  lastReps: number | null;
  lastRir: number | null;
  suggestion: string;
};

// Per-exercise stats + progression suggestion, from all logged sets.
export function exerciseStats(workouts: WorkoutLite[]): ExerciseStat[] {
  type Flat = { name: string; reps: number | null; weight: number | null; rir: number | null; date: Date };
  const flat: Flat[] = [];
  for (const w of workouts) {
    for (const s of w.sets) {
      if (!s.exerciseName) continue;
      flat.push({ name: s.exerciseName.trim(), reps: s.reps, weight: s.weightKg, rir: s.rir, date: w.date });
    }
  }
  const byName = new Map<string, Flat[]>();
  for (const f of flat) {
    const arr = byName.get(f.name) ?? [];
    arr.push(f);
    byName.set(f.name, arr);
  }

  const stats: ExerciseStat[] = [];
  for (const [name, sets] of byName) {
    const weights = sets.map((s) => s.weight).filter((x): x is number => typeof x === "number");
    const topWeight = weights.length ? Math.max(...weights) : null;
    const best1RM = sets.reduce<number | null>((best, s) => {
      if (typeof s.weight === "number" && typeof s.reps === "number" && s.reps > 0) {
        const e = epley(s.weight, s.reps);
        return best == null || e > best ? e : best;
      }
      return best;
    }, null);

    // Latest session for this exercise; pick its heaviest set.
    const latestDate = sets.reduce((max, s) => (s.date > max ? s.date : max), sets[0].date);
    const lastDaySets = sets.filter((s) => s.date.getTime() === latestDate.getTime());
    const topLast = lastDaySets.reduce<Flat | null>((best, s) => {
      if (typeof s.weight !== "number") return best;
      if (!best || (best.weight ?? 0) < s.weight) return s;
      return best;
    }, null);

    stats.push({
      name,
      totalSets: sets.length,
      topWeight,
      best1RM,
      lastDate: latestDate.toISOString().slice(0, 10),
      lastWeight: topLast?.weight ?? null,
      lastReps: topLast?.reps ?? null,
      lastRir: topLast?.rir ?? null,
      suggestion: progressionSuggestion(topLast?.rir ?? null, topLast?.weight ?? null),
    });
  }
  // Most-trained first.
  return stats.sort((a, b) => b.totalSets - a.totalSets);
}

function progressionSuggestion(rir: number | null, weight: number | null): string {
  if (rir == null) return "Registra el RIR de tu top set para recibir progresión automática.";
  if (rir >= 3) {
    const up = weight ? ` (~${Math.round(weight * 1.03 * 10) / 10}–${Math.round(weight * 1.05 * 10) / 10} kg)` : "";
    return `Te sobran ${rir} reps: sube el peso 2.5–5%${up} o añade 1–2 reps.`;
  }
  if (rir === 2) return "Cerca del objetivo: añade 1 rep o repite carga afinando técnica.";
  if (rir === 1) return "Casi al fallo: mantén la carga y consolida antes de subir.";
  return "Al fallo (RIR 0): mantén o baja carga; vigila la fatiga acumulada.";
}

export type VolumeRecommendation = { tone: "up" | "hold" | "deload" | "start"; title: string; message: string };

export function volumeRecommendation(trend: VolumeTrend, avgRpe: number | null, sessions: number): VolumeRecommendation {
  if (sessions === 0) {
    return { tone: "start", title: "Empieza a registrar", message: "Registra tus sesiones con series, reps, peso y RIR para activar el análisis de volumen y la progresión automática." };
  }
  if (avgRpe != null && avgRpe >= 9 && trend.direction === "up") {
    return { tone: "deload", title: "Considera un deload", message: `Volumen al alza (${trend.changePct}%) con RPE promedio ${avgRpe}. Reduce ~40% el volumen una semana para recuperar y luego rebota.` };
  }
  if (trend.direction === "down") {
    return { tone: "up", title: "Sobrecarga progresiva", message: `Tu volumen bajó ${trend.changePct}% vs la semana previa. Añade 1–2 series a tus ejercicios principales o sube carga donde el RIR lo permita.` };
  }
  if (trend.direction === "flat" || trend.direction === "none") {
    return { tone: "up", title: "Rompe el estancamiento", message: "Volumen estable. Aplica sobrecarga progresiva: +1 serie semanal o +reps donde tengas RIR ≥ 2." };
  }
  return { tone: "hold", title: "Progresión saludable", message: `Volumen +${trend.changePct}% con buena recuperación. Mantén la sobrecarga gradual y sigue registrando el RIR.` };
}
