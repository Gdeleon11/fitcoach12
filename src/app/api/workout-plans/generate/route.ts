import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { buildRoutine, bestWeightByExercise, FOCUS_OPTIONS } from "@/lib/routine";

export const maxDuration = 60;

const schema = z.object({
  focus: z.enum(FOCUS_OPTIONS.map((f) => f.key) as [string, ...string[]]).default("full"),
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  const focus = parsed.success ? parsed.data.focus : "full";

  const [profile, workouts] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId }, select: { goalBodyFat: true } }),
    prisma.workout.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 30,
      include: { sets: true },
    }),
  ]);

  const history = workouts.flatMap((w) => w.sets.map((s) => ({ exerciseName: s.exerciseName, weightKg: s.weightKg })));
  const best = bestWeightByExercise(history);

  const routine = await buildRoutine({ focus, goalBodyFat: profile?.goalBodyFat ?? null, best });

  // Keep a single active plan: clear previous active ones.
  await prisma.workoutPlan.deleteMany({ where: { userId, status: "active" } });

  const plan = await prisma.workoutPlan.create({
    data: {
      userId,
      name: routine.name,
      focus: routine.focus,
      rationale: routine.rationale,
      exercises: routine.exercises,
      source: routine.source,
      status: "active",
    },
  });

  return NextResponse.json({ plan }, { status: 201 });
}
