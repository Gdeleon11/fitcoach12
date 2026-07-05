import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { loadAdaptive } from "@/lib/adaptiveServer";
import { MIN_SAFE_KCAL } from "@/lib/nutrition";

// Recomputes server-side (ignores client input) and persists the new targets.
export async function POST() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { result } = await loadAdaptive(userId);

  if (result.suggestedTarget == null || result.deltaKcal === 0 || result.status === "insufficient") {
    return NextResponse.json({ error: "No hay ajuste que aplicar ahora mismo." }, { status: 400 });
  }
  const safeTarget = Math.max(MIN_SAFE_KCAL, result.suggestedTarget);

  const profile = await prisma.userProfile.update({
    where: { userId },
    data: {
      targetKcal: safeTarget,
      proteinG: result.suggestedMacros?.proteinG,
      carbsG: result.suggestedMacros?.carbsG,
      fatG: result.suggestedMacros?.fatG,
    },
    select: { targetKcal: true, proteinG: true, carbsG: true, fatG: true },
  });

  // Log the recommendation for history.
  await prisma.aIRecommendation.create({
    data: {
      userId,
      type: "CalorieAdj",
      reasoning: result.reason,
      actionStep: `Objetivo → ${safeTarget} kcal (${result.deltaKcal > 0 ? "+" : ""}${result.deltaKcal})`,
      payload: { suggestedTarget: safeTarget, weeklyChangePct: result.weeklyChangePct },
    },
  });

  return NextResponse.json({ profile });
}
