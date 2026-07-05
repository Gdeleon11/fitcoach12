import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { tdee, targetKcal, macros, type Gender } from "@/lib/nutrition";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  return NextResponse.json({ profile });
}

const schema = z.object({
  name: z.string().optional(),
  age: z.number().int().min(10).max(100).optional(),
  heightCm: z.number().min(100).max(250).optional(),
  weightKg: z.number().min(30).max(300).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  activityLevel: z.string().optional(),
  goalBodyFat: z.number().min(5).max(40).optional(),
  foodWindowStart: z.string().optional(),
  foodWindowEnd: z.string().optional(),
  onboardingDone: z.boolean().optional(),
});

export async function PUT(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }
  const d = parsed.data;

  // Recompute energy targets when we have enough data.
  let computed: { tdee?: number; targetKcal?: number; proteinG?: number; carbsG?: number; fatG?: number } = {};
  if (d.weightKg && d.heightCm && d.age && d.gender && d.activityLevel) {
    const t = tdee(d.weightKg, d.heightCm, d.age, d.gender as Gender, d.activityLevel);
    const target = targetKcal(t, d.goalBodyFat ?? 12);
    const m = macros(target, d.weightKg);
    computed = { tdee: t, targetKcal: target, proteinG: m.proteinG, carbsG: m.carbsG, fatG: m.fatG };
  }

  const profile = await prisma.userProfile.upsert({
    where: { userId },
    create: { userId, ...d, ...computed },
    update: { ...d, ...computed },
  });

  return NextResponse.json({ profile });
}
