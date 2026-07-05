import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/biodata";

export const metadata: Metadata = { title: "FitCoach 12% — Sincronización Bio-Data · Wearables" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell>
      <StaticScreen html={html} title="Sincronización Bio-Data · Wearables" />
    </AppShell>
  );
}
