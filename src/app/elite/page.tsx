import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import StaticScreen from "@/components/StaticScreen";
import { html } from "@/screens/elite";

export const metadata: Metadata = { title: "FitCoach 12% — Elite Performance Suite" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell>
      <StaticScreen html={html} title="Elite Performance Suite" />
    </AppShell>
  );
}
