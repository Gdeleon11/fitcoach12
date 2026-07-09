import AppShell from "@/components/AppShell";
import CheckInForm from "@/components/CheckInForm";
import CheckInHistory from "@/components/CheckInHistory";
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
    take: 60,
  });

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">REGISTRO DIARIO // BIOMÉTRICOS</p>
        <h1 className="font-headline-md text-headline-md">Check-in diario</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CheckInForm />
        <CheckInHistory
          initial={checkins.map((c) => ({
            id: c.id,
            date: c.date.toISOString().slice(0, 10),
            weightKg: c.weightKg,
            steps: c.steps,
            activeKcal: c.activeKcal,
            basalKcal: c.basalKcal,
            distanceKm: c.distanceKm,
            aiAnalysis: c.aiAnalysis,
          }))}
        />
      </div>
    </AppShell>
  );
}
