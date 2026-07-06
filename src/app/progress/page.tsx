import AppShell from "@/components/AppShell";
import ProgressGallery from "@/components/ProgressGallery";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = { title: "FitCoach 12% — Análisis de Progreso" };
export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");
  const [photos, lastAnalysis] = await Promise.all([
    prisma.progressPhoto.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 60 }),
    prisma.aIRecommendation.findFirst({
      where: { userId, type: "Composition" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">
          ANÁLISIS VISUAL // COMPOSICIÓN CORPORAL
        </p>
        <h1 className="font-headline-md text-headline-md">Análisis de progreso</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Sube fotos por ángulo (frente, perfil, espalda) para seguir tu composición corporal en el tiempo.
        </p>
      </div>
      <ProgressGallery
        initialAnalysis={lastAnalysis?.reasoning ?? null}
        initial={photos.map((p) => ({
          id: p.id,
          url: p.url,
          angle: p.angle,
          date: p.date.toISOString().slice(0, 10),
        }))}
      />
    </AppShell>
  );
}
