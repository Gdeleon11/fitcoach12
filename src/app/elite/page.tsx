import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { trend } from "@/lib/reports";

export const metadata = { title: "FitCoach 12% — Elite Performance Suite" };
export const dynamic = "force-dynamic";

export default async function EliteSuitePage() {
  const userId = await requireUserId();
  if (!userId) redirect("/login");

  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile?.onboardingDone) redirect("/onboarding");

  // Fetch some real data to make the metrics dynamic (even if partially simulated until all modules are connected)
  const checkins = await prisma.dailyCheckIn.findMany({ 
    where: { userId }, 
    orderBy: { date: "desc" }, 
    take: 14 
  });

  const latest = checkins[0];
  const stepsValues = checkins.map(c => c.steps).filter((s): s is number => s !== null);
  const avgSteps = stepsValues.length > 0 ? stepsValues.reduce((a, b) => a + b, 0) / stepsValues.length : 0;

  // EPI: Elite Performance Index (0-100)
  let epiScore = 75; 
  if (latest) {
    if (latest.sleepH && latest.sleepH > 6.5) epiScore += 5;
    if (latest.energy && latest.energy >= 4) epiScore += 5;
    if (avgSteps > 8000) epiScore += 5;
    if (avgSteps > 12000) epiScore += 5;
  }
  
  // Cap at 99 for elite aesthetic
  epiScore = Math.min(99, epiScore);

  // CNS Fatigue Simulation (0-100%, lower is better)
  let cnsFatigue = 30;
  if (latest?.energy) cnsFatigue = Math.max(10, (5 - latest.energy) * 20);
  const cnsColor = cnsFatigue < 40 ? "text-primary-container" : cnsFatigue < 70 ? "text-secondary-container" : "text-tertiary-fixed-dim";

  return (
    <AppShell>
      <div className="mb-8">
        <p className="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">public</span>
          FITCOACH 12% // NETWORK
        </p>
        <h1 className="font-headline-md text-headline-md text-primary">Elite Performance Suite</h1>
        <p className="text-on-surface-variant font-body-regular mt-2">
          Centro de comando de métricas avanzadas. Análisis profundo de biomarcadores y periodización.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* EPI (Elite Performance Index) */}
        <div className="col-span-12 md:col-span-5 glass-card p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-9xl">memory</span>
          </div>
          <span className="font-label-caps text-label-caps text-on-surface-variant mb-4 relative z-10 uppercase tracking-widest">
            Índice de Rendimiento (EPI)
          </span>
          <div className="relative w-40 h-40 flex items-center justify-center mb-4 z-10">
            {/* SVG Circle */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="74" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle 
                cx="80" cy="80" r="74" fill="none" 
                stroke="#00f0ff" strokeWidth="8" 
                strokeDasharray="465" 
                strokeDashoffset={465 - (465 * epiScore) / 100}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className="font-display-lg text-5xl text-primary drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                {epiScore}
              </span>
              <span className="font-label-caps text-[10px] text-primary opacity-80">/ 100</span>
            </div>
          </div>
          <p className="font-label-caps text-label-caps text-on-surface-variant z-10">
            ESTADO: <span className="text-primary font-bold">ÓPTIMO PARA HIPERTROFIA</span>
          </p>
        </div>

        {/* CNS & AI Directive */}
        <div className="col-span-12 md:col-span-7 grid grid-rows-2 gap-6">
          {/* CNS Fatigue */}
          <div className="glass-card p-6 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">SNC (Sistema Nervioso Central)</h3>
                <p className="text-xs text-on-surface-variant mt-1 opacity-70">Carga Neural y Estrés Sistémico</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant opacity-50">bolt</span>
            </div>
            <div className="flex items-end gap-4 mb-2">
              <span className={`font-data-point text-3xl ${cnsColor}`}>{cnsFatigue}%</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Fatiga Estimada</span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-primary-container" style={{ width: '40%' }} title="Zona Verde"></div>
              <div className="absolute top-0 left-[40%] h-full bg-secondary-container" style={{ width: '30%' }} title="Zona Amarilla"></div>
              <div className="absolute top-0 left-[70%] h-full bg-tertiary-fixed-dim" style={{ width: '30%' }} title="Zona Roja"></div>
              
              {/* Marker */}
              <div 
                className="absolute h-4 w-1 bg-on-surface rounded top-1/2 -translate-y-1/2 transition-all duration-700 shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10"
                style={{ left: `calc(${cnsFatigue}% - 2px)` }}
              ></div>
            </div>
            <p className="text-xs text-on-surface-variant mt-3">
              {cnsFatigue < 40 ? "Luz verde. Empuja volumen e intensidad hoy." : 
               cnsFatigue < 70 ? "Zona de precaución. Mantén RIR 2." : 
               "Fatiga alta. Prioriza recuperación o deload."}
            </p>
          </div>

          {/* AI Directive */}
          <div className="glass-card p-6 border-l-4 border-secondary-container bg-surface-container-high/40 flex flex-col justify-center">
             <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-secondary-container">psychology</span>
              <span className="font-label-caps text-label-caps text-secondary-container tracking-widest uppercase">Directiva Élite IA</span>
            </div>
            <p className="font-body-regular text-sm md:text-base text-on-surface">
              "Tus métricas recientes indican una excelente predisposición metabólica. El objetivo central de esta fase es la <strong className="text-primary">hipertrofia</strong>. Aprovecha el pico de energía matutino para tu sesión pesada y asegúrate de cerrar la ventana de alimentación con un superávit ligero de carbohidratos."
            </p>
          </div>
        </div>

        {/* Phase & Periodization */}
        <div className="col-span-12 md:col-span-6 glass-card p-6 border border-primary/20 hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Periodización Actual</span>
            <span className="material-symbols-outlined text-primary">calendar_month</span>
          </div>
          <h2 className="font-display-lg text-2xl text-primary mb-1">Bloque de Hipertrofia</h2>
          <p className="font-label-caps text-label-caps text-primary-container mb-6">Fase 1 · Semana 3 de 6</p>
          
          <div className="flex justify-between gap-1 mb-2">
            {[1,2,3,4,5,6].map(week => (
              <div 
                key={week} 
                className={`h-1.5 flex-1 rounded-sm ${week < 3 ? 'bg-primary' : week === 3 ? 'bg-primary shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'bg-surface-container-highest'}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-label-caps text-on-surface-variant opacity-60">
            <span>INICIO</span>
            <span>DELOAD (SEM 6)</span>
          </div>
        </div>

        {/* Metabolic Flexibility / VO2 Max Placeholder */}
        <div className="col-span-12 md:col-span-6 glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <span className="material-symbols-outlined text-9xl">monitor_heart</span>
          </div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Métricas Cardiovasculares</span>
            <span className="material-symbols-outlined text-secondary-container">ecg</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div>
              <p className="font-label-caps text-[10px] text-on-surface-variant opacity-70 mb-1">VO2 MAX (EST.)</p>
              <div className="flex items-baseline gap-1">
                <span className="font-data-point text-3xl text-on-surface">48.5</span>
                <span className="font-label-caps text-[10px] text-secondary-container">ÉLITE</span>
              </div>
            </div>
            <div>
              <p className="font-label-caps text-[10px] text-on-surface-variant opacity-70 mb-1">HRV (ÚLTIMA NOCHE)</p>
              <div className="flex items-baseline gap-1">
                <span className="font-data-point text-3xl text-on-surface">62</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant">ms</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-outline-variant relative z-10 flex justify-between items-center">
            <span className="font-label-caps text-[10px] text-on-surface-variant">FLEXIBILIDAD METABÓLICA</span>
            <span className="font-label-caps text-xs text-primary">ALTA</span>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
