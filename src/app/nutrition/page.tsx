import AppShell from "@/components/AppShell";
import NutritionLogger from "@/components/NutritionLogger";
import MealPlanGenerator from "@/components/MealPlanGenerator";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = { title: "FitCoach 12% — Nutrición" };
export const dynamic = "force-dynamic";

export default async function NutritionPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const [profile, logs] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId } }),
    prisma.nutritionLog.findMany({ where: { userId, date: { gte: start } }, orderBy: { date: "asc" } }),
  ]);

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">NUTRITION LOG // IA</p>
        <h1 className="font-headline-md text-headline-md">Registro de nutrición</h1>
      </div>
      <NutritionLogger
        target={{ kcal: profile?.targetKcal ?? null, protein: profile?.proteinG ?? null, carbs: profile?.carbsG ?? null, fat: profile?.fatG ?? null }}
        initialLogs={logs.map((l) => ({
          id: l.id,
          mealName: l.mealName,
          totalKcal: l.totalKcal,
          proteinG: l.proteinG,
          carbsG: l.carbsG,
          fatG: l.fatG,
          aiEstimated: l.aiEstimated,
        }))}
      />
      <MealPlanGenerator />
    </AppShell>
  );
}
