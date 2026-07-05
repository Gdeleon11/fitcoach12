import AppShell from "@/components/AppShell";
import Sparkline from "@/components/Sparkline";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { trend } from "@/lib/reports";

export const metadata = { title: "FitCoach 12% — Composición Corporal" };
export const dynamic = "force-dynamic";

export default async function CompositionReportPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [profile, checkins, photos] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.dailyCheckIn.findMany({ where: { userId, date: { gte: since } }, orderBy: { date: "asc" } }),
    prisma.progressPhoto.findMany({ where: { userId, date: { gte: since } }, orderBy: { date: "desc" }, take: 6 }),
  ]);

  const weight = trend(checkins, "weightKg");
  const waist = trend(checkins, "waistCm");
  const hasData = weight.series.length > 0 || waist.series.length > 0 || photos.length > 0;

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">
          BODY COMPOSITION // LAST_30_DAYS
        </p>
        <h1 className="font-headline-md text-headline-md">Reporte de Composición Corporal</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Tendencias de peso y cintura de tus últimos 30 días, más tus fotos de progreso.
        </p>
      </div>

      {!hasData ? (
        <div className="glass-card p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">monitoring</span>
          <p className="mt-3 text-on-surface-variant">
            Aún no hay suficientes datos. Registra tu peso y cintura en el check-in y sube fotos de progreso.
          </p>
          <div className="flex gap-3 justify-center mt-5">
            <Link href="/tracking" className="px-4 py-2 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold">CHECK-IN</Link>
            <Link href="/progress" className="px-4 py-2 border border-outline-variant text-primary font-label-caps text-label-caps">SUBIR FOTO</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Headline deltas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-6">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">PESO</p>
              <div className="flex items-baseline gap-2">
                <span className="font-data-point text-display-lg text-primary">{weight.last ?? "—"}</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">KG</span>
              </div>
              <p className={"font-label-caps text-label-caps mt-2 " + deltaColor(weight.delta, true)}>
                {deltaLabel(weight.delta, "kg")} en 30d
              </p>
            </div>
            <div className="glass-card p-6">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">CINTURA</p>
              <div className="flex items-baseline gap-2">
                <span className="font-data-point text-display-lg text-primary">{waist.last ?? "—"}</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">CM</span>
              </div>
              <p className={"font-label-caps text-label-caps mt-2 " + deltaColor(waist.delta, true)}>
                {deltaLabel(waist.delta, "cm")} en 30d
              </p>
            </div>
            <div className="glass-card p-6">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">OBJETIVO BF</p>
              <div className="flex items-baseline gap-2">
                <span className="font-data-point text-display-lg text-secondary-container">{profile?.goalBodyFat ?? "—"}</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">%</span>
              </div>
              <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60 mt-2">meta de grasa corporal</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="font-headline-md text-lg mb-1">Peso · 30 días</h3>
              <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60 mb-4">
                {weight.series.length} REGISTROS · PROM {weight.average ?? "—"}KG
              </p>
              <Sparkline series={weight.series} stroke="#00f0ff" height={100} />
            </div>
            <div className="glass-card p-6">
              <h3 className="font-headline-md text-lg mb-1">Cintura · 30 días</h3>
              <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60 mb-4">
                {waist.series.length} REGISTROS · PROM {waist.average ?? "—"}CM
              </p>
              <Sparkline series={waist.series} stroke="#c3f400" height={100} />
            </div>
          </div>

          {/* Progress photos */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-md text-lg">Fotos de progreso</h3>
              <Link href="/progress" className="font-label-caps text-label-caps text-primary hover:underline">GESTIONAR</Link>
            </div>
            {photos.length === 0 ? (
              <p className="text-sm text-on-surface-variant">Aún no has subido fotos. <Link href="/progress" className="text-primary hover:underline">Sube la primera</Link>.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {photos.map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={p.id} src={p.url} alt={`Progreso ${p.date.toISOString().slice(0, 10)}`} className="w-full h-28 object-cover rounded" />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function deltaColor(delta: number | null, lowerIsGood: boolean) {
  if (delta == null || delta === 0) return "text-on-surface-variant";
  const good = lowerIsGood ? delta < 0 : delta > 0;
  return good ? "text-secondary-container" : "text-error";
}

function deltaLabel(delta: number | null, unit: string) {
  if (delta == null) return "sin cambio";
  if (delta === 0) return `0 ${unit}`;
  return `${delta > 0 ? "+" : ""}${delta} ${unit}`;
}
