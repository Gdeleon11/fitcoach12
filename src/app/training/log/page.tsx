import AppShell from "@/components/AppShell";
import TrainingHub from "@/components/TrainingHub";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";
import type { PlanExercise } from "@/lib/routine";

export const metadata = { title: "FitCoach 12% — Entrenamiento" };
export const dynamic = "force-dynamic";

export default async function TrainingLogPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const [activePlan, workouts] = await Promise.all([
    prisma.workoutPlan.findFirst({ where: { userId, status: "active" }, orderBy: { createdAt: "desc" } }),
    prisma.workout.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 8, include: { sets: true } }),
  ]);

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">ENTRENAMIENTO // RUTINA IA</p>
        <h1 className="font-headline-md text-headline-md">Entrenamiento</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Genera tu rutina con IA y confirma cada ejercicio con tus reps, peso y RIR reales.
        </p>
      </div>
      <TrainingHub
        activePlan={
          activePlan
            ? {
                id: activePlan.id,
                name: activePlan.name,
                focus: activePlan.focus,
                source: activePlan.source,
                rationale: activePlan.rationale,
                exercises: (activePlan.exercises as unknown as PlanExercise[]) ?? [],
              }
            : null
        }
        recent={workouts.map((w) => ({
          id: w.id,
          name: w.name,
          date: w.date.toISOString().slice(0, 10),
          volumeKg: w.volumeKg,
          setCount: w.sets.length,
        }))}
      />
    </AppShell>
  );
}
