import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { estimateBodyFatRFM, bodyFatStatus } from "@/lib/bodyfat";

export const metadata = { title: "FitCoach 12% — Command Center" };
export const dynamic = "force-dynamic";

function fmt(n: number | null | undefined, digits = 1) {
  if (n == null) return "—";
  return Number(n).toFixed(digits);
}

export default async function DashboardPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile?.onboardingDone) redirect("/onboarding");

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [checkins, todayNutrition, recentPhotos] = await Promise.all([
    prisma.dailyCheckIn.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 7 }),
    prisma.nutritionLog.findMany({ where: { userId, date: { gte: startOfDay } } }),
    prisma.progressPhoto.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 10 }),
  ]);

  const latest = checkins[0];
  const latestWeight = checkins.find((c) => c.weightKg != null)?.weightKg ?? profile.weightKg ?? null;
  const latestWaist = checkins.find((c) => c.waistCm != null)?.waistCm ?? null;
  const weights = checkins.filter((c) => c.weightKg != null).map((c) => c.weightKg as number);
  const avg7 = weights.length ? weights.reduce((a, b) => a + b, 0) / weights.length : null;

  const rfmBf = estimateBodyFatRFM(profile.heightCm ?? null, latestWaist, profile.gender ?? null);
  
  // Find the latest AI visual body fat estimation, if any
  const latestAiAnalysis = recentPhotos.map(p => p.aiAnalysis as any).find(a => a && typeof a.estimatedBodyFatPct === "number");
  const estBf = latestAiAnalysis ? latestAiAnalysis.estimatedBodyFatPct : rfmBf;
  
  const bfStatus = bodyFatStatus(estBf, profile.goalBodyFat ?? null);

  const kcalToday = todayNutrition.reduce((a, n) => a + (n.totalKcal ?? 0), 0);
  const proteinToday = todayNutrition.reduce((a, n) => a + (n.proteinG ?? 0), 0);
  const kcalPct = profile.targetKcal ? Math.min(100, Math.round((kcalToday / profile.targetKcal) * 100)) : 0;

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">
          CENTRO DE MANDO // SISTEMA EN LÍNEA
        </p>
        <h1 className="font-headline-md text-headline-md">
          Hola{profile.name ? `, ${profile.name}` : ""}. Aquí está tu estado.
        </h1>
      </div>

      <div className="bento-grid">
        {/* Hero Image */}
        <div className="col-span-12 glass-card overflow-hidden relative h-48 md:h-64 border-b-0 rounded-b-none">
          <Image src="/dashboard_hero.jpg" alt="FitCoach Elite" fill className="object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/20 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <h2 className="font-display-lg text-primary text-2xl md:text-4xl drop-shadow-lg">FITCOACH 12%</h2>
            <p className="font-label-caps text-on-surface-variant drop-shadow">SISTEMA DE COMPOSICIÓN CORPORAL CIBERNÉTICO</p>
          </div>
        </div>
        {/* Weight */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-caps text-label-caps text-on-surface-variant">PESO ACTUAL</span>
              <div className="status-dot bg-secondary-container" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-data-point text-display-lg text-primary">{fmt(latestWeight)}</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">KG</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-outline-variant flex justify-between items-center">
            <span className="font-label-caps text-label-caps opacity-60">PROMEDIO 7D</span>
            <span className="font-data-point text-data-point">{avg7 ? `${fmt(avg7)}kg` : "—"}</span>
          </div>
        </div>

        {/* Waist */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 glass-card p-6">
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-caps text-label-caps text-on-surface-variant">CINTURA</span>
            <div className="status-dot bg-secondary-container" />
          </div>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="font-data-point text-display-lg text-on-surface">{fmt(latestWaist, 0)}</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">CM</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-label-caps text-label-caps opacity-60">GRASA EST.</span>
              <span className="font-data-point text-sm" style={{ color: bfStatus.color }}>
                {estBf != null ? `${estBf}%` : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label-caps text-label-caps opacity-60">OBJETIVO</span>
              <span className="font-label-caps text-label-caps text-secondary-container">{fmt(profile.goalBodyFat, 0)}%</span>
            </div>
            {estBf != null && (
              <p className="font-label-caps text-label-caps" style={{ color: bfStatus.color }}>
                {bfStatus.label}
              </p>
            )}
          </div>
        </div>

        {/* AI insight */}
        <div className="col-span-12 md:col-span-4 lg:col-span-6 glass-card p-6 border-l-4 border-primary bg-surface-container-high">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary-fixed-dim">smart_toy</span>
            <span className="font-label-caps text-label-caps text-primary-fixed-dim">COACH IA · LECTURA</span>
          </div>
          <p className="font-headline-md text-headline-md leading-tight mb-4">
            {latest
              ? `Tu objetivo diario es ${profile.targetKcal ?? "—"} kcal. Hoy llevas ${kcalToday}. Mantén el ritmo.`
              : "Registra tu primer check-in para desbloquear lecturas personalizadas."}
          </p>
          <Link
            href="/coach"
            className="inline-block px-4 py-2 bg-surface-container-highest text-primary font-label-caps text-label-caps border border-outline-variant hover:border-primary transition"
          >
            HABLAR CON EL COACH
          </Link>
        </div>

        {/* Nutrition today */}
        <div className="col-span-12 md:col-span-8 lg:col-span-7 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">restaurant</span>
              <span className="font-label-caps text-label-caps">NUTRICIÓN HOY</span>
            </div>
            <Link href="/nutrition" className="font-label-caps text-label-caps text-primary hover:underline">
              + REGISTRAR
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <Metric label="CALORÍAS" value={`${kcalToday}`} sub={`/ ${profile.targetKcal ?? "—"}`} />
            <Metric label="PROTEÍNA" value={`${proteinToday}g`} sub={`/ ${profile.proteinG ?? "—"}g`} />
            <Metric label="COMIDAS" value={`${todayNutrition.length}`} sub="hoy" />
          </div>
          <div className="w-full bg-surface-container-highest h-2">
            <div className="bg-primary-container h-2" style={{ width: `${kcalPct}%` }} />
          </div>
        </div>

        {/* Targets */}
        <div className="col-span-12 md:col-span-4 lg:col-span-5 glass-card p-6">
          <span className="font-label-caps text-label-caps text-on-surface-variant">TU PLAN</span>
          <div className="mt-4 space-y-3">
            <Row k="TDEE" v={`${profile.tdee ?? "—"} kcal`} />
            <Row k="OBJETIVO" v={`${profile.targetKcal ?? "—"} kcal`} />
            <Row k="MACROS" v={`P${profile.proteinG ?? "—"} · C${profile.carbsG ?? "—"} · G${profile.fatG ?? "—"}`} />
            <Row k="VENTANA" v={`${profile.foodWindowStart ?? "—"} – ${profile.foodWindowEnd ?? "—"}`} />
          </div>
          <Link
            href="/tracking"
            className="mt-6 block text-center py-2 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold hover:brightness-110 transition"
          >
            CHECK-IN DIARIO
          </Link>
        </div>

        {/* Quick links to advanced screens */}
        <div className="col-span-12 glass-card p-6">
          <span className="font-label-caps text-label-caps text-on-surface-variant">MÓDULOS AVANZADOS</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {[
              ["/progress", "Progreso Visual"],
              ["/reports/weekly", "Reporte Semanal"],
              ["/dashboard/readiness", "Readiness Score"],
              ["/training/volume", "Volumen IA"],
              ["/biodata", "Wearables"],
              ["/bloodwork", "Analíticas Sangre"],
              ["/supplements", "Suplementación"],
              ["/elite", "Elite Suite"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="p-4 border border-outline-variant rounded hover:border-primary transition text-sm text-on-surface-variant hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">{label}</p>
      <p className="font-data-point text-data-point text-primary">{value}</p>
      <p className="text-on-surface-variant font-label-caps text-label-caps opacity-60">{sub}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between items-center border-b border-outline-variant pb-2">
      <span className="font-label-caps text-label-caps opacity-60">{k}</span>
      <span className="font-data-point text-sm text-on-surface">{v}</span>
    </div>
  );
}
