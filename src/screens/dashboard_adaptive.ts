// Ported verbatim from Stitch mockup: fitcoach_12_dashboard_con_nutrici_n_adaptativa
export const html = `<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            background-color: #131313;
            color: #e5e2e1;
            font-family: 'Inter', sans-serif;
        }
        .bento-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 16px;
        }
        .glass-card {
            background: #1c1b1b;
            border: 1px solid #3b494b;
            border-radius: 0.25rem;
            transition: border-color 0.2s ease;
        }
        .glass-card:hover {
            border-color: #00dbe9;
        }
        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }
        .scroll-hide::-webkit-scrollbar {
            display: none;
        }
    </style>

<!-- Top Navigation Anchor -->
<header class="w-full sticky top-0 z-50 bg-background border-b border-outline-variant">
<div class="flex justify-between items-center px-margin-desktop py-4 max-w-container-max mx-auto">
<h1 class="font-display-lg text-display-lg text-primary-container tracking-tighter">FitCoach 12%</h1>
<div class="hidden md:flex gap-8 items-center">
<span class="text-primary border-b-2 border-primary font-label-caps text-label-caps py-1 cursor-pointer">Dashboard</span>
<span class="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps py-1 cursor-pointer">Tracking</span>
<span class="text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps py-1 cursor-pointer">Training</span>
</div>
<div class="flex gap-4 items-center">
<span class="material-symbols-outlined text-primary cursor-pointer active:opacity-80">monitor_weight</span>
<span class="material-symbols-outlined text-primary cursor-pointer active:opacity-80">local_fire_department</span>
<span class="material-symbols-outlined text-primary cursor-pointer active:opacity-80">account_circle</span>
</div>
</div>
</header>
<!-- Side Navigation Anchor (Hidden on Mobile) -->
<aside class="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 pt-24 bg-surface-container-low border-r border-outline-variant z-40">
<div class="px-6 mb-8">
<h2 class="font-headline-md text-headline-md text-primary">Elite Performance</h2>
<p class="font-label-caps text-label-caps text-on-surface-variant">Phase: Hypertrophy</p>
</div>
<nav class="flex flex-col gap-1">
<div class="flex items-center gap-3 px-6 py-4 bg-primary-container text-on-primary-container font-bold border-l-4 border-primary cursor-pointer">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-label-caps text-label-caps">Dashboard</span>
</div>
<div class="flex items-center gap-3 px-6 py-4 text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 cursor-pointer active:scale-95">
<span class="material-symbols-outlined">analytics</span>
<span class="font-label-caps text-label-caps">Tracking</span>
</div>
<div class="flex items-center gap-3 px-6 py-4 text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 cursor-pointer active:scale-95">
<span class="material-symbols-outlined">restaurant</span>
<span class="font-label-caps text-label-caps">Nutrition</span>
</div>
<div class="flex items-center gap-3 px-6 py-4 text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 cursor-pointer active:scale-95">
<span class="material-symbols-outlined">fitness_center</span>
<span class="font-label-caps text-label-caps">Training</span>
</div>
<div class="flex items-center gap-3 px-6 py-4 text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200 cursor-pointer active:scale-95">
<span class="material-symbols-outlined">smart_toy</span>
<span class="font-label-caps text-label-caps">AI Coach</span>
</div>
</nav>
<div class="mt-auto p-6">
<button class="w-full py-3 bg-primary-container text-on-primary-container font-label-caps text-label-caps font-bold active:scale-95 transition-transform shadow-[0_0_15px_rgba(0,240,255,0.4)]">READY FOR HIGH INTENSITY</button>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="lg:pl-64 min-h-screen">
<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
<div class="mb-8">
<p class="font-label-caps text-label-caps text-primary-fixed-dim opacity-70 mb-1">COMMAND CENTER // SYSTEM_ONLINE</p>
<h1 class="font-headline-md text-headline-md">Principal Dashboard</h1>
</div>
<!-- Bento Grid Layout -->
<div class="bento-grid">
<!-- KPI Section: Weight -->
<div class="col-span-12 md:col-span-4 lg:col-span-3 glass-card p-6 flex flex-col justify-between">
<div>
<div class="flex justify-between items-start mb-4">
<span class="font-label-caps text-label-caps text-on-surface-variant">PESO ACTUAL</span>
<div class="status-dot bg-secondary-container"></div> <!-- Cyber Lime for Optimal -->
</div>
<div class="flex items-baseline gap-2">
<span class="font-data-point text-display-lg text-primary">68.0</span>
<span class="font-label-caps text-label-caps text-on-surface-variant">KG</span>
</div>
</div>
<div class="mt-6 pt-4 border-t border-outline-variant flex justify-between items-center">
<span class="font-label-caps text-label-caps opacity-60">PROMEDIO 7D</span>
<span class="font-data-point text-data-point">67.8kg</span>
</div>
</div>
<!-- KPI Section: Waist & Metrics -->
<div class="col-span-12 md:col-span-4 lg:col-span-3 glass-card p-6">
<div class="flex justify-between items-start mb-4">
<span class="font-label-caps text-label-caps text-on-surface-variant">CINTURA</span>
<div class="status-dot bg-secondary-container"></div>
</div>
<div class="flex items-baseline gap-2 mb-6">
<span class="font-data-point text-display-lg text-on-surface">82</span>
<span class="font-label-caps text-label-caps text-on-surface-variant">CM</span>
</div>
<div class="space-y-3">
<div class="flex justify-between items-center">
<span class="font-label-caps text-label-caps opacity-60">DELTA MENS.</span>
<span class="font-label-caps text-label-caps text-secondary-container">-0.5CM</span>
</div>
<div class="w-full bg-surface-container-highest h-1">
<div class="bg-secondary-container h-1 w-3/4"></div>
</div>
</div>
</div>
<!-- AI Coach Insights (Direct Block) -->
<div class="col-span-12 md:col-span-4 lg:col-span-6 glass-card p-6 border-l-4 border-primary bg-surface-container-high relative overflow-hidden">
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
<!-- Readiness Gauge -->
<div class="flex flex-col items-center justify-center border-r border-outline-variant pr-6">
<div class="relative w-32 h-32 flex items-center justify-center">
<svg class="w-full h-full transform -rotate-90">
<circle class="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" stroke-width="8"></circle>
<circle class="text-primary-container" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" stroke-dasharray="364.4" stroke-dashoffset="43.7" stroke-width="8"></circle>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="font-data-point text-3xl text-primary">88</span>
<span class="font-label-caps text-[10px] opacity-60">SCORE</span>
</div>
</div>
<p class="font-label-caps text-label-caps text-primary mt-2">RECUPERACIÓN ÓPTIMA</p>
</div>
<!-- Metrics & Insights -->
<div class="flex flex-col justify-between">
<div>
<div class="flex items-center gap-2 mb-3">
<span class="material-symbols-outlined text-primary-fixed-dim text-sm">bolt</span>
<span class="font-label-caps text-label-caps text-primary-fixed-dim">AI READINESS INSIGHTS</span>
</div>
<p class="font-headline-md text-headline-md leading-tight mb-4">
                    Recuperación del SNC óptima (88%). Volumen de entrenamiento sugerido: <span class="text-primary-container">+10%</span> sobre la carga basal.
                </p>
</div>
<div class="grid grid-cols-3 gap-2">
<div class="text-center">
<p class="font-label-caps text-[10px] opacity-60">HRV</p>
<p class="font-data-point text-sm">112ms</p>
</div>
<div class="text-center">
<p class="font-label-caps text-[10px] opacity-60">RHR</p>
<p class="font-data-point text-sm">48bpm</p>
</div>
<div class="text-center">
<p class="font-label-caps text-[10px] opacity-60">SUEÑO</p>
<p class="font-data-point text-sm">94%</p>
</div>
</div>
</div>
</div>
</div>
<!-- Training Summary -->
<div class="col-span-12 md:col-span-8 lg:col-span-7 glass-card overflow-hidden">
<div class="p-6 border-b border-outline-variant flex justify-between items-center">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary">fitness_center</span>
<span class="font-label-caps text-label-caps">ENTRENAMIENTO HOY: EMPUJE A</span>
</div>
<span class="font-label-caps text-label-caps text-secondary-container">ALTA INTENSIDAD</span>
</div>
<div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
<div>
<p class="font-label-caps text-label-caps text-on-surface-variant mb-1">MAIN LIFT</p>
<p class="font-data-point text-data-point">Press Militar</p>
<p class="text-on-surface-variant font-label-caps text-label-caps">3x8 @ 55kg</p>
</div>
<div>
<p class="font-label-caps text-label-caps text-on-surface-variant mb-1">VOLUMEN</p>
<p class="font-data-point text-data-point">12,450 kg</p>
<p class="text-on-surface-variant font-label-caps text-label-caps">+4% vs previo</p>
</div>
<div>
<p class="font-label-caps text-label-caps text-on-surface-variant mb-1">RPE OBJETIVO</p>
<p class="font-data-point text-data-point">9.0</p>
<p class="text-on-surface-variant font-label-caps text-label-caps">Falla técnica controlada</p>
</div>
</div>
<div class="bg-surface-container-lowest h-32 w-full relative">
<div class="w-full h-full bg-cover bg-center opacity-30 grayscale" data-alt="A cinematic, high-contrast photograph of a professional gym environment with dark equipment and dramatic spotlighting. A barbell sits on a rack, glowing under blue-tinted overhead lights, evoking an atmosphere of intense elite athletic training and scientific precision. The aesthetic is monochromatic and technical." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDhUIagtE3bB_eZoOgy8vBc7Majbfs4uIc-W8RgfxGH0uFUlSScSDycHW4r8JJpcVFmcdT3EwL_aaiQ75NmZ83PkRMJ3SFv47K1xR4UVoFcJ-4WBQ0GF9s3k6BtsjHe4qYmuwArUVCStOZ6lgpPcT_YqyhxXDbHGphGM3ooBVjm0OHcJf76acKEQy_V9QC661x-_vF0AdNcpMyIsFuE4mkLd-wD-6_1F3SoFw1lj0cO9ql6o7EHN0-r')"></div>
</div>
</div>
<!-- Meal Timing / Window -->
<div class="col-span-12 md:col-span-4 lg:col-span-5 glass-card p-6 flex flex-col justify-between"><div><div class="flex items-center justify-between mb-4"><span class="font-label-caps text-label-caps text-on-surface-variant">PRÓXIMA COMIDA</span><span class="font-label-caps text-label-caps text-tertiary-fixed-dim">COMIDA 2 DE 4</span></div><div class="flex items-center gap-4 mb-6"><span class="material-symbols-outlined text-display-lg text-primary">schedule</span><div><h3 class="font-headline-md text-headline-md">13:30</h3><p class="font-label-caps text-label-caps text-on-surface-variant">VENTANA: 7AM - 5PM</p></div></div><div class="p-3 bg-surface-container-highest border border-outline-variant rounded mb-6"><div class="flex items-center justify-between mb-2"><div class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary-container text-sm">bolt</span><span class="font-label-caps text-label-caps text-secondary-container">METABOLIC STRESS RESPONSE</span></div><span class="font-label-caps text-[10px] text-secondary-container">HIGH READINESS</span></div><p class="text-sm text-on-surface leading-tight">Increased carb allowance <span class="text-primary-container font-bold">(+50g)</span> for high-intensity window.</p></div></div><div class="space-y-4"><div class="flex justify-between text-label-caps font-label-caps text-on-surface-variant"><span class="">PROGRESO AYUNO</span><span class="">82%</span></div><div class="w-full bg-surface-container-highest h-2"><div class="bg-primary-container h-2 w-[82%]"></div></div></div></div>
<!-- Adherence Graphs (Macros & Steps) -->
<div class="col-span-12 lg:col-span-12 glass-card p-6">
<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
<div><h3 class="font-headline-md text-headline-md mb-1">Correlación de Rendimiento</h3><p class="font-label-caps text-label-caps text-on-surface-variant">ANÁLISIS DE ACTIVIDAD VS. NUTRICIÓN // ÚLTIMOS 7 DÍAS</p></div>
<div class="flex gap-4">
<div class="flex items-center gap-2">
<span class="status-dot bg-secondary-container"></span>
<span class="font-label-caps text-label-caps">PASOS</span>
</div>
<div class="flex items-center gap-2">
<span class="status-dot bg-primary"></span>
<span class="font-label-caps text-label-caps">MACROS</span>
</div>
</div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8"><div class="lg:col-span-8 space-y-6"><div class="flex justify-between items-center mb-2"><p class="font-label-caps text-label-caps text-on-surface-variant">PASOS (BARRAS) VS. ADHERENCIA MACROS (LÍNEA)</p><div class="flex gap-4"><div class="flex items-center gap-2"><span class="w-3 h-0.5 bg-primary"></span><span class="font-label-caps text-label-caps text-[10px]">MACROS %</span></div></div></div><div class="relative h-48 flex items-end gap-2"><div class="absolute inset-0 flex items-center justify-between px-2 pointer-events-none"><svg class="w-full h-full overflow-visible" preserveaspectratio="none" viewbox="0 0 100 100"><path d="M 0 40 L 16 35 L 33 45 L 50 10 L 66 30 L 83 50 L 100 5" fill="none" stroke="#dbfcff" stroke-dasharray="4 2" stroke-width="2" vector-effect="non-scaling-stroke"></path></svg></div><div class="flex-1 flex flex-col justify-end h-full gap-1"><div class="bg-primary-container w-full h-[60%] opacity-30"></div><span class="text-[10px] font-label-caps opacity-40 text-center">L</span></div><div class="flex-1 flex flex-col justify-end h-full gap-1"><div class="bg-primary-container w-full h-[85%] opacity-30"></div><span class="text-[10px] font-label-caps opacity-40 text-center">M</span></div><div class="flex-1 flex flex-col justify-end h-full gap-1"><div class="bg-primary-container w-full h-[70%] opacity-30"></div><span class="text-[10px] font-label-caps opacity-40 text-center">M</span></div><div class="flex-1 flex flex-col justify-end h-full gap-1"><div class="bg-primary-container w-full h-[95%] opacity-30"></div><span class="text-[10px] font-label-caps opacity-40 text-center">J</span></div><div class="flex-1 flex flex-col justify-end h-full gap-1"><div class="bg-primary-container w-full h-[80%] opacity-30"></div><span class="text-[10px] font-label-caps opacity-40 text-center">V</span></div><div class="flex-1 flex flex-col justify-end h-full gap-1"><div class="bg-primary-container w-full h-[65%] opacity-30"></div><span class="text-[10px] font-label-caps opacity-40 text-center">S</span></div><div class="flex-1 flex flex-col justify-end h-full gap-1"><div class="bg-secondary-container w-full h-[100%] shadow-[0_0_15px_rgba(195,244,0,0.3)]"></div><span class="text-[10px] font-label-caps text-secondary-container text-center">H</span></div></div></div><div class="lg:col-span-4 flex flex-col gap-4"><div class="p-4 bg-surface-container-highest border border-outline-variant rounded-lg"><div class="flex items-center gap-2 mb-3"><span class="material-symbols-outlined text-primary text-sm">insights</span><span class="font-label-caps text-label-caps text-primary">INSIGHT DE RENDIMIENTO</span></div><p class="text-sm text-on-surface leading-relaxed">Alta actividad detectada el <span class="text-secondary-container">Jueves</span> compensó una desviación calórica del +12%. El balance metabólico se mantiene en rango óptimo.</p></div><div class="p-4 border border-outline-variant rounded-lg flex justify-between items-center"><div class="space-y-1"><p class="font-label-caps text-label-caps text-on-surface-variant">CORRELACIÓN 7D</p><p class="font-data-point text-xl text-primary">0.88</p></div><div class="text-right"><p class="font-label-caps text-label-caps text-secondary-container">FUERTE</p><p class="text-[10px] font-label-caps opacity-40">P-VALUE: 0.02</p></div></div></div></div>
</div>
</div>
</div>
</main>
<!-- FAB for quick action -->
<button class="fixed bottom-8 right-8 w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-50">
<span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">add</span>
</button>`;
