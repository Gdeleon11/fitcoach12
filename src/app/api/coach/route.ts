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

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const [profile, checkins, nutrition, workouts, supplements, bloodmarkers, rawHistory] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.dailyCheckIn.findMany({ where: { userId, date: { gte: thirtyDaysAgo } }, orderBy: { date: "asc" } }),
    prisma.nutritionLog.findMany({ where: { userId, date: { gte: fourteenDaysAgo } }, orderBy: { date: "asc" } }),
    prisma.workout.findMany({
      where: { userId, date: { gte: fourteenDaysAgo } },
      orderBy: { date: "asc" },
      include: { sets: { orderBy: { setOrder: "asc" } } },
    }),
    prisma.supplement.findMany({ where: { userId, active: true } }),
    prisma.bloodMarker.findMany({ where: { userId }, orderBy: { panelDate: "desc" }, take: 10 }),
    prisma.chatMessage.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 30 }),
  ]);
  const history = rawHistory.reverse();

  const context = `CONTEXTO DEL USUARIO (no lo repitas de forma literal, úsalo para realizar un análisis profundo):
Perfil: ${JSON.stringify({
    age: profile?.age,
    heightCm: profile?.heightCm,
    weightKg: profile?.weightKg,
    gender: profile?.gender,
    activityLevel: profile?.activityLevel,
    goalBodyFat: profile?.goalBodyFat,
    tdee: profile?.tdee,
    targetKcal: profile?.targetKcal,
    macros: { p: profile?.proteinG, c: profile?.carbsG, f: profile?.fatG },
  })}
Check-ins 30d (historial de peso/bienestar): ${JSON.stringify(
    checkins.map((c) => ({
      d: c.date.toISOString().slice(0, 10),
      w: c.weightKg,
      waist: c.waistCm,
      sleep: c.sleepH,
      energy: c.energy,
      stress: c.stress,
      fatigue: c.fatigue,
      steps: c.steps,
    }))
  )}
Nutrición 14d (últimas comidas y calorías): ${JSON.stringify(
    nutrition.map((n) => ({
      d: n.date.toISOString().slice(0, 10),
      meal: n.mealName,
      kcal: n.totalKcal,
      p: n.proteinG,
      c: n.carbsG,
      f: n.fatG,
    }))
  )}
Entrenamientos 14d (ejercicios y volumen): ${JSON.stringify(
    workouts.map((w) => ({
      d: w.date.toISOString().slice(0, 10),
      name: w.name,
      type: w.type,
      rpe: w.rpe,
      vol: w.volumeKg,
      sets: w.sets.map((s) => ({ ex: s.exerciseName, reps: s.reps, wt: s.weightKg, rir: s.rir })),
    }))
  )}
Suplementos activos: ${JSON.stringify(supplements.map((s) => ({ name: s.name, dosage: s.dosage, slot: s.slot, time: s.time })))}
Analíticas de sangre recientes: ${JSON.stringify(bloodmarkers.map((b) => ({ d: b.panelDate.toISOString().slice(0, 10), key: b.markerKey, name: b.name, val: b.value, unit: b.unit })))}`;

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
