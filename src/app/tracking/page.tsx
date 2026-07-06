import AppShell from "@/components/AppShell";
import CheckInForm from "@/components/CheckInForm";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = { title: "FitCoach 12% — Tracking" };
export const dynamic = "force-dynamic";

export default async function TrackingPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");
  const checkins = await prisma.dailyCheckIn.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 10,
  });

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">REGISTRO DIARIO // BIOMÉTRICOS</p>
        <h1 className="font-headline-md text-headline-md">Check-in diario</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CheckInForm />
        <div className="glass-card p-6">
          <span className="font-label-caps text-label-caps text-on-surface-variant">HISTORIAL</span>
          <div className="mt-4 divide-y divide-outline-variant">
            {checkins.length === 0 && (
              <p className="text-sm text-on-surface-variant py-4">Aún no hay check-ins. Registra el primero.</p>
            )}
            {checkins.map((c) => (
              <div key={c.id} className="py-3 flex justify-between items-center">
                <span className="font-label-caps text-label-caps text-on-surface-variant">
                  {c.date.toISOString().slice(0, 10)}
                </span>
                <span className="font-data-point text-sm">
                  {c.weightKg ? `${c.weightKg}kg` : "—"} · {c.steps ? `${c.steps} pasos` : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
