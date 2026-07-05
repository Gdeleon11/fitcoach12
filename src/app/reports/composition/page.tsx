import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/reports_composition";

export const metadata: Metadata = { title: "FitCoach 12% — Reporte Mensual · Composición Corporal" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell>
      <StaticScreen html={html} title="Reporte Mensual · Composición Corporal" />
    </AppShell>
  );
}
