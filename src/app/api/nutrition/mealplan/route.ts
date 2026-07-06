import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { generateMealPlan } from "@/lib/mealplan";

export async function POST() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile?.targetKcal) {
    return NextResponse.json({ error: "Completa tu onboarding para tener un objetivo calórico." }, { status: 400 });
  }

  const plan = await generateMealPlan({
    targetKcal: profile.targetKcal,
    proteinG: profile.proteinG,
    carbsG: profile.carbsG,
    fatG: profile.fatG,
    foodWindowStart: profile.foodWindowStart,
    foodWindowEnd: profile.foodWindowEnd,
    goalBodyFat: profile.goalBodyFat,
  });

  if (!plan) {
    return NextResponse.json(
      { error: "No se pudo generar el menú. Requiere una clave de IA (GEMINI_API_KEY) válida e inténtalo de nuevo." },
      { status: 502 }
    );
  }

  return NextResponse.json({ plan });
}
