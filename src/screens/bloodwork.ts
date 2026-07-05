// Ported from Stitch mockup (nav chrome stripped): fitcoach_12_integraci_n_de_anal_ticas_de_sangre
export const html = `<style>
        body {
            background-color: #0A0A0A;
            color: #E5E2E1;
            font-family: 'Inter', sans-serif;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .biomarker-range-track {
            background: #2C2C2C;
            height: 4px;
            border-radius: 2px;
            position: relative;
        }
        .biomarker-range-indicator {
            height: 8px;
            width: 2px;
            background: #00dbe9;
            position: absolute;
            top: -2px;
            box-shadow: 0 0 8px rgba(0, 219, 233, 0.8);
        }
        .glass-panel {
            background: rgba(18, 18, 18, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid #2C2C2C;
        }
        .glow-border-primary:hover {
            border-color: rgba(0, 219, 233, 0.4);
            box-shadow: 0 0 15px rgba(0, 219, 233, 0.1);
        }
    </style>

<!-- SideNavBar (Desktop Only) -->

<!-- TopAppBar -->

<!-- Main Content -->
<div class="md:ml-64 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto">
<!-- Dashboard Summary Overlay -->
<div class="grid grid-cols-1 lg:grid-cols-4 gap-gutter mb-12">
<section class="lg:col-span-3 space-y-12">
<!-- Category: Hormonal -->
<div>
<h3 class="font-label-caps text-primary-fixed-dim mb-6 flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-primary-fixed-dim"></span>
                        01. PERFIL HORMONAL
                    </h3>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<!-- Testosterona Card -->
<div class="glass-panel p-6 glow-border-primary transition-all">
<div class="flex justify-between items-start mb-4">
<span class="font-label-caps text-[10px] text-on-surface-variant">TESTOSTERONA LIBRE</span>
<span class="px-2 py-0.5 bg-secondary-fixed/10 text-secondary-fixed font-label-caps text-[9px] border border-secondary-fixed/20">OPTIMIZADO</span>
</div>
<div class="flex items-baseline gap-2 mb-1">
<span class="font-data-point text-data-point text-primary-fixed-dim">24.2</span>
<span class="font-label-caps text-[10px] text-on-surface-variant">pg/mL</span>
</div>
<div class="flex items-center gap-2 text-secondary-fixed mb-6">
<span class="material-symbols-outlined text-xs">trending_up</span>
<span class="font-label-caps text-[10px]">+8.4% vs Ago</span>
</div>
<div class="biomarker-range-track">
<div class="absolute left-[15%] right-[25%] h-full bg-primary-fixed-dim/20"></div>
<div class="biomarker-range-indicator" style="left: 72%;"></div>
</div>
<div class="flex justify-between mt-2 font-label-caps text-[8px] text-outline">
<span>8.0</span>
<span>RANGO: 15.0 - 28.0</span>
<span>35.0</span>
</div>
</div>
<!-- Estradiol Card -->
<div class="glass-panel p-6 glow-border-primary transition-all">
<div class="flex justify-between items-start mb-4">
<span class="font-label-caps text-[10px] text-on-surface-variant">ESTRADIOL</span>
<span class="px-2 py-0.5 bg-tertiary-container/10 text-on-tertiary-container font-label-caps text-[9px] border border-on-tertiary-container/20">ATENCIÓN</span>
</div>
<div class="flex items-baseline gap-2 mb-1">
<span class="font-data-point text-data-point text-on-tertiary-container">42.8</span>
<span class="font-label-caps text-[10px] text-on-surface-variant">pg/mL</span>
</div>
<div class="flex items-center gap-2 text-on-tertiary-container mb-6">
<span class="material-symbols-outlined text-xs">trending_up</span>
<span class="font-label-caps text-[10px]">+12.1% vs Ago</span>
</div>
<div class="biomarker-range-track">
<div class="absolute left-[20%] right-[40%] h-full bg-primary-fixed-dim/20"></div>
<div class="biomarker-range-indicator" style="left: 65%;"></div>
</div>
<div class="flex justify-between mt-2 font-label-caps text-[8px] text-outline">
<span>10.0</span>
<span>RANGO: 20.0 - 40.0</span>
<span>60.0</span>
</div>
</div>
<!-- SHBG Card -->
<div class="glass-panel p-6 glow-border-primary transition-all">
<div class="flex justify-between items-start mb-4">
<span class="font-label-caps text-[10px] text-on-surface-variant">SHBG</span>
<span class="px-2 py-0.5 bg-secondary-fixed/10 text-secondary-fixed font-label-caps text-[9px] border border-secondary-fixed/20">OPTIMIZADO</span>
</div>
<div class="flex items-baseline gap-2 mb-1">
<span class="font-data-point text-data-point text-primary-fixed-dim">32.1</span>
<span class="font-label-caps text-[10px] text-on-surface-variant">nmol/L</span>
</div>
<div class="flex items-center gap-2 text-on-surface-variant mb-6">
<span class="material-symbols-outlined text-xs">horizontal_rule</span>
<span class="font-label-caps text-[10px]">Sin cambios</span>
</div>
<div class="biomarker-range-track">
<div class="absolute left-[25%] right-[30%] h-full bg-primary-fixed-dim/20"></div>
<div class="biomarker-range-indicator" style="left: 45%;"></div>
</div>
<div class="flex justify-between mt-2 font-label-caps text-[8px] text-outline">
<span>10.0</span>
<span>RANGO: 18.0 - 54.0</span>
<span>70.0</span>
</div>
</div>
</div>
</div>
<!-- Category: Metabolic -->
<div>
<h3 class="font-label-caps text-primary-fixed-dim mb-6 flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-primary-fixed-dim"></span>
                        02. CONTROL METABÓLICO
                    </h3>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<!-- Glucosa Card -->
<div class="glass-panel p-6 glow-border-primary transition-all">
<div class="flex justify-between items-start mb-4">
<span class="font-label-caps text-[10px] text-on-surface-variant">GLUCOSA AYUNAS</span>
<span class="px-2 py-0.5 bg-secondary-fixed/10 text-secondary-fixed font-label-caps text-[9px] border border-secondary-fixed/20">OPTIMIZADO</span>
</div>
<div class="flex items-baseline gap-2 mb-1">
<span class="font-data-point text-data-point text-primary-fixed-dim">84</span>
<span class="font-label-caps text-[10px] text-on-surface-variant">mg/dL</span>
</div>
<div class="flex items-center gap-2 text-secondary-fixed mb-6">
<span class="material-symbols-outlined text-xs">trending_down</span>
<span class="font-label-caps text-[10px]">-4.2% vs Ago</span>
</div>
<div class="biomarker-range-track">
<div class="absolute left-[20%] right-[30%] h-full bg-primary-fixed-dim/20"></div>
<div class="biomarker-range-indicator" style="left: 40%;"></div>
</div>
<div class="flex justify-between mt-2 font-label-caps text-[8px] text-outline">
<span>60</span>
<span>RANGO: 70 - 100</span>
<span>120</span>
</div>
</div>
<!-- HbA1c Card -->
<div class="glass-panel p-6 glow-border-primary transition-all">
<div class="flex justify-between items-start mb-4">
<span class="font-label-caps text-[10px] text-on-surface-variant">HbA1c</span>
<span class="px-2 py-0.5 bg-secondary-fixed/10 text-secondary-fixed font-label-caps text-[9px] border border-secondary-fixed/20">OPTIMIZADO</span>
</div>
<div class="flex items-baseline gap-2 mb-1">
<span class="font-data-point text-data-point text-primary-fixed-dim">5.1</span>
<span class="font-label-caps text-[10px] text-on-surface-variant">%</span>
</div>
<div class="flex items-center gap-2 text-on-surface-variant mb-6">
<span class="material-symbols-outlined text-xs">horizontal_rule</span>
<span class="font-label-caps text-[10px]">Estable</span>
</div>
<div class="biomarker-range-track">
<div class="absolute left-[10%] right-[50%] h-full bg-primary-fixed-dim/20"></div>
<div class="biomarker-range-indicator" style="left: 30%;"></div>
</div>
<div class="flex justify-between mt-2 font-label-caps text-[8px] text-outline">
<span>4.0</span>
<span>RANGO: 4.5 - 5.6</span>
<span>7.0</span>
</div>
</div>
<!-- Insulina Card -->
<div class="glass-panel p-6 glow-border-primary transition-all">
<div class="flex justify-between items-start mb-4">
<span class="font-label-caps text-[10px] text-on-surface-variant">INSULINA</span>
<span class="px-2 py-0.5 bg-secondary-fixed/10 text-secondary-fixed font-label-caps text-[9px] border border-secondary-fixed/20">OPTIMIZADO</span>
</div>
<div class="flex items-baseline gap-2 mb-1">
<span class="font-data-point text-data-point text-primary-fixed-dim">4.8</span>
<span class="font-label-caps text-[10px] text-on-surface-variant">uIU/mL</span>
</div>
<div class="flex items-center gap-2 text-secondary-fixed mb-6">
<span class="material-symbols-outlined text-xs">trending_down</span>
<span class="font-label-caps text-[10px]">-15% vs Ago</span>
</div>
<div class="biomarker-range-track">
<div class="absolute left-[10%] right-[60%] h-full bg-primary-fixed-dim/20"></div>
<div class="biomarker-range-indicator" style="left: 22%;"></div>
</div>
<div class="flex justify-between mt-2 font-label-caps text-[8px] text-outline">
<span>2.0</span>
<span>RANGO: 3.0 - 15.0</span>
<span>25.0</span>
</div>
</div>
</div>
</div>
<!-- Category: Health & Inflammation -->
<div>
<h3 class="font-label-caps text-primary-fixed-dim mb-6 flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-primary-fixed-dim"></span>
                        03. SALUD SISTÉMICA E INFLAMACIÓN
                    </h3>
<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
<!-- Lipidic Profile -->
<div class="glass-panel p-6 glow-border-primary transition-all col-span-1">
<div class="flex justify-between items-center mb-6">
<span class="font-label-caps text-xs text-on-surface">PERFIL LIPÍDICO</span>
<span class="material-symbols-outlined text-outline text-sm">info</span>
</div>
<div class="space-y-4">
<div class="flex justify-between items-end border-b border-outline-variant pb-2">
<div>
<p class="font-label-caps text-[10px] text-on-surface-variant">LDL (BAD)</p>
<p class="font-data-point text-lg text-primary-fixed-dim">88 <span class="text-[10px] font-label-caps">mg/dL</span></p>
</div>
<div class="text-right">
<p class="font-label-caps text-[8px] text-outline">OBJETIVO: &lt; 100</p>
<p class="font-label-caps text-[10px] text-secondary-fixed">ÓPTIMO</p>
</div>
</div>
<div class="flex justify-between items-end border-b border-outline-variant pb-2">
<div>
<p class="font-label-caps text-[10px] text-on-surface-variant">HDL (GOOD)</p>
<p class="font-data-point text-lg text-primary-fixed-dim">62 <span class="text-[10px] font-label-caps">mg/dL</span></p>
</div>
<div class="text-right">
<p class="font-label-caps text-[8px] text-outline">OBJETIVO: &gt; 50</p>
<p class="font-label-caps text-[10px] text-secondary-fixed">ÓPTIMO</p>
</div>
</div>
</div>
</div>
<!-- Liver / Inflammation -->
<div class="glass-panel p-6 glow-border-primary transition-all col-span-1">
<div class="flex justify-between items-center mb-6">
<span class="font-label-caps text-xs text-on-surface">INFLAMACIÓN Y HÍGADO</span>
<span class="material-symbols-outlined text-outline text-sm">info</span>
</div>
<div class="space-y-4">
<div class="flex justify-between items-end border-b border-outline-variant pb-2">
<div>
<p class="font-label-caps text-[10px] text-on-surface-variant">PCR (ULTRASENSIBLE)</p>
<p class="font-data-point text-lg text-on-tertiary-container">2.1 <span class="text-[10px] font-label-caps">mg/L</span></p>
</div>
<div class="text-right">
<p class="font-label-caps text-[8px] text-outline">OBJETIVO: &lt; 1.0</p>
<p class="font-label-caps text-[10px] text-on-tertiary-container">ELEVADO</p>
</div>
</div>
<div class="flex justify-between items-end border-b border-outline-variant pb-2">
<div>
<p class="font-label-caps text-[10px] text-on-surface-variant">AST / ALT</p>
<p class="font-data-point text-lg text-primary-fixed-dim">28 / 31 <span class="text-[10px] font-label-caps">U/L</span></p>
</div>
<div class="text-right">
<p class="font-label-caps text-[8px] text-outline">NORMAL: &lt; 40</p>
<p class="font-label-caps text-[10px] text-secondary-fixed">SALUDABLE</p>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Sidebar: AI Correlation Panel -->

</div>
</div>
<!-- Navigation Shell Mobile -->
<nav class="md:hidden fixed bottom-0 left-0 w-full bg-surface-dim border-t border-outline-variant z-50 flex justify-around items-center h-16 px-4">
<a class="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-label-caps text-[8px]">DASHBOARD</span>
</a>
<a class="flex flex-col items-center gap-1 text-primary-fixed-dim" href="#">
<span class="material-symbols-outlined">monitoring</span>
<span class="font-label-caps text-[8px]">TRACKING</span>
</a>
<a class="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span class="material-symbols-outlined">psychology</span>
<span class="font-label-caps text-[8px]">AI COACH</span>
</a>
<a class="flex flex-col items-center gap-1 text-on-surface-variant" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="font-label-caps text-[8px]">CONFIG</span>
</a>
</nav>`;
