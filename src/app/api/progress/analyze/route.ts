import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { analyzeImages } from "@/lib/ai";
import { trend } from "@/lib/reports";

export async function POST() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const [profile, photos, checkins] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.progressPhoto.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 12 }),
    prisma.dailyCheckIn.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 30 }),
  ]);

  if (photos.length === 0) {
    return NextResponse.json({ error: "Sube al menos una foto antes de analizar." }, { status: 400 });
  }

  // Most recent photo per angle (max 3 images).
  const seen = new Set<string>();
  const chosen: string[] = [];
  for (const p of photos) {
    if (!seen.has(p.angle)) {
      seen.add(p.angle);
      chosen.push(p.url);
    }
    if (chosen.length >= 3) break;
  }

  const latest = checkins[0];
  const w = trend([...checkins].reverse().map((c) => ({ date: c.date, weightKg: c.weightKg, waistCm: c.waistCm, steps: null, sleepH: null, energy: null })), "weightKg");
  const waist = trend([...checkins].reverse().map((c) => ({ date: c.date, weightKg: c.weightKg, waistCm: c.waistCm, steps: null, sleepH: null, energy: null })), "waistCm");

  const context = `Analiza estas fotos de progreso. Contexto del usuario:
- Objetivo de grasa corporal: ${profile?.goalBodyFat ?? 12}%
- Peso actual: ${latest?.weightKg ?? profile?.weightKg ?? "?"} kg (cambio 30d: ${w.delta ?? "?"} kg)
- Cintura: ${latest?.waistCm ?? "?"} cm (cambio 30d: ${waist.delta ?? "?"} cm)
- Altura: ${profile?.heightCm ?? "?"} cm · Sexo: ${profile?.gender ?? "?"}
Da una lectura honesta y accionable alineada al objetivo.`;

  const analysis = await analyzeImages(chosen, context);

  await prisma.aIRecommendation.create({
    data: { userId, type: "Composition", reasoning: analysis, actionStep: null },
  });

  return NextResponse.json({ analysis });
}
