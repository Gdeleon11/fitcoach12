import AppShell from "@/components/AppShell";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { computeReadiness } from "@/lib/readiness";

export const metadata = { title: "FitCoach 12% — Readiness Score" };
export const dynamic = "force-dynamic";

const bandColor: Record<string, string> = {
  optimal: "#c3f400",
  caution: "#FFCC00",
  recover: "#FF3B30",
  unknown: "#849495",
};

function Gauge({ score, color }: { score: number | null; color: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = score == null ? 0 : score / 100;
  const dash = c * pct;
  return (
    <svg viewBox="0 0 140 140" className="w-44 h-44">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#353534" strokeWidth="12" />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        transform="rotate(-90 70 70)"
      />
      <text x="70" y="66" textAnchor="middle" fill="#e5e2e1" fontFamily="JetBrains Mono" fontSize="34" fontWeight="700">
        {score ?? "—"}
      </text>
      <text x="70" y="88" textAnchor="middle" fill="#b9cacb" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="2">
        READINESS
      </text>
    </svg>
  );
}

export default async function ReadinessPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const checkins = await prisma.dailyCheckIn.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 7,
  });
  const latest = checkins[0];
  const result = computeReadiness({
    sleepH: latest?.sleepH ?? null,
    energy: latest?.energy ?? null,
    fatigue: latest?.fatigue ?? null,
    stress: latest?.stress ?? null,
    digestion: latest?.digestion ?? null,
  });
  const color = bandColor[result.band];

  // Recent history of readiness scores.
  const history = checkins
    .map((c) => ({
      day: c.date.toISOString().slice(0, 10),
      score: computeReadiness({ sleepH: c.sleepH, energy: c.energy, fatigue: c.fatigue, stress: c.stress, digestion: c.digestion }).score,
    }))
    .reverse();

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">
          RECUPERACIÓN // READINESS
        </p>
        <h1 className="font-headline-md text-headline-md">Readiness Score</h1>
        <p className="text-sm text-on-surface-variant mt-1">Calculado con tu último check-in de bienestar.</p>
      </div>

      {!latest ? (
        <div className="glass-card p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">bolt</span>
          <p className="mt-3 text-on-surface-variant">Registra un check-in con sueño, energía y fatiga para ver tu readiness.</p>
          <Link href="/tracking" className="inline-block mt-5 px-4 py-2 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold">HACER CHECK-IN</Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
              <Gauge score={result.score} color={color} />
              <p className="font-headline-md text-lg mt-4" style={{ color }}>{result.headline}</p>
              <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60 mt-1">
                {latest.date.toISOString().slice(0, 10)}
              </p>
            </div>

            <div className="glass-card p-6 border-l-4" style={{ borderColor: color }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined" style={{ color }}>smart_toy</span>
                <span className="font-label-caps text-label-caps" style={{ color }}>RECOMENDACIÓN</span>
              </div>
              <p className="text-on-surface leading-relaxed text-lg">{result.recommendation}</p>
              <Link href="/training/log" className="inline-block mt-5 px-4 py-2 bg-surface-container-highest text-primary font-label-caps text-label-caps border border-outline-variant hover:border-primary transition">
                IR A ENTRENAMIENTO
              </Link>
            </div>
          </div>

          {/* Components */}
          <div className="glass-card p-6">
            <span className="font-label-caps text-label-caps text-on-surface-variant">DESGLOSE</span>
            <div className="mt-4 space-y-4">
              {result.components.map((comp) => (
                <div key={comp.key}>
                  <div className="flex justify-between mb-1">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">{comp.label}</span>
                    <span className="font-data-point text-sm text-primary">{comp.score != null ? Math.round(comp.score) : "—"}</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2">
                    <div className="h-2" style={{ width: `${comp.score ?? 0}%`, backgroundColor: comp.score == null ? "#849495" : color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          {history.filter((h) => h.score != null).length > 1 && (
            <div className="glass-card p-6">
              <span className="font-label-caps text-label-caps text-on-surface-variant">HISTORIAL 7D</span>
              <div className="mt-4 flex items-end gap-2 h-32">
                {history.map((h) => (
                  <div key={h.day} className="flex-1 flex flex-col justify-end items-center gap-1">
                    <div
                      className="w-full rounded-t"
                      style={{ height: `${h.score ?? 0}%`, backgroundColor: h.score == null ? "#353534" : bandColor[bandFor(h.score)] }}
                      title={`${h.day}: ${h.score ?? "—"}`}
                    />
                    <span className="text-[10px] font-label-caps opacity-40">{h.day.slice(5)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}

function bandFor(score: number): "optimal" | "caution" | "recover" {
  if (score >= 75) return "optimal";
  if (score >= 50) return "caution";
  return "recover";
}
