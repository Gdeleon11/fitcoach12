import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/supplements";

export const metadata: Metadata = { title: "FitCoach 12% — Suplementación IA Estratégica" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell>
      <StaticScreen html={html} title="Suplementación IA Estratégica" />
    </AppShell>
  );
}
