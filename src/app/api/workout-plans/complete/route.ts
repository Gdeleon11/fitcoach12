import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

const resultSchema = z.object({
  name: z.string().min(1),
  sets: z.number().int().min(1).max(20),
  reps: z.number().int().min(0).max(200).nullable(),
  weightKg: z.number().min(0).max(1000).nullable(),
  // RIR can be negative (reps taken past failure / forced reps).
  rir: z.number().int().min(-5).max(10).nullable(),
  done: z.boolean(),
});

const schema = z.object({
  planId: z.string(),
  results: z.array(resultSchema).min(1),
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: `Revisa los valores ingresados (${issue?.path.join(".") || "campo"}): ${issue?.message ?? "dato inválido"}.` },
      { status: 400 }
    );
  }

  const plan = await prisma.workoutPlan.findFirst({ where: { id: parsed.data.planId, userId } });
  if (!plan) return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });

  const done = parsed.data.results.filter((r) => r.done);
  if (done.length === 0) {
    return NextResponse.json({ error: "Marca al menos un ejercicio como hecho." }, { status: 400 });
  }

  // Expand each confirmed exercise into its set count.
  const setRows: { exerciseName: string; setOrder: number; reps: number | null; weightKg: number | null; rir: number | null }[] = [];
  let order = 0;
  let volumeKg = 0;
  for (const r of done) {
    for (let i = 0; i < r.sets; i++) {
      setRows.push({ exerciseName: r.name, setOrder: order++, reps: r.reps, weightKg: r.weightKg, rir: r.rir });
      volumeKg += (r.reps ?? 0) * (r.weightKg ?? 0);
    }
  }

  const workout = await prisma.workout.create({
    data: {
      userId,
      name: plan.name,
      type: "STRENGTH",
      volumeKg,
      sets: { create: setRows },
    },
    include: { sets: true },
  });

  await prisma.workoutPlan.update({
    where: { id: plan.id },
    data: { status: "completed", workoutId: workout.id },
  });

  return NextResponse.json({ workout }, { status: 201 });
}
