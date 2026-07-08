import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { chat, type ChatMsg } from "@/lib/ai";

export const maxDuration = 60;

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const messages = await prisma.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    take: 50,
  });
  return NextResponse.json({ messages });
}

const schema = z.object({ message: z.string().min(1).max(2000) });

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [profile, checkins, nutrition, history] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.dailyCheckIn.findMany({ where: { userId, date: { gte: sevenDaysAgo } }, orderBy: { date: "asc" } }),
    prisma.nutritionLog.findMany({ where: { userId, date: { gte: sevenDaysAgo } }, orderBy: { date: "asc" } }),
    prisma.chatMessage.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: 20 }),
  ]);

  const context = `CONTEXTO DEL USUARIO (no lo repitas literalmente):
Perfil: ${JSON.stringify({
    age: profile?.age,
    heightCm: profile?.heightCm,
    weightKg: profile?.weightKg,
    goalBodyFat: profile?.goalBodyFat,
    tdee: profile?.tdee,
    targetKcal: profile?.targetKcal,
    macros: { p: profile?.proteinG, c: profile?.carbsG, f: profile?.fatG },
  })}
Check-ins 7d: ${JSON.stringify(checkins.map((c) => ({ d: c.date.toISOString().slice(0, 10), w: c.weightKg, waist: c.waistCm, sleep: c.sleepH, energy: c.energy, steps: c.steps })))}
Nutrición 7d: ${JSON.stringify(nutrition.map((n) => ({ d: n.date.toISOString().slice(0, 10), kcal: n.totalKcal, p: n.proteinG })))}`;

  const messages: ChatMsg[] = [
    { role: "system", content: context },
    ...history.map((m) => ({ role: m.role as ChatMsg["role"], content: m.content })),
    { role: "user", content: parsed.data.message },
  ];

  const reply = await chat(messages);

  await prisma.chatMessage.createMany({
    data: [
      { userId, role: "user", content: parsed.data.message },
      { userId, role: "assistant", content: reply },
    ],
  });

  return NextResponse.json({ reply });
}
