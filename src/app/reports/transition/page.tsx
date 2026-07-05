import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/reports_transition";

export const metadata: Metadata = { title: "FitCoach 12% — Reporte Mensual · Lógica de Transición" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell>
      <StaticScreen html={html} title="Reporte Mensual · Lógica de Transición" />
    </AppShell>
  );
}
