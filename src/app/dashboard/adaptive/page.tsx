import AppShell from "@/components/AppShell";
import Sparkline from "@/components/Sparkline";
import ApplyAdaptiveButton from "@/components/ApplyAdaptiveButton";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { loadAdaptive } from "@/lib/adaptiveServer";

export const metadata = { title: "FitCoach 12% — Nutrición Adaptativa" };
export const dynamic = "force-dynamic";

const statusColor: Record<string, string> = {
  on_track: "#c3f400",
  decrease: "#FFCC00",
  increase: "#00f0ff",
  insufficient: "#849495",
};

export default async function AdaptivePage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile?.onboardingDone) redirect("/onboarding");

  const { result, weightSeries, daysLogged, avgKcalLogged } = await loadAdaptive(userId);
  const color = statusColor[result.status] ?? "#849495";
  const canApply = result.deltaKcal !== 0 && result.status !== "insufficient" && result.suggestedTarget != null;

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">
          MOTOR ADAPTATIVO // AUTO_AJUSTE
        </p>
        <h1 className="font-headline-md text-headline-md">Nutrición Adaptativa</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Ajusta tu objetivo calórico según tu tendencia de peso real y tu adherencia.
        </p>
      </div>

      <div className="space-y-6">
        {/* Recommendation card */}
        <div className="glass-card p-6 border-l-4" style={{ borderColor: color }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined" style={{ color }}>tune</span>
            <span className="font-label-caps text-label-caps" style={{ color }}>
              {result.status === "on_track" && "EN RANGO ÓPTIMO"}
              {result.status === "decrease" && "AJUSTE SUGERIDO: RECORTAR"}
              {result.status === "increase" && "AJUSTE SUGERIDO: SUBIR"}
              {result.status === "insufficient" && "DATOS INSUFICIENTES"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">OBJETIVO ACTUAL</p>
              <p className="font-data-point text-display-lg text-on-surface">{result.currentTarget ?? "—"}</p>
              <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">kcal</p>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">SUGERIDO</p>
              <p className="font-data-point text-display-lg" style={{ color }}>{result.suggestedTarget ?? "—"}</p>
              <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">
                {result.deltaKcal !== 0 ? `${result.deltaKcal > 0 ? "+" : ""}${result.deltaKcal} kcal` : "sin cambio"}
              </p>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">TENDENCIA PESO</p>
              <p className="font-data-point text-display-lg text-primary">
                {result.weeklyChangePct != null ? `${result.weeklyChangePct}` : "—"}
              </p>
              <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60">%/semana</p>
            </div>
          </div>

          <p className="text-on-surface leading-relaxed">{result.reason}</p>
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60 mt-3">
            CONFIANZA: {result.confidence.toUpperCase()} · {daysLogged} DÍAS DE NUTRICIÓN · {weightSeries.length} PESOS
          </p>

          {canApply ? (
            <div className="mt-5">
              <ApplyAdaptiveButton label={`APLICAR ${result.suggestedTarget} KCAL`} />
            </div>
          ) : result.status === "insufficient" ? (
            <div className="flex gap-3 mt-5">
              <Link href="/tracking" className="px-4 py-2 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold">REGISTRAR PESO</Link>
              <Link href="/nutrition" className="px-4 py-2 border border-outline-variant text-primary font-label-caps text-label-caps">REGISTRAR COMIDA</Link>
            </div>
          ) : null}
        </div>

        {/* Suggested macros + weight trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <span className="font-label-caps text-label-caps text-on-surface-variant">MACROS SUGERIDOS</span>
            {result.suggestedMacros ? (
              <div className="grid grid-cols-3 gap-4 mt-4">
                <Macro label="PROTEÍNA" value={`${result.suggestedMacros.proteinG}g`} />
                <Macro label="CARBOS" value={`${result.suggestedMacros.carbsG}g`} />
                <Macro label="GRASA" value={`${result.suggestedMacros.fatG}g`} />
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant mt-4">Completa tu perfil para calcular macros.</p>
            )}
            <div className="mt-4 pt-4 border-t border-outline-variant flex justify-between">
              <span className="font-label-caps text-label-caps text-on-surface-variant opacity-60">PROM. KCAL REGISTRADAS</span>
              <span className="font-data-point text-sm text-primary">{avgKcalLogged ?? "—"}</span>
            </div>
          </div>

          <div className="glass-card p-6">
            <span className="font-label-caps text-label-caps text-on-surface-variant">PESO · 14 DÍAS</span>
            <div className="mt-4">
              <Sparkline series={weightSeries} stroke={color} height={100} />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">{label}</p>
      <p className="font-data-point text-data-point text-primary">{value}</p>
    </div>
  );
}
