import type { Metadata } from "next";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/reports_transition";

export const metadata: Metadata = { title: "FitCoach 12% — Reporte Mensual · Lógica de Transición" };

export default function Page() {
  return <StaticScreen html={html} />;
}
