import AppShell from "@/components/AppShell";
import WorkoutLogger from "@/components/WorkoutLogger";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = { title: "FitCoach 12% — Entrenamiento" };
export const dynamic = "force-dynamic";

export default async function TrainingLogPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");
  const workouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 8,
    include: { sets: true },
  });

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">TRAINING LOG // STRENGTH</p>
        <h1 className="font-headline-md text-headline-md">Log de entrenamiento</h1>
      </div>
      <WorkoutLogger
        recent={workouts.map((w) => ({
          id: w.id,
          name: w.name,
          date: w.date.toISOString().slice(0, 10),
          volumeKg: w.volumeKg,
          rpe: w.rpe,
          setCount: w.sets.length,
        }))}
      />
    </AppShell>
  );
}
