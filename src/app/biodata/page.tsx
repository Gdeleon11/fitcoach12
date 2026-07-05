import type { Metadata } from "next";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/biodata";

export const metadata: Metadata = { title: "FitCoach 12% — Sincronización Bio-Data · Wearables" };

export default function Page() {
  return <StaticScreen html={html} />;
}
