"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/tracking", icon: "analytics", label: "Tracking" },
  { href: "/nutrition", icon: "restaurant", label: "Nutrition" },
  { href: "/training/log", icon: "fitness_center", label: "Training" },
  { href: "/coach", icon: "smart_toy", label: "AI Coach" },
];

const SECONDARY = [
  { href: "/progress", label: "Progreso Visual" },
  { href: "/reports/weekly", label: "Reporte Semanal" },
  { href: "/reports/composition", label: "Composición" },
  { href: "/reports/transition", label: "Transición" },
  { href: "/dashboard/readiness", label: "Readiness" },
  { href: "/dashboard/adaptive", label: "Nutrición Adaptativa" },
  { href: "/training/volume", label: "Volumen IA" },
  { href: "/biodata", label: "Wearables" },
  { href: "/bloodwork", label: "Analíticas Sangre" },
  { href: "/supplements", label: "Suplementación" },
  { href: "/elite", label: "Elite Suite" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="w-full sticky top-0 z-50 bg-background border-b border-outline-variant">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-3 max-w-container-max mx-auto">
          <Link href="/dashboard" className="font-display-lg text-xl md:text-2xl text-primary-container tracking-tighter">
            FitCoach 12%
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/coach" className="material-symbols-outlined text-primary cursor-pointer">smart_toy</Link>
            <Link href="/tracking" className="material-symbols-outlined text-primary cursor-pointer">monitor_weight</Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="material-symbols-outlined text-on-surface-variant hover:text-error transition"
              title="Cerrar sesión"
            >
              logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col h-[calc(100vh-57px)] w-64 fixed left-0 top-[57px] bg-surface-container-low border-r border-outline-variant z-40 overflow-y-auto scroll-hide">
        <div className="px-6 pt-6 mb-4">
          <h2 className="font-headline-md text-lg text-primary">Elite Performance</h2>
          <p className="font-label-caps text-label-caps text-on-surface-variant">Phase: Hypertrophy</p>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "flex items-center gap-3 px-6 py-3.5 cursor-pointer transition-all duration-200 " +
                  (active
                    ? "bg-primary-container text-on-primary-container font-bold border-l-4 border-primary"
                    : "text-on-surface-variant hover:bg-surface-container-highest")
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="font-label-caps text-label-caps">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-6 pt-6 pb-2">
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-60 mb-2">ANALYTICS</p>
          <div className="flex flex-col gap-1">
            {SECONDARY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "text-sm py-1.5 transition-colors " +
                  (pathname === item.href ? "text-primary" : "text-on-surface-variant hover:text-primary")
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-low border-t border-outline-variant flex justify-around py-2">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={"flex flex-col items-center px-2 " + (active ? "text-primary" : "text-on-surface-variant")}>
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
            </Link>
          );
        })}
      </nav>

      <main className="lg:pl-64 min-h-screen pb-20 lg:pb-0">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">{children}</div>
      </main>
    </div>
  );
}
