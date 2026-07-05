import AppShell from "@/components/AppShell";
import CoachChat from "@/components/CoachChat";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { redirect } from "next/navigation";
import { aiEnabled } from "@/lib/ai";

export const metadata = { title: "FitCoach 12% — AI Coach" };
export const dynamic = "force-dynamic";

export default async function CoachPage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");
  const history = await prisma.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  return (
    <AppShell>
      <div className="mb-6">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">AI COACH // CONTEXT_7D</p>
        <h1 className="font-headline-md text-headline-md">Tu coach personal</h1>
        {!aiEnabled && (
          <p className="mt-2 text-xs text-tertiary-fixed-dim">
            Modo demo: configura OPENAI_API_KEY para respuestas reales basadas en tus datos.
          </p>
        )}
      </div>
      <CoachChat initial={history.map((m) => ({ role: m.role, content: m.content }))} />
    </AppShell>
  );
}
