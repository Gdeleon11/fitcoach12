import type { Metadata } from "next";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/reports_weekly";

export const metadata: Metadata = { title: "FitCoach 12% — Reporte Semanal Estratégico" };

export default function Page() {
  return <StaticScreen html={html} />;
}
