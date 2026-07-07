import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const checkins = await prisma.dailyCheckIn.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 30,
  });
  return NextResponse.json({ checkins });
}

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // backdate to any day
  weightKg: z.number().min(30).max(300).optional(),
  waistCm: z.number().min(40).max(200).optional(),
  sleepH: z.number().min(0).max(24).optional(),
  energy: z.number().int().min(1).max(5).optional(),
  hunger: z.number().int().min(1).max(5).optional(),
  fatigue: z.number().int().min(1).max(5).optional(),
  digestion: z.number().int().min(1).max(5).optional(),
  stress: z.number().int().min(1).max(5).optional(),
  steps: z.number().int().min(0).max(100000).optional(),
  activeKcal: z.number().int().min(0).max(20000).optional(),
  basalKcal: z.number().int().min(0).max(10000).optional(),
  distanceKm: z.number().min(0).max(500).optional(),
  notes: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }
  const { date, ...rest } = parsed.data;
  // Store backdated entries at noon UTC so the calendar day never shifts by timezone.
  const when = date ? new Date(`${date}T12:00:00Z`) : undefined;
  const checkin = await prisma.dailyCheckIn.create({
    data: { userId, ...rest, ...(when ? { date: when } : {}) },
  });
  return NextResponse.json({ checkin }, { status: 201 });
}

const delSchema = z.object({ id: z.string() });

export async function DELETE(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = delSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  await prisma.dailyCheckIn.deleteMany({ where: { id: parsed.data.id, userId } });
  return NextResponse.json({ ok: true });
}
