import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/dashboard_adaptive";

export const metadata: Metadata = { title: "FitCoach 12% — Dashboard · Nutrición Adaptativa" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell>
      <StaticScreen html={html} title="Dashboard · Nutrición Adaptativa" />
    </AppShell>
  );
}
