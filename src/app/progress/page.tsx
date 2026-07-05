import type { Metadata } from "next";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/progress";

export const metadata: Metadata = { title: "FitCoach 12% — Análisis de Progreso e IA Visual" };

export default function Page() {
  return <StaticScreen html={html} />;
}
