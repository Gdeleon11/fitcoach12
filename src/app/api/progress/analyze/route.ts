import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { analyzeImages } from "@/lib/ai";
import { trend } from "@/lib/reports";
import { estimateBodyFatRFM } from "@/lib/bodyfat";

export const maxDuration = 45; // Extend duration for AI image analysis

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

  // Choose an informative set (max 3): baseline (oldest) + current per angle, so
  // the model can compare progress over time when several dated photos exist.
  const byId = new Map<string, { url: string; date: Date; angle: string }>();
  const front = photos.filter((p) => p.angle === "FRONT");
  const side = photos.filter((p) => p.angle === "SIDE");
  const back = photos.filter((p) => p.angle === "BACK");
  const add = (p?: { id: string; url: string; date: Date; angle: string }) => {
    if (p && !byId.has(p.id) && byId.size < 3) byId.set(p.id, { url: p.url, date: p.date, angle: p.angle });
  };
  // photos are ordered desc (newest first).
  add(front.at(-1)); // baseline front (oldest)
  add(front[0]); // current front (newest)
  add(side[0] ?? back[0] ?? photos[0]); // a second angle if available
  const selected = [...byId.values()].sort((a, b) => a.date.getTime() - b.date.getTime());
  const chosen = selected.map((s) => s.url);
  const photoDesc = selected.map((s) => `${s.angle} ${s.date.toISOString().slice(0, 10)}`).join(", ");

  const latest = checkins[0];
  const w = trend([...checkins].reverse().map((c) => ({ date: c.date, weightKg: c.weightKg, waistCm: c.waistCm, steps: null, sleepH: null, energy: null })), "weightKg");
  const waist = trend([...checkins].reverse().map((c) => ({ date: c.date, weightKg: c.weightKg, waistCm: c.waistCm, steps: null, sleepH: null, energy: null })), "waistCm");
  const rfm = estimateBodyFatRFM(profile?.heightCm ?? null, latest?.waistCm ?? null, profile?.gender ?? null);

  const context = `Analiza estas fotos de progreso (en orden cronológico: ${photoDesc}). Si hay varias fechas, compara la más antigua (base) con la más reciente y describe los cambios. Contexto del usuario:
- Objetivo de grasa corporal: ${profile?.goalBodyFat ?? 12}%
- Peso actual: ${latest?.weightKg ?? profile?.weightKg ?? "?"} kg (cambio 30d: ${w.delta ?? "?"} kg)
- Cintura: ${latest?.waistCm ?? "?"} cm (cambio 30d: ${waist.delta ?? "?"} cm)
- Altura: ${profile?.heightCm ?? "?"} cm · Sexo: ${profile?.gender ?? "?"}
- Grasa estimada por fórmula RFM: ${rfm !== null ? rfm + "%" : "Desconocido"}
Revisa visualmente si el RFM tiene sentido. Si la masa muscular altera el RFM, anúlalo y usa tu propia estimación visual.`;

  const { estimatedBodyFatPct, analysisText } = await analyzeImages(chosen, context);

  await prisma.$transaction([
    prisma.aIRecommendation.create({
      data: { userId, type: "Composition", reasoning: analysisText, actionStep: null },
    }),
    prisma.progressPhoto.update({
      where: { id: photos[0].id },
      data: { aiAnalysis: { estimatedBodyFatPct, text: analysisText } },
    }),
  ]);

  return NextResponse.json({ analysis: analysisText, estimatedBodyFatPct });
}
