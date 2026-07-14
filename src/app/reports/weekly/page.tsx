import AppShell from "@/components/AppShell";
import Sparkline from "@/components/Sparkline";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  trend,
  nutritionAdherence,
  trainingSummary,
  checkinAverages,
} from "@/lib/reports";
import { analyzeWeeklyProgress } from "@/lib/ai";

export const metadata = { title: "FitCoach 12% — Reporte Semanal Estratégico" };
export const dynamic = "force-dynamic";

function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "up" | "down" | "flat" }) {
  const color = tone === "up" ? "text-secondary-container" : tone === "down" ? "text-error" : "text-primary";
  return (
    <div className="glass-card p-5">
      <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">{label}</p>
      <p className={`font-data-point text-data-point ${color}`}>{value}</p>
      {sub && <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60 mt-1">{sub}</p>}
    </div>
  );
}

export default async function WeeklyReportPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [profile, checkins, nutrition, workouts] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.dailyCheckIn.findMany({ where: { userId, date: { gte: since } }, orderBy: { date: "asc" } }),
    prisma.nutritionLog.findMany({ where: { userId, date: { gte: since } }, orderBy: { date: "asc" } }),
    prisma.workout.findMany({ where: { userId, date: { gte: since } }, orderBy: { date: "asc" } }),
  ]);

  const weight = trend(checkins, "weightKg");
  const waist = trend(checkins, "waistCm");
  const nut = nutritionAdherence(nutrition, profile?.targetKcal ?? null, profile?.proteinG ?? null);
  const training = trainingSummary(workouts);
  const av = checkinAverages(checkins);

  const hasData = checkins.length > 0 || nutrition.length > 0 || workouts.length > 0;
  
  let aiStrategicRead = "";
  if (hasData) {
    aiStrategicRead = await analyzeWeeklyProgress({ profile, weight, waist, nut, training, av });
  }
  const weightTone = weight.delta == null ? "flat" : weight.delta < 0 ? "up" : weight.delta > 0 ? "down" : "flat";
  const waistTone = waist.delta == null ? "flat" : waist.delta < 0 ? "up" : waist.delta > 0 ? "down" : "flat";

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">
          REVISIÓN ESTRATÉGICA // ÚLTIMOS_7_DÍAS
        </p>
        <h1 className="font-headline-md text-headline-md">Reporte Semanal Estratégico</h1>
        <p className="text-sm text-on-surface-variant mt-1">Datos reales de tus últimos 7 días.</p>
      </div>

      {!hasData ? (
        <div className="glass-card p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">insights</span>
          <p className="mt-3 text-on-surface-variant">
            Aún no hay datos esta semana. Registra check-ins, comidas y entrenamientos y este reporte se llena solo.
          </p>
          <div className="flex gap-3 justify-center mt-5">
            <Link href="/tracking" className="px-4 py-2 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold">CHECK-IN</Link>
            <Link href="/nutrition" className="px-4 py-2 border border-outline-variant text-primary font-label-caps text-label-caps">NUTRICIÓN</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat
              label="Δ PESO 7D"
              value={weight.delta == null ? "—" : `${weight.delta > 0 ? "+" : ""}${weight.delta} kg`}
              sub={weight.average != null ? `prom ${weight.average}kg` : undefined}
              tone={weightTone}
            />
            <Stat
              label="Δ CINTURA 7D"
              value={waist.delta == null ? "—" : `${waist.delta > 0 ? "+" : ""}${waist.delta} cm`}
              sub={waist.average != null ? `prom ${waist.average}cm` : undefined}
              tone={waistTone}
            />
            <Stat label="PASOS PROM." value={av.avgSteps != null ? av.avgSteps.toLocaleString() : "—"} sub="por día" />
            <Stat label="SUEÑO PROM." value={av.avgSleep != null ? `${av.avgSleep} h` : "—"} sub={av.avgEnergy != null ? `energía ${av.avgEnergy}/5` : undefined} />
          </div>

          {/* Weight trend chart */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-headline-md text-lg">Tendencia de peso</h3>
                <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">
                  {weight.series.length} REGISTROS ESTA SEMANA
                </p>
              </div>
              <div className="text-right">
                <p className="font-data-point text-data-point text-primary">{weight.last != null ? `${weight.last} kg` : "—"}</p>
                <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">ACTUAL</p>
              </div>
            </div>
            <Sparkline series={weight.series} stroke="#00f0ff" />
          </div>

          {/* Nutrition + Training */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">restaurant</span>
                <span className="font-label-caps text-label-caps">ADHERENCIA NUTRICIONAL</span>
              </div>
              <div className="space-y-4">
                <Bar label="CALORÍAS" value={nut.avgKcal} target={profile?.targetKcal ?? null} pct={nut.kcalAdherencePct} unit="kcal" />
                <Bar label="PROTEÍNA" value={nut.avgProtein} target={profile?.proteinG ?? null} pct={nut.proteinAdherencePct} unit="g" />
                <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">
                  {nut.daysLogged} DÍAS REGISTRADOS DE 7
                </p>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">fitness_center</span>
                <span className="font-label-caps text-label-caps">ENTRENAMIENTO</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">SESIONES</p>
                  <p className="font-data-point text-data-point text-primary">{training.sessions}</p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">VOLUMEN</p>
                  <p className="font-data-point text-data-point text-primary">{training.totalVolume.toLocaleString()}</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">kg</p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">RPE PROM.</p>
                  <p className="font-data-point text-data-point text-primary">{training.avgRpe ?? "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic read (AI-powered with fallback) */}
          <div className="glass-card p-6 border-l-4 border-primary bg-surface-container-high">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary-fixed-dim">smart_toy</span>
              <span className="font-label-caps text-label-caps text-primary-fixed-dim">LECTURA ESTRATÉGICA IA</span>
            </div>
            <p className="text-on-surface leading-relaxed whitespace-pre-wrap">
              {aiStrategicRead || strategicRead({ weight, nut, training, av })}
            </p>
            <Link href="/coach" className="inline-block mt-4 px-4 py-2 bg-surface-container-highest text-primary font-label-caps text-label-caps border border-outline-variant hover:border-primary transition">
              PROFUNDIZAR CON EL COACH
            </Link>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Bar({ label, value, target, pct, unit }: { label: string; value: number | null; target: number | null; pct: number | null; unit: string }) {
  const width = pct == null ? 0 : Math.min(100, pct);
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-label-caps text-label-caps text-on-surface-variant">{label}</span>
        <span className="font-data-point text-sm text-primary">
          {value != null ? value.toLocaleString() : "—"} <span className="text-on-surface-variant">/ {target ?? "—"} {unit}</span>
        </span>
      </div>
      <div className="w-full bg-surface-container-highest h-2">
        <div className="bg-primary-container h-2" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function strategicRead({
  weight,
  nut,
  training,
  av,
}: {
  weight: { delta: number | null };
  nut: { avgKcal: number | null; daysLogged: number; kcalAdherencePct: number | null };
  training: { sessions: number };
  av: { avgSteps: number | null };
}): string {
  const parts: string[] = [];
  if (weight.delta != null) {
    if (weight.delta < -0.2) parts.push(`Peso a la baja (${weight.delta}kg): el déficit está funcionando.`);
    else if (weight.delta > 0.2) parts.push(`Peso al alza (+${weight.delta}kg): revisa calorías y sodio/agua.`);
    else parts.push("Peso estable: mantén el rumbo o ajusta pasos si buscas déficit.");
  }
  if (nut.daysLogged < 4) parts.push(`Solo ${nut.daysLogged}/7 días de nutrición registrados: sube la consistencia para lecturas más fiables.`);
  else if (nut.kcalAdherencePct != null) parts.push(`Adherencia calórica ~${nut.kcalAdherencePct}% del objetivo.`);
  if (training.sessions === 0) parts.push("Sin entrenamientos esta semana: agenda al menos 2-3 sesiones.");
  else parts.push(`${training.sessions} sesiones registradas.`);
  if (av.avgSteps != null && av.avgSteps < 8000) parts.push("Pasos por debajo de 8k: suma NEAT para acelerar el déficit.");
  return parts.join(" ") || "Registra más datos para desbloquear una lectura estratégica.";
}
