import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const workouts = await prisma.workout.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 20,
    include: { sets: { orderBy: { setOrder: "asc" } } },
  });
  return NextResponse.json({ workouts });
}

const setSchema = z.object({
  exerciseName: z.string().min(1).max(120),
  reps: z.number().int().min(0).max(1000).optional(),
  weightKg: z.number().min(0).max(1000).optional(),
  rir: z.number().int().min(0).max(10).optional(),
});

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // backdate to any day
  name: z.string().max(120).optional(),
  type: z.enum(["STRENGTH", "CARDIO", "SPORT", "MOBILITY"]).optional(),
  durationM: z.number().int().min(0).max(600).optional(),
  distanceKm: z.number().min(0).max(1000).optional(),
  intensity: z.string().max(40).optional(),
  rpe: z.number().min(0).max(10).optional(),
  notes: z.string().max(1000).optional(),
  sets: z.array(setSchema).max(50).optional(),
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }
  const { sets, date, ...rest } = parsed.data;
  const when = date ? new Date(`${date}T12:00:00Z`) : undefined;
  const volumeKg = (sets ?? []).reduce((acc, s) => acc + (s.reps ?? 0) * (s.weightKg ?? 0), 0);
  const workout = await prisma.workout.create({
    data: {
      userId,
      ...rest,
      type: rest.type ?? "STRENGTH",
      volumeKg,
      ...(when ? { date: when } : {}),
      sets: sets && sets.length ? { create: sets.map((s, i) => ({ ...s, setOrder: i })) } : undefined,
    },
    include: { sets: true },
  });
  return NextResponse.json({ workout }, { status: 201 });
}

const delSchema = z.object({ id: z.string() });

export async function DELETE(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = delSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  await prisma.workout.deleteMany({ where: { id: parsed.data.id, userId } });
  return NextResponse.json({ ok: true });
}
