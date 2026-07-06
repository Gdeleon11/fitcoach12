import AppShell from "@/components/AppShell";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { weeklyVolume, volumeTrend, exerciseStats, volumeRecommendation } from "@/lib/volume";

export const metadata = { title: "FitCoach 12% — Ajuste de Volumen IA" };
export const dynamic = "force-dynamic";

const toneColor: Record<string, string> = {
  up: "#00f0ff",
  hold: "#c3f400",
  deload: "#FFCC00",
  start: "#849495",
};

export default async function VolumePage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const since = new Date(Date.now() - 8 * 7 * 24 * 60 * 60 * 1000);
  const workouts = await prisma.workout.findMany({
    where: { userId, date: { gte: since } },
    orderBy: { date: "asc" },
    include: { sets: true },
  });

  const weekly = weeklyVolume(workouts, 6);
  const trend = volumeTrend(weekly);
  const stats = exerciseStats(workouts);
  const rpes = workouts.map((w) => w.rpe).filter((x): x is number => typeof x === "number");
  const avgRpe = rpes.length ? Math.round((rpes.reduce((a, b) => a + b, 0) / rpes.length) * 10) / 10 : null;
  const rec = volumeRecommendation(trend, avgRpe, workouts.length);
  const tone = toneColor[rec.tone];
  const maxVol = Math.max(1, ...weekly.map((w) => w.volume));

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">
          MOTOR DE ENTRENAMIENTO // VOLUMEN_Y_PROGRESIÓN
        </p>
        <h1 className="font-headline-md text-headline-md">Ajuste de Volumen IA</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Analiza tus sesiones registradas y sugiere progresión por ejercicio.
        </p>
      </div>

      {workouts.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">exercise</span>
          <p className="mt-3 text-on-surface-variant">
            Aún no has registrado entrenamientos. Registra tus series (peso, reps y RIR) y este motor calcula tu volumen y progresión.
          </p>
          <Link href="/training/log" className="inline-block mt-5 px-4 py-2 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold">
            REGISTRAR SESIÓN
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Recommendation */}
          <div className="glass-card p-6 border-l-4" style={{ borderColor: tone }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined" style={{ color: tone }}>smart_toy</span>
              <span className="font-label-caps text-label-caps" style={{ color: tone }}>{rec.title.toUpperCase()}</span>
            </div>
            <p className="text-on-surface leading-relaxed">{rec.message}</p>
          </div>

          {/* Weekly volume + KPIs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline-md text-lg">Volumen semanal</h3>
                <span className="font-label-caps text-label-caps text-on-surface-variant opacity-60">ÚLTIMAS 6 SEMANAS · KG</span>
              </div>
              <div className="flex items-end gap-3 h-48">
                {weekly.map((w, i) => {
                  const isLast = i === weekly.length - 1;
                  return (
                    <div key={w.week} className="flex-1 flex flex-col justify-end items-center gap-2">
                      <span className="font-label-caps text-[10px] text-on-surface-variant">{w.volume > 0 ? w.volume.toLocaleString() : ""}</span>
                      <div
                        className="w-full rounded-t"
                        style={{
                          height: `${(w.volume / maxVol) * 100}%`,
                          minHeight: w.volume > 0 ? 4 : 0,
                          backgroundColor: isLast ? "#00f0ff" : "#3b494b",
                        }}
                        title={`Semana del ${w.week}: ${w.volume.toLocaleString()} kg · ${w.sessions} sesiones`}
                      />
                      <span className="text-[10px] font-label-caps opacity-40">{w.week.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-card p-6">
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">SEMANA ACTUAL</p>
                <p className="font-data-point text-data-point text-primary">{trend.current.toLocaleString()} <span className="text-sm text-on-surface-variant">kg</span></p>
                <p className={"font-label-caps text-label-caps mt-1 " + (trend.direction === "up" ? "text-primary-fixed-dim" : trend.direction === "down" ? "text-error" : "text-on-surface-variant")}>
                  {trend.changePct != null ? `${trend.changePct > 0 ? "+" : ""}${trend.changePct}% vs previa` : "—"}
                </p>
              </div>
              <div className="glass-card p-6">
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">RPE PROMEDIO</p>
                <p className="font-data-point text-data-point text-primary">{avgRpe ?? "—"}</p>
                <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60 mt-1">{workouts.length} sesiones (8 sem)</p>
              </div>
            </div>
          </div>

          {/* Per-exercise progression */}
          <div className="glass-card p-6">
            <h3 className="font-headline-md text-lg mb-4">Progresión por ejercicio</h3>
            <div className="divide-y divide-outline-variant">
              {stats.map((s) => (
                <div key={s.name} className="py-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <div>
                      <p className="text-on-surface font-bold">{s.name}</p>
                      <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">
                        {s.totalSets} SERIES · TOP {s.topWeight ?? "—"}KG · 1RM EST. {s.best1RM ?? "—"}KG
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-data-point text-sm text-primary">
                        {s.lastWeight ?? "—"}kg × {s.lastReps ?? "—"} {s.lastRir != null ? `@RIR${s.lastRir}` : ""}
                      </p>
                      <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">ÚLT. {s.lastDate}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-start gap-2 bg-surface-container-high border border-outline-variant rounded p-3">
                    <span className="material-symbols-outlined text-primary-fixed-dim text-base">trending_up</span>
                    <p className="text-sm text-on-surface">{s.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
