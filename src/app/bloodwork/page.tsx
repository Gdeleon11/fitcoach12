import AppShell from "@/components/AppShell";
import BloodworkManager from "@/components/BloodworkManager";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = { title: "FitCoach 12% — Analíticas de Sangre" };
export const dynamic = "force-dynamic";

export default async function BloodworkPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");
  const [profile, markers] = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId }, select: { gender: true } }),
    prisma.bloodMarker.findMany({
      where: { userId },
      orderBy: [{ panelDate: "desc" }, { createdAt: "desc" }],
      take: 200,
    }),
  ]);

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">
          BLOODWORK // BIOMARKERS
        </p>
        <h1 className="font-headline-md text-headline-md">Analíticas de Sangre</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Ingresa tus valores de laboratorio y la app los interpreta según rangos de referencia.
        </p>
      </div>
      <BloodworkManager
        sex={profile?.gender ?? null}
        initial={markers.map((m) => ({
          id: m.id,
          markerKey: m.markerKey,
          name: m.name,
          value: m.value,
          unit: m.unit,
          panelDate: m.panelDate.toISOString().slice(0, 10),
        }))}
      />
    </AppShell>
  );
}
