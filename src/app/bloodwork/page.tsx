import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/bloodwork";

export const metadata: Metadata = { title: "FitCoach 12% — Integración de Analíticas de Sangre" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell>
      <StaticScreen html={html} title="Integración de Analíticas de Sangre" />
    </AppShell>
  );
}
