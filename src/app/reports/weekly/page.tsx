import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/reports_weekly";

export const metadata: Metadata = { title: "FitCoach 12% — Reporte Semanal Estratégico" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell>
      <StaticScreen html={html} title="Reporte Semanal Estratégico" />
    </AppShell>
  );
}
