import type { Metadata } from "next";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/supplements";

export const metadata: Metadata = { title: "FitCoach 12% — Suplementación IA Estratégica" };

export default function Page() {
  return <StaticScreen html={html} />;
}
