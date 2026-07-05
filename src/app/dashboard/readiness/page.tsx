import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/dashboard_readiness";

export const metadata: Metadata = { title: "FitCoach 12% — Dashboard · Readiness Score" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell>
      <StaticScreen html={html} title="Dashboard · Readiness Score" />
    </AppShell>
  );
}
