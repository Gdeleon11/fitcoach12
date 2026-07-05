import { prisma } from "@/lib/prisma";
import { computeAdaptive, type AdaptiveResult } from "@/lib/adaptive";

// Loads the data an adaptive recommendation needs and computes it.
export async function loadAdaptive(userId: string): Promise<{
  result: AdaptiveResult;
  weightSeries: { day: string; value: number }[];
  daysLogged: number;
  avgKcalLogged: number | null;
  targetKcal: number | null;
  weightKg: number | null;
}> {
  const since14 = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const since7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [profile, checkins, nutrition] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.dailyCheckIn.findMany({ where: { userId, date: { gte: since14 } }, orderBy: { date: "asc" } }),
    prisma.nutritionLog.findMany({ where: { userId, date: { gte: since7 } } }),
  ]);

  const weightSeries = checkins
    .filter((c) => typeof c.weightKg === "number")
    .map((c) => ({ day: c.date.toISOString().slice(0, 10), value: c.weightKg as number }));

  // Nutrition adherence over logged days.
  const byDay = new Map<string, number>();
  for (const n of nutrition) {
    const k = n.date.toISOString().slice(0, 10);
    byDay.set(k, (byDay.get(k) ?? 0) + (n.totalKcal ?? 0));
  }
  const dayKcals = [...byDay.values()];
  const avgKcalLogged = dayKcals.length ? Math.round(dayKcals.reduce((a, b) => a + b, 0) / dayKcals.length) : null;

  const result = computeAdaptive({
    targetKcal: profile?.targetKcal ?? null,
    weightKg: profile?.weightKg ?? weightSeries.at(-1)?.value ?? null,
    goalBodyFat: profile?.goalBodyFat ?? null,
    weightSeries,
    avgKcalLogged,
    daysLogged: dayKcals.length,
  });

  return {
    result,
    weightSeries,
    daysLogged: dayKcals.length,
    avgKcalLogged,
    targetKcal: profile?.targetKcal ?? null,
    weightKg: profile?.weightKg ?? null,
  };
}
