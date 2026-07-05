// Ported from Stitch mockup (nav chrome stripped): fitcoach_12_sincronizaci_n_bio_data_wearables
export const html = `<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .data-gradient {
            background: linear-gradient(180deg, rgba(0, 240, 255, 0.1) 0%, rgba(0, 240, 255, 0) 100%);
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #131313; }
        ::-webkit-scrollbar-thumb { background: #3b494b; }
        .glass-card {
            background: rgba(28, 27, 27, 0.8);
            backdrop-filter: blur(8px);
        }
        @keyframes pulse-cyan {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .pulse-dot {
            animation: pulse-cyan 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
    </style>

<!-- Sidebar Navigation (Desktop) -->

<!-- Main Content Area -->
<div class="md:ml-64 min-h-screen">
<!-- Top App Bar -->

<!-- Dashboard Content -->
<div class="p-margin-mobile md:p-margin-desktop space-y-gutter">
<!-- Header Section -->
<div class="mb-8">
<h2 class="font-headline-md text-headline-md text-secondary">Sincronización de Dispositivos</h2>
<p class="text-on-surface-variant max-w-2xl mt-1">Monitoreo biométrico de alta precisión y optimización metabólica en tiempo real para el rendimiento de élite.</p>
</div>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
<!-- AI Readiness Score (Left Column - Large) -->
<section class="lg:col-span-4 flex flex-col gap-gutter">
<div class="bg-surface-container border border-outline-variant p-6 h-full relative overflow-hidden">
<div class="absolute top-0 right-0 p-4 opacity-10">
<span class="material-symbols-outlined text-8xl" style="font-variation-settings: 'FILL' 1;">bolt</span>
</div>
<h3 class="font-label-caps text-label-caps text-outline mb-6">AI READINESS SCORE</h3>
<div class="flex flex-col items-center justify-center py-8">
<div class="relative w-48 h-48 flex items-center justify-center">
<svg class="w-full h-full transform -rotate-90">
<circle class="text-surface-container-highest" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" stroke-width="4"></circle>
<circle class="text-primary-container" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" stroke-dasharray="552.92" stroke-dashoffset="66.35" stroke-width="4"></circle>
</svg>
<div class="absolute flex flex-col items-center">
<span class="font-display-lg text-secondary">88</span>
<span class="font-label-caps text-label-caps text-outline">/ 100</span>
</div>
</div>
</div>
<div class="mt-6 p-4 bg-surface-container-low border-l-2 border-primary-container">
<div class="flex items-center gap-2 mb-2">
<span class="material-symbols-outlined text-primary-container text-sm">smart_toy</span>
<span class="font-label-caps text-[10px] text-primary-container">AI ANALYSIS</span>
</div>
<p class="text-sm font-medium leading-relaxed italic">"Recuperación del SNC óptima. Volumen de entrenamiento sugerido: +10% sobre la carga basal actual."</p>
</div>
</div>
</section>
<!-- Active Devices Hub & Biometric Stream (Right Column) -->
<section class="lg:col-span-8 flex flex-col gap-gutter">
<!-- Active Devices -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
<!-- Oura Card -->
<div class="bg-surface-container border border-outline-variant p-5 flex flex-col gap-4">
<div class="flex justify-between items-start">
<div>
<h4 class="font-headline-md text-lg text-secondary">Oura Ring Gen3</h4>
<div class="flex items-center gap-2 mt-1">
<div class="w-2 h-2 rounded-full bg-[#abd600] pulse-dot"></div>
<span class="font-label-caps text-[10px] text-secondary-fixed-dim">ESTADO: CONECTADO</span>
</div>
</div>
<span class="material-symbols-outlined text-outline">fingerprint</span>
</div>
<div class="grid grid-cols-2 gap-4 mt-2">
<div class="bg-surface-container-low p-3">
<span class="font-label-caps text-[10px] text-outline block mb-1">BATERÍA</span>
<div class="flex items-end gap-2">
<span class="font-data-point text-data-point text-secondary">72%</span>
<div class="h-1 flex-1 bg-surface-container-highest mb-2 rounded-full overflow-hidden">
<div class="h-full bg-secondary-fixed w-[72%]"></div>
</div>
</div>
</div>
<div class="bg-surface-container-low p-3">
<span class="font-label-caps text-[10px] text-outline block mb-1">ÚLT. SYNC</span>
<span class="font-data-point text-data-point text-secondary">04:12</span>
</div>
</div>
</div>
<!-- Whoop Card -->
<div class="bg-surface-container border border-outline-variant p-5 flex flex-col gap-4">
<div class="flex justify-between items-start">
<div>
<h4 class="font-headline-md text-lg text-secondary">Whoop 4.0</h4>
<div class="flex items-center gap-2 mt-1">
<div class="w-2 h-2 rounded-full bg-[#abd600] pulse-dot"></div>
<span class="font-label-caps text-[10px] text-secondary-fixed-dim">ESTADO: CONECTADO</span>
</div>
</div>
<span class="material-symbols-outlined text-outline">watch</span>
</div>
<div class="grid grid-cols-2 gap-4 mt-2">
<div class="bg-surface-container-low p-3">
<span class="font-label-caps text-[10px] text-outline block mb-1">BATERÍA</span>
<div class="flex items-end gap-2">
<span class="font-data-point text-data-point text-secondary">45%</span>
<div class="h-1 flex-1 bg-surface-container-highest mb-2 rounded-full overflow-hidden">
<div class="h-full bg-primary-container w-[45%]"></div>
</div>
</div>
</div>
<div class="bg-surface-container-low p-3">
<span class="font-label-caps text-[10px] text-outline block mb-1">ÚLT. SYNC</span>
<span class="font-data-point text-data-point text-secondary">LIVE</span>
</div>
</div>
</div>
</div>
<!-- Live Biometric Stream -->
<div class="bg-surface-container border border-outline-variant p-6">
<div class="flex justify-between items-center mb-6">
<h3 class="font-label-caps text-label-caps text-outline">LIVE BIOMETRIC STREAM</h3>
<div class="px-2 py-1 bg-error-container text-on-error-container text-[10px] font-label-caps rounded flex items-center gap-1">
<span class="material-symbols-outlined text-[12px]" style="font-variation-settings: 'FILL' 1;">sensors</span>
                                LIVE FEED
                            </div>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<!-- HRV -->
<div class="space-y-3">
<div class="flex justify-between items-end">
<div>
<span class="font-label-caps text-[10px] text-outline">HRV</span>
<p class="font-data-point text-2xl text-primary-container">112<span class="text-sm ml-1 text-on-surface-variant font-normal">ms</span></p>
</div>
<span class="text-[#abd600] font-label-caps text-[10px] flex items-center">+8%</span>
</div>
<div class="h-16 w-full bg-surface-container-low relative overflow-hidden flex items-end">
<!-- Simplified Sparkline -->
<svg class="w-full h-12" preserveaspectratio="none" viewbox="0 0 100 40">
<path d="M0,35 Q10,20 20,30 T40,15 T60,25 T80,10 T100,20" fill="none" stroke="#00f0ff" stroke-width="2" vector-effect="non-scaling-stroke"></path>
<path d="M0,35 Q10,20 20,30 T40,15 T60,25 T80,10 T100,20 L100,40 L0,40 Z" fill="url(#grad1)"></path>
<defs>
<lineargradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" style="stop-color:rgba(0,240,255,0.2);stop-opacity:1"></stop>
<stop offset="100%" style="stop-color:rgba(0,240,255,0);stop-opacity:1"></stop>
</lineargradient>
</defs>
</svg>
</div>
</div>
<!-- RHR -->
<div class="space-y-3">
<div class="flex justify-between items-end">
<div>
<span class="font-label-caps text-[10px] text-outline">RHR</span>
<p class="font-data-point text-2xl text-secondary">48<span class="text-sm ml-1 text-on-surface-variant font-normal">bpm</span></p>
</div>
<span class="text-[#abd600] font-label-caps text-[10px] flex items-center">-2%</span>
</div>
<div class="h-16 w-full bg-surface-container-low relative overflow-hidden flex items-end">
<svg class="w-full h-12" preserveaspectratio="none" viewbox="0 0 100 40">
<path d="M0,20 Q15,35 30,25 T60,30 T90,15 T100,20" fill="none" stroke="#e5e2e1" stroke-width="2" vector-effect="non-scaling-stroke"></path>
</svg>
</div>
</div>
<!-- Respiratory Rate -->
<div class="space-y-3">
<div class="flex justify-between items-end">
<div>
<span class="font-label-caps text-[10px] text-outline">RESP. RATE</span>
<p class="font-data-point text-2xl text-secondary">14.2<span class="text-sm ml-1 text-on-surface-variant font-normal">rpm</span></p>
</div>
<span class="text-outline font-label-caps text-[10px] flex items-center">STABLE</span>
</div>
<div class="h-16 w-full bg-surface-container-low relative overflow-hidden flex items-end">
<svg class="w-full h-12" preserveaspectratio="none" viewbox="0 0 100 40">
<path d="M0,20 L20,20 L25,5 L35,35 L40,20 L60,20 L65,10 L75,30 L80,20 L100,20" fill="none" stroke="#00f0ff" stroke-width="1.5" vector-effect="non-scaling-stroke"></path>
</svg>
</div>
</div>
</div>
</div>
</section>
</div>
<!-- Sleep Architecture & Sync Config -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
<!-- Sleep Architecture (Bento Style) -->
<section class="lg:col-span-7 bg-surface-container border border-outline-variant p-6">
<div class="flex justify-between items-center mb-6">
<h3 class="font-label-caps text-label-caps text-outline">SLEEP ARCHITECTURE</h3>
<div class="text-right">
<span class="font-label-caps text-[10px] text-outline block">SLEEP QUALITY</span>
<span class="font-data-point text-lg text-[#abd600]">ELITE (94%)</span>
</div>
</div>
<div class="space-y-6">
<div class="h-12 w-full flex rounded-sm overflow-hidden">
<div class="h-full bg-primary-container/20 border-r border-background w-[15%] flex items-center justify-center" title="Awake"></div>
<div class="h-full bg-primary-container/40 border-r border-background w-[50%] flex items-center justify-center" title="Light"></div>
<div class="h-full bg-primary-container/80 border-r border-background w-[20%] flex items-center justify-center" title="REM"></div>
<div class="h-full bg-primary-container border-background w-[15%] flex items-center justify-center" title="Deep"></div>
</div>
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
<div class="bg-surface-container-low p-4 border border-outline-variant/30">
<span class="font-label-caps text-[10px] text-outline block mb-1">DEEP</span>
<span class="font-data-point text-xl text-secondary">1h 42m</span>
<p class="text-[10px] text-[#abd600] mt-1">+12m vs Avg</p>
</div>
<div class="bg-surface-container-low p-4 border border-outline-variant/30">
<span class="font-label-caps text-[10px] text-outline block mb-1">REM</span>
<span class="font-data-point text-xl text-secondary">2h 15m</span>
<p class="text-[10px] text-outline mt-1">Normal Range</p>
</div>
<div class="bg-surface-container-low p-4 border border-outline-variant/30">
<span class="font-label-caps text-[10px] text-outline block mb-1">LIGHT</span>
<span class="font-data-point text-xl text-secondary">4h 05m</span>
<p class="text-[10px] text-outline mt-1">-5% vs Avg</p>
</div>
<div class="bg-surface-container-low p-4 border border-outline-variant/30">
<span class="font-label-caps text-[10px] text-outline block mb-1">LATENCY</span>
<span class="font-data-point text-xl text-secondary">8m</span>
<p class="text-[10px] text-[#abd600] mt-1">Optimal</p>
</div>
</div>
</div>
</section>
<!-- Sync Configuration -->
<section class="lg:col-span-5 bg-surface-container border border-outline-variant p-6">
<h3 class="font-label-caps text-label-caps text-outline mb-6">SYNC CONFIGURATION</h3>
<div class="space-y-4">
<div class="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant/30">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary">bedtime</span>
<div>
<p class="font-label-caps text-xs">SLEEP STAGES</p>
<p class="text-[10px] text-outline">Oura + Whoop Merge</p>
</div>
</div>
<div class="w-10 h-5 bg-primary-container rounded-full relative cursor-pointer">
<div class="absolute right-1 top-1 w-3 h-3 bg-on-primary-container rounded-full"></div>
</div>
</div>
<div class="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant/30">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary">fitness_center</span>
<div>
<p class="font-label-caps text-xs">ACTIVITY & STRAIN</p>
<p class="text-[10px] text-outline">Real-time calorie burn</p>
</div>
</div>
<div class="w-10 h-5 bg-primary-container rounded-full relative cursor-pointer">
<div class="absolute right-1 top-1 w-3 h-3 bg-on-primary-container rounded-full"></div>
</div>
</div>
<div class="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant/30 opacity-50">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-outline">psychology</span>
<div>
<p class="font-label-caps text-xs">STRESS & FOCUS</p>
<p class="text-[10px] text-outline">Beta integration</p>
</div>
</div>
<div class="w-10 h-5 bg-surface-container-highest rounded-full relative cursor-pointer">
<div class="absolute left-1 top-1 w-3 h-3 bg-outline rounded-full"></div>
</div>
</div>
<div class="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant/30">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary">favorite</span>
<div>
<p class="font-label-caps text-xs">RECOVERY METRICS</p>
<p class="text-[10px] text-outline">High-fidelity HRV raw data</p>
</div>
</div>
<div class="w-10 h-5 bg-primary-container rounded-full relative cursor-pointer">
<div class="absolute right-1 top-1 w-3 h-3 bg-on-primary-container rounded-full"></div>
</div>
</div>
</div>
<button class="w-full mt-6 py-2 border border-primary text-primary font-label-caps text-xs hover:bg-primary/10 transition-colors">
                        ADVANCED DATA MAPPING
                    </button>
</section>
</div>
</div>
</div>
<!-- Bottom Nav (Mobile) -->
<nav class="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-low flex justify-around items-center h-16 z-50 px-4">
<a class="flex flex-col items-center gap-1 text-primary" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="text-[10px] font-label-caps">HOME</span>
</a>
<a class="flex flex-col items-center gap-1 text-outline" href="#">
<span class="material-symbols-outlined">monitoring</span>
<span class="text-[10px] font-label-caps">SYNC</span>
</a>
<a class="flex flex-col items-center gap-1 text-outline" href="#">
<span class="material-symbols-outlined">smart_toy</span>
<span class="text-[10px] font-label-caps">AI</span>
</a>
<a class="flex flex-col items-center gap-1 text-outline" href="#">
<span class="material-symbols-outlined">person</span>
<span class="text-[10px] font-label-caps">PERF</span>
</a>
</nav>`;
