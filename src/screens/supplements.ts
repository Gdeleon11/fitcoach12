// Ported from Stitch mockup (nav chrome stripped): fitcoach_12_suplementaci_n_ia_estrat_gica
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
        .data-card {
            background-color: #1c1b1b;
            border: 1px solid #3b494b;
            padding: 24px;
            transition: all 0.2s ease;
        }
        .data-card:hover {
            border-color: #00f0ff;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #131313;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #3b494b;
        }
        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }
    </style>

<!-- SideNavBar (Authority Source: JSON) -->

<!-- Main Content Canvas -->
<div class="ml-64 min-h-screen">
<!-- TopAppBar (Authority Source: JSON) -->

<div class="p-margin-desktop max-w-container-max mx-auto">
<!-- Header Section -->
<div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
<div>
<h2 class="font-headline-md text-headline-md text-on-surface">Suplementación Inteligente</h2>
<p class="font-body-regular text-body-regular text-on-surface-variant">Protocolo de optimización biológica basado en analíticas en tiempo real.</p>
</div>
<div class="flex gap-4">
<div class="flex items-center gap-2 bg-surface-container px-4 py-2 border border-outline-variant rounded-lg">
<span class="status-dot bg-secondary-fixed"></span>
<span class="font-label-caps text-label-caps text-on-surface">ADHERENCIA: 94%</span>
</div>
</div>
</div>
<!-- Bento Grid Layout -->
<div class="bento-grid">
<!-- IA Prescription Engine (Priority Prominent Section) -->
<section class="col-span-12 lg:col-span-8 data-card relative overflow-hidden flex flex-col">

