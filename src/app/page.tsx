import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen flex flex-col">
      <header className="w-full border-b border-outline-variant">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          <h1 className="font-display-lg text-2xl md:text-display-lg text-primary-container tracking-tighter">
            FitCoach 12%
          </h1>
          <div className="flex gap-4 items-center">
            <Link
              href="/login"
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors py-1"
            >
              LOG IN
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold hover:brightness-110 transition"
            >
              EMPEZAR
            </Link>
          </div>
        </div>
      </header>

      <section className="flex-1 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full flex flex-col justify-center py-20">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-4">
          PRECISION SYSTEM // SYSTEM_ONLINE
        </p>
        <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg max-w-3xl leading-tight mb-6">
          Optimiza tu biología como un{" "}
          <span className="text-primary-container">sistema de alto rendimiento</span>.
        </h2>
        <p className="font-body-regular text-body-regular text-on-surface-variant max-w-2xl mb-10">
          Entrenamiento con ajuste de volumen por IA, nutrición adaptativa, análisis de
          composición corporal y un coach que lee tus datos de los últimos 7 días. Diseñado para
          llegar y sostener el 12% de grasa corporal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/register"
            className="px-6 py-3 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold text-center hover:brightness-110 transition"
          >
            CREAR CUENTA
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-outline-variant text-primary font-label-caps text-label-caps text-center hover:border-primary transition"
          >
            YA TENGO CUENTA
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
          {[
            ["insights", "Command Center", "KPIs de peso, cintura y adherencia en un dashboard tipo bento."],
            ["smart_toy", "AI Coach", "Lecturas honestas y ajustes calóricos con capa de seguridad."],
            ["monitoring", "Análisis Visual", "Composición corporal y progreso a partir de fotos y wearables."],
          ].map(([icon, title, desc]) => (
            <div key={title} className="glass-card p-6">
              <span className="material-symbols-outlined text-primary-fixed-dim">{icon}</span>
              <h3 className="font-headline-md text-lg mt-3 mb-1">{title}</h3>
              <p className="text-sm text-on-surface-variant">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-outline-variant py-6">
        <p className="text-center font-label-caps text-label-caps text-on-surface-variant opacity-60">
          FITCOACH 12% // PRECISION SYSTEM
        </p>
      </footer>
    </main>
  );
}
