import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { generateMealPlan } from "@/lib/mealplan";

export const maxDuration = 60;

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const preferences = typeof body.preferences === "string" ? body.preferences.trim() : "";

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
    preferences,
  });

  if (!plan) {
    return NextResponse.json(
      {
        error:
          "No se pudo generar el menú. Si usas Ollama local, asegúrate de que esté encendido y que el túnel esté activo. La generación completa puede demorar hasta 60 segundos.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ plan });
}
