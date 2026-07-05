import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/training_volume";

export const metadata: Metadata = { title: "FitCoach 12% — Log · Ajuste de Volumen IA" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell>
      <StaticScreen html={html} title="Log · Ajuste de Volumen IA" />
    </AppShell>
  );
}
