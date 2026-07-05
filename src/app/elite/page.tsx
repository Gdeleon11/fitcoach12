import type { Metadata } from "next";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/elite";

export const metadata: Metadata = { title: "FitCoach 12% — Elite Performance Suite" };

export default function Page() {
  return <StaticScreen html={html} />;
}
