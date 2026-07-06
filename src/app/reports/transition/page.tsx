import AppShell from "@/components/AppShell";
import Sparkline from "@/components/Sparkline";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";
import { computeReadiness } from "@/lib/readiness";
import { computeTransition } from "@/lib/transition";

export const metadata = { title: "FitCoach 12% — Lógica de Transición" };
export const dynamic = "force-dynamic";

function daysBetween(a: string, b: string) {
  return Math.abs((new Date(b).getTime() - new Date(a).getTime()) / (86400000));
}

export default async function TransitionPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const since30 = new Date(Date.now() - 30 * 86400000);
  const since7 = new Date(Date.now() - 7 * 86400000);
  const [checkins, nutrition] = await Promise.all([
    prisma.dailyCheckIn.findMany({ where: { userId, date: { gte: since30 } }, orderBy: { date: "asc" } }),
    prisma.nutritionLog.findMany({ where: { userId, date: { gte: since7 } } }),
  ]);

  const weightSeries = checkins
    .filter((c) => typeof c.weightKg === "number")
    .map((c) => ({ day: c.date.toISOString().slice(0, 10), value: c.weightKg as number }));

  let weeklyChangePct: number | null = null;
  if (weightSeries.length >= 2) {
    const first = weightSeries[0];
    const last = weightSeries[weightSeries.length - 1];
    const span = Math.max(1, daysBetween(first.day, last.day));
    weeklyChangePct = Math.round(((last.value - first.value) / first.value) * (7 / span) * 1000) / 10;
  }

  const readinessScores = checkins
    .map((c) => computeReadiness({ sleepH: c.sleepH, energy: c.energy, fatigue: c.fatigue, stress: c.stress, digestion: c.digestion }).score)
    .filter((s): s is number => s != null);
  const avgReadiness = readinessScores.length ? readinessScores.reduce((a, b) => a + b, 0) / readinessScores.length : null;

  const nutritionDays = new Set(nutrition.map((n) => n.date.toISOString().slice(0, 10))).size;

  const result = computeTransition({
    weeklyChangePct,
    weightPoints: weightSeries.length,
    daysLoggedNutrition: nutritionDays,
    avgReadiness,
  });

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">
          PHASE LOGIC // TRANSITION
        </p>
        <h1 className="font-headline-md text-headline-md">Lógica de Transición</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Decide cuándo continuar, mantener o cambiar de fase según tu tendencia de peso y recuperación.
        </p>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-6 border-l-4" style={{ borderColor: result.color }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined" style={{ color: result.color }}>route</span>
            <span className="font-label-caps text-label-caps" style={{ color: result.color }}>{result.title.toUpperCase()}</span>
          </div>
          <p className="text-on-surface leading-relaxed text-lg">{result.message}</p>
          {result.status === "insufficient" && (
            <div className="flex gap-3 mt-5">
              <Link href="/tracking" className="px-4 py-2 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold">REGISTRAR PESO</Link>
              <Link href="/nutrition" className="px-4 py-2 border border-outline-variant text-primary font-label-caps text-label-caps">REGISTRAR COMIDA</Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Metric label="TENDENCIA PESO" value={weeklyChangePct != null ? `${weeklyChangePct}%` : "—"} sub="por semana" />
          <Metric label="READINESS PROM." value={avgReadiness != null ? `${Math.round(avgReadiness)}` : "—"} sub="/ 100 (30d)" />
          <Metric label="NUTRICIÓN 7D" value={`${nutritionDays}`} sub="días registrados" />
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline-md text-lg">Peso · 30 días</h3>
            <span className="font-label-caps text-label-caps text-on-surface-variant opacity-60">{weightSeries.length} REGISTROS</span>
          </div>
          <Sparkline series={weightSeries} stroke={result.color} height={100} />
        </div>
      </div>
    </AppShell>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="glass-card p-5">
      <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">{label}</p>
      <p className="font-data-point text-data-point text-primary">{value}</p>
      <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60 mt-1">{sub}</p>
    </div>
  );
}
