import AppShell from "@/components/AppShell";
import SupplementManager from "@/components/SupplementManager";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = { title: "FitCoach 12% — Suplementación" };
export const dynamic = "force-dynamic";

export default async function SupplementsPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");
  const supplements = await prisma.supplement.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">
          SUPPLEMENTATION // PROTOCOL
        </p>
        <h1 className="font-headline-md text-headline-md">Suplementación</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Gestiona tu protocolo: qué tomas, cuánto y cuándo. Organizado por momento del día.
        </p>
      </div>
      <SupplementManager
        initial={supplements.map((s) => ({
          id: s.id,
          name: s.name,
          dosage: s.dosage,
          slot: s.slot,
          time: s.time,
          notes: s.notes,
          active: s.active,
        }))}
      />
    </AppShell>
  );
}
