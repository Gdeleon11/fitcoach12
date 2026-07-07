import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const since = new Date(Date.now() - 30 * 86400000);
  const logs = await prisma.nutritionLog.findMany({
    where: { userId, date: { gte: since } },
    orderBy: { date: "desc" },
  });
  return NextResponse.json({ logs });
}

const schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // backdate to any day
  mealName: z.string().max(120).optional(),
  description: z.string().max(1000).optional(),
  totalKcal: z.number().int().min(0).max(10000).optional(),
  proteinG: z.number().int().min(0).max(1000).optional(),
  carbsG: z.number().int().min(0).max(2000).optional(),
  fatG: z.number().int().min(0).max(1000).optional(),
  waterLiters: z.number().min(0).max(20).optional(),
  aiEstimated: z.boolean().optional(),
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }
  const { date, ...rest } = parsed.data;
  const when = date ? new Date(`${date}T12:00:00Z`) : undefined;
  const log = await prisma.nutritionLog.create({ data: { userId, ...rest, ...(when ? { date: when } : {}) } });
  return NextResponse.json({ log }, { status: 201 });
}

const delSchema = z.object({ id: z.string() });

export async function DELETE(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = delSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  await prisma.nutritionLog.deleteMany({ where: { id: parsed.data.id, userId } });
  return NextResponse.json({ ok: true });
}
