import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const logs = await prisma.nutritionLog.findMany({
    where: { userId, date: { gte: start } },
    orderBy: { date: "asc" },
  });
  return NextResponse.json({ logs });
}

const schema = z.object({
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
  const log = await prisma.nutritionLog.create({ data: { userId, ...parsed.data } });
  return NextResponse.json({ log }, { status: 201 });
}
