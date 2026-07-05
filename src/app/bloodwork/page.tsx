import type { Metadata } from "next";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/bloodwork";

export const metadata: Metadata = { title: "FitCoach 12% — Integración de Analíticas de Sangre" };

export default function Page() {
  return <StaticScreen html={html} />;
}