<div class="relative z-10">
<div class="flex items-center gap-2 mb-6">
<span class="material-symbols-outlined text-primary-container">smart_toy</span>
<h3 class="font-label-caps text-label-caps text-primary-container tracking-widest">IA PRESCRIPTION ENGINE</h3>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="space-y-4">
<div class="p-4 bg-surface-container-lowest border-l-4 border-primary-container">
<div class="flex justify-between items-start mb-2">
<span class="font-label-caps text-label-caps text-primary">CREATINA MONOHIDRATO</span>
<span class="font-data-point text-[14px] text-primary-container">5g / DÍA</span>
</div>
<p class="font-body-regular text-[14px] text-on-surface-variant">Mantener protocolo por fase de hipertrofia. Saturación muscular al 98%.</p>
</div>
<div class="p-4 bg-surface-container-lowest border-l-4 border-secondary-fixed">
<div class="flex justify-between items-start mb-2">
<span class="font-label-caps text-label-caps text-secondary-fixed">CITRATO DE MAGNESIO</span>
<span class="font-data-point text-[14px] text-secondary-fixed">+200mg</span>
</div>
<p class="font-body-regular text-[14px] text-on-surface-variant">Ajuste sugerido por alta fatiga reportada y HRV en descenso ligero.</p>
</div>
</div>
<div class="space-y-4">
<div class="p-4 bg-surface-container-lowest border-l-4 border-on-tertiary-container">
<div class="flex justify-between items-start mb-2">
<span class="font-label-caps text-label-caps text-on-tertiary-container">CAFEÍNA ANHIDRA</span>
<span class="font-data-point text-[14px] text-on-tertiary-container">-100mg</span>
</div>
<p class="font-body-regular text-[14px] text-on-surface-variant">Reducción necesaria por pico de cortisol nocturno detectado ayer.</p>
</div>
<div class="p-4 bg-surface-container-lowest border-l-4 border-outline">
<div class="flex justify-between items-start mb-2">
<span class="font-label-caps text-label-caps text-outline">VITAMINA D3 + K2</span>
<span class="font-data-point text-[14px] text-on-surface">5000 UI</span>
</div>
<p class="font-body-regular text-[14px] text-on-surface-variant">Protocolo basal estable. Siguiente analítica en 14 días.</p>
</div>
</div>
</div>
<!-- IA Logic Block -->
<div class="mt-8 p-6 bg-surface-container border border-primary-container/20 rounded-lg">
<p class="font-label-caps text-[10px] text-primary-container mb-2">AI LOGIC DECODER</p>
<p class="font-body-regular italic text-on-surface">"Ajuste detectado: La correlación entre la carga de entrenamiento actual (RPE 9 avg) y la latencia del sueño sugiere un estado de excitación simpática prolongada. Se recomienda la reducción de estimulantes y el incremento de electrolitos quelatados."</p>
</div>
</div>
</section>
<!-- Análisis de Eficacia KPIs -->
<section class="col-span-12 lg:col-span-4 data-card flex flex-col justify-between">
<div>
<div class="flex items-center gap-2 mb-6">
<span class="material-symbols-outlined text-secondary-fixed">monitoring</span>
<h3 class="font-label-caps text-label-caps text-secondary-fixed tracking-widest">ANÁLISIS DE EFICACIA</h3>
</div>
<div class="space-y-6">
<div>
<div class="flex justify-between mb-2">
<span class="font-label-caps text-label-caps text-on-surface-variant">RECUPERACIÓN</span>
<span class="font-data-point text-data-point text-secondary-fixed">+12%</span>
</div>
<div class="h-1 bg-surface-container-highest w-full rounded-full">
<div class="h-full bg-secondary-fixed w-[88%] rounded-full"></div>
</div>
</div>
<div>
<div class="flex justify-between mb-2">
<span class="font-label-caps text-label-caps text-on-surface-variant">FUERZA (1RM)</span>
<span class="font-data-point text-data-point text-primary-container">+4.2%</span>
</div>
<div class="h-1 bg-surface-container-highest w-full rounded-full">
<div class="h-full bg-primary-container w-[72%] rounded-full"></div>
</div>
</div>
<div>
<div class="flex justify-between mb-2">
<span class="font-label-caps text-label-caps text-on-surface-variant">CALIDAD SUEÑO</span>
<span class="font-data-point text-data-point text-on-surface">STABLE</span>
</div>
<div class="h-1 bg-surface-container-highest w-full rounded-full">
<div class="h-full bg-on-surface w-[94%] rounded-full opacity-30"></div>
</div>
</div>
</div>
</div>
<div class="mt-8">
<div class="h-32 w-full bg-cover bg-center opacity-50 border border-outline-variant" data-alt="A high-tech digital data visualization chart showing sleek neon lines trending upwards on a dark professional dashboard. The background is a deep monochromatic black with subtle glowing blue and green accents representing performance metrics and health data in a minimalist fitness lab aesthetic." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAzKSeX3YJanlYvwj4kNMwQemZIFAPqtJMeri_X0NADYW4DM4uSdqMgNhlwBVAX2dZGTfwAo_KvjzPZqShr9VYRlJwmp1yNKQrQ1rRZ-W4mCzq37NT9nbeRa3eRvLeOCuP2_y6Dqd_I9Iludp8uVG9iMXazTVAAu7XE1tRBbNFYr4YTTm621S8IajjG9_irr77HWKbIUAHpKUMHtDNibPhLbu3x7PO-asJUVTwGvkUZ7CDo_5Lu_S_m')"></div>
</div>
</section>
<!-- Stack Actual List -->
<section class="col-span-12 lg:col-span-9 data-card">
<div class="flex items-center justify-between mb-6">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-on-surface">inventory_2</span>
<h3 class="font-label-caps text-label-caps text-on-surface tracking-widest">STACK ACTUAL</h3>
</div>
<div class="font-label-caps text-[10px] text-on-surface-variant uppercase">Updated: 04:00 AM</div>
</div>
<div class="overflow-x-auto custom-scrollbar">
<table class="w-full text-left">
<thead>
<tr class="border-b border-outline-variant">
<th class="py-4 font-label-caps text-label-caps text-on-surface-variant">SUPLEMENTO</th>
<th class="py-4 font-label-caps text-label-caps text-on-surface-variant">DOSIS</th>
<th class="py-4 font-label-caps text-label-caps text-on-surface-variant">TIMING</th>
<th class="py-4 font-label-caps text-label-caps text-on-surface-variant">ADHERENCIA</th>
<th class="py-4 font-label-caps text-label-caps text-on-surface-variant text-right">ESTADO</th>
</tr>
</thead>
<tbody class="divide-y divide-outline-variant/30">
<tr class="group hover:bg-surface-container-high transition-colors">
<td class="py-4">
<div class="font-label-caps text-on-surface">Omega 3 (Ultra High EPA)</div>
<div class="text-[10px] text-on-surface-variant font-body-regular">Anti-inflamatorio sistémico</div>
</td>
<td class="py-4 font-data-point text-[14px]">2 CAPS</td>
<td class="py-4 font-label-caps text-[11px]">CON DESAYUNO</td>
<td class="py-4">
<div class="flex gap-1">
<div class="w-4 h-1 bg-secondary-fixed"></div>
<div class="w-4 h-1 bg-secondary-fixed"></div>
<div class="w-4 h-1 bg-secondary-fixed"></div>
<div class="w-4 h-1 bg-secondary-fixed"></div>
<div class="w-4 h-1 bg-surface-variant"></div>
</div>
</td>
<td class="py-4 text-right">
<span class="px-2 py-1 bg-secondary-fixed/10 text-secondary-fixed font-label-caps text-[10px] border border-secondary-fixed/30 rounded">COMPLETADO</span>
</td>
</tr>
<tr class="group hover:bg-surface-container-high transition-colors">
<td class="py-4">
<div class="font-label-caps text-on-surface">Proteína Isolatada</div>
<div class="text-[10px] text-on-surface-variant font-body-regular">Biodisponibilidad 99%</div>
</td>
<td class="py-4 font-data-point text-[14px]">35g</td>
<td class="py-4 font-label-caps text-[11px]">POST-ENTRENO</td>
<td class="py-4">
<div class="flex gap-1">
<div class="w-4 h-1 bg-secondary-fixed"></div>
<div class="w-4 h-1 bg-secondary-fixed"></div>
<div class="w-4 h-1 bg-secondary-fixed"></div>
<div class="w-4 h-1 bg-secondary-fixed"></div>
<div class="w-4 h-1 bg-secondary-fixed"></div>
</div>
</td>
<td class="py-4 text-right">
<span class="px-2 py-1 bg-primary-container/10 text-primary-container font-label-caps text-[10px] border border-primary-container/30 rounded">PENDIENTE</span>
</td>
</tr>
<tr class="group hover:bg-surface-container-high transition-colors">
<td class="py-4">
<div class="font-label-caps text-on-surface">Citrulina Malato</div>
<div class="text-[10px] text-on-surface-variant font-body-regular">Vasodilatador / NO2</div>
</td>
<td class="py-4 font-data-point text-[14px]">8g</td>
<td class="py-4 font-label-caps text-[11px]">30min PRE-ENTRENO</td>
<td class="py-4">
<div class="flex gap-1">
<div class="w-4 h-1 bg-secondary-fixed"></div>
<div class="w-4 h-1 bg-surface-variant"></div>
<div class="w-4 h-1 bg-surface-variant"></div>
<div class="w-4 h-1 bg-surface-variant"></div>
<div class="w-4 h-1 bg-surface-variant"></div>
</div>
</td>
<td class="py-4 text-right">
<span class="px-2 py-1 bg-on-tertiary-container/10 text-on-tertiary-container font-label-caps text-[10px] border border-on-tertiary-container/30 rounded">ALERTA</span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
<!-- Próximo Pedido / Inventory -->
<section class="col-span-12 lg:col-span-3 data-card flex flex-col">
<div class="flex items-center gap-2 mb-6">
<span class="material-symbols-outlined text-primary-container">shopping_cart</span>
<h3 class="font-label-caps text-label-caps text-primary-container tracking-widest">INVENTARIO</h3>
</div>
<div class="flex-1 space-y-6">
<div class="flex justify-between items-center">
<div>
<p class="font-label-caps text-[11px] text-on-surface">Creatina (Pure)</p>
<p class="text-[10px] text-on-tertiary-container font-bold">5 DÍAS RESTANTES</p>
</div>
<div class="h-10 w-10 border border-outline-variant flex items-center justify-center">
<span class="material-symbols-outlined text-[18px]">priority_high</span>
</div>
</div>
<div class="flex justify-between items-center">
<div>
<p class="font-label-caps text-[11px] text-on-surface">Whey Isolate</p>
<p class="text-[10px] text-on-surface-variant font-label-caps">12 DÍAS RESTANTES</p>
</div>
<div class="h-10 w-10 border border-outline-variant flex items-center justify-center">
<span class="material-symbols-outlined text-[18px]">check</span>
</div>
</div>
</div>
<button class="mt-8 w-full py-3 bg-white text-black font-label-caps text-label-caps hover:bg-primary-container hover:text-on-primary-container transition-all">
                        GESTIONAR PEDIDO
                    </button>
<div class="mt-4 text-center">
<p class="text-[10px] font-label-caps text-on-surface-variant">Siguiente auto-envío: Oct 12</p>
</div>
</section>
</div>
<!-- Global Activity Visualizer -->
<div class="mt-8 data-card overflow-hidden h-48 relative border-primary-container/10">
<div class="absolute top-4 left-6 z-10">
<h4 class="font-label-caps text-[10px] text-on-surface-variant mb-1">CORRELACIÓN DE RENDIMIENTO VS SUPLEMENTACIÓN</h4>
<p class="font-data-point text-headline-md text-primary-container">98.2<span class="text-[14px] ml-1">SCORE</span></p>
</div>

</div>
</div>
</div>`;
