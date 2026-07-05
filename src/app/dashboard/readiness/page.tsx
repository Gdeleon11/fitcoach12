import type { Metadata } from "next";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/dashboard_readiness";

export const metadata: Metadata = { title: "FitCoach 12% — Dashboard · Readiness Score" };

export default function Page() {
  return <StaticScreen html={html} />;
}
