import { prisma } from "@/lib/prisma";

export async function buildUserContext(userId: string) {
  const [profile, checkIns, workouts, nutritionLogs] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.dailyCheckIn.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 3,
    }),
    prisma.workout.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
      include: { sets: true },
    }),
    prisma.nutritionLog.findMany({
      where: { userId, date: { gte: new Date(Date.now() - 2 * 86400000) } },
      orderBy: { date: "desc" },
      take: 10,
    }),
  ]);

  let context = "CONTEXTO DEL USUARIO:\n";

  if (profile) {
    context += `- Objetivo de Grasa Corporal: ${profile.goalBodyFat ?? 12}%\n`;
    context += `- Macros Objetivo Diarios: ${profile.targetKcal ?? "No definidos"} kcal (P: ${profile.proteinG ?? "-"}g, C: ${profile.carbsG ?? "-"}g, G: ${profile.fatG ?? "-"}g)\n`;
  }

  if (checkIns.length > 0) {
    context += "\nÚLTIMOS CHECK-INS (Fatiga, Sueño, Estrés):\n";
    for (const c of checkIns) {
      context += `- ${c.date.toISOString().slice(0, 10)}: Fatiga: ${c.fatigue ?? "-"}/5 | Estrés: ${c.stress ?? "-"}/5 | Sueño: ${c.sleepH ?? "-"}h\n`;
    }
  }

  if (workouts.length > 0) {
    context += "\nÚLTIMOS 5 ENTRENAMIENTOS:\n";
    for (const w of workouts) {
      const type = w.type;
      const metrics = type === "STRENGTH" ? `${w.sets?.length ?? 0} series, RPE: ${w.rpe ?? "-"}` : `${w.durationM ?? 0} min, ${w.distanceKm ?? 0} km, RPE: ${w.rpe ?? "-"}`;
      context += `- ${w.date.toISOString().slice(0, 10)}: ${type} - ${metrics}\n`;
    }
  }

  if (nutritionLogs.length > 0) {
    context += "\nCOMIDAS RECIENTES (Últimos 2 días):\n";
    for (const n of nutritionLogs) {
      context += `- ${n.date.toISOString().slice(0, 10)}: ${n.mealName || "Comida"} - ${n.totalKcal ?? 0} kcal (P:${n.proteinG ?? 0}g C:${n.carbsG ?? 0}g G:${n.fatG ?? 0}g)\n`;
    }
  }

  return context;
}
