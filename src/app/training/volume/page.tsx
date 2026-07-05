import type { Metadata } from "next";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/training_volume";

export const metadata: Metadata = { title: "FitCoach 12% — Log · Ajuste de Volumen IA" };

export default function Page() {
  return <StaticScreen html={html} />;
}
