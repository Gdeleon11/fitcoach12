import type { Metadata } from "next";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/dashboard_adaptive";

export const metadata: Metadata = { title: "FitCoach 12% — Dashboard · Nutrición Adaptativa" };

export default function Page() {
  return <StaticScreen html={html} />;
}
