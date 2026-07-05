// Ported from Stitch mockup (nav chrome stripped): fitcoach_12_log_de_entrenamiento_con_ajuste_de_volumen_ia
export const html = `<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
        }
        /* Custom scrollbar for technical look */
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #131313; }
        ::-webkit-scrollbar-thumb { background: #3b494b; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #00dbe9; }

        .glass-panel {
            background: rgba(18, 18, 18, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid #3b494b;
        }
        
        .input-glow:focus {
            outline: none;
            border-color: #00f0ff;
            box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
        }
    </style>

<!-- Top Navigation Anchor -->

<div class="max-w-container-max mx-auto px-gutter md:px-margin-desktop py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
<!-- Main Workout Content -->
<section class="lg:col-span-8 space-y-8"><div class="bg-primary-container/10 border border-primary-container p-4 rounded-lg flex items-center justify-between mb-8">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary-container">psychology</span>
<div>
<span class="font-label-caps text-[10px] text-primary-container block uppercase">AI Readiness Score</span>
<span class="font-headline-md text-[18px] text-primary-container">88% - SNC Optimal</span>
</div>
</div>
<div class="text-right">
<span class="font-label-caps text-[10px] text-on-surface-variant block uppercase">Ajuste Sugerido</span>
<span class="font-data-point text-[14px] text-secondary-fixed">+10% Volumen</span>
</div>
</div>
<!-- Header Section -->
<div class="bg-surface-container-low p-6 border border-outline-variant rounded-lg">
<div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
<div>
<span class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2 block">Sesión Actual</span>
<h1 class="font-headline-md text-headline-md text-primary tracking-tight">Empuje A - Hipertrofia</h1>
</div>
<div class="flex gap-3">
<div class="flex items-center gap-2 bg-surface-container px-3 py-1.5 border border-outline-variant">
<span class="w-2 h-2 rounded-full bg-error"></span>
<span class="font-label-caps text-label-caps text-on-surface">ALTA INTENSIDAD</span>
</div>
<div class="flex items-center gap-2 bg-surface-container px-3 py-1.5 border border-outline-variant">
<span class="w-2 h-2 rounded-full bg-secondary-container"></span>
<span class="font-label-caps text-label-caps text-on-surface">OBJETIVO: 13,200KG</span>
</div>
</div>
</div>
<div class="flex items-center gap-6 border-t border-outline-variant pt-4">
<div class="flex flex-col">
<span class="font-label-caps text-label-caps text-on-surface-variant">DURACIÓN</span>
<span class="font-data-point text-data-point text-primary" id="session-timer">00:42:15</span>
</div>
<div class="flex flex-col">
<span class="font-label-caps text-label-caps text-on-surface-variant">EXC. COMPLETOS</span>
<span class="font-data-point text-data-point text-primary">02 / 06</span>
</div>
</div>
</div>
<!-- Exercise List -->
<div class="space-y-6">
<!-- Exercise 1 -->
<article class="bg-surface-container border border-outline-variant rounded-lg overflow-hidden">
<div class="p-4 bg-surface-container-high border-b border-outline-variant flex justify-between items-center">
<div class="flex items-center gap-3">
<span class="w-8 h-8 flex items-center justify-center bg-primary-container text-on-primary-container font-bold rounded">1</span>
<h2 class="font-headline-md text-[18px] text-primary">Press Militar con Barra (Standing)</h2>
</div>
<div class="text-right">
<span class="font-label-caps text-[10px] text-on-surface-variant block uppercase">Mejor Previo</span>
<span class="font-data-point text-[14px] text-secondary-fixed">85kg x 6 Reps</span>
</div>
</div>
<div class="p-4 overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="border-b border-outline-variant">
<th class="pb-3 font-label-caps text-label-caps text-on-surface-variant">SERIE</th>
<th class="pb-3 font-label-caps text-label-caps text-on-surface-variant">ANTERIOR</th>
<th class="pb-3 font-label-caps text-label-caps text-on-surface-variant">PESO (KG)</th>
<th class="pb-3 font-label-caps text-label-caps text-on-surface-variant">REPS</th>
<th class="pb-3 font-label-caps text-label-caps text-on-surface-variant">RIR</th>
<th class="pb-3 font-label-caps text-label-caps text-on-surface-variant text-center w-10">OK</th>
</tr>
</thead>
<tbody class="font-data-point text-sm">
<tr class="border-b border-outline-variant/30 hover:bg-surface-container-highest transition-colors">
<td class="py-4 text-on-surface">01</td>
<td class="py-4 text-on-surface-variant">80kg x 8</td>
<td class="py-2"><input class="w-20 bg-background border-outline-variant text-primary font-data-point text-center input-glow rounded" placeholder="80" type="number"/></td>
<td class="py-2"><input class="w-16 bg-background border-outline-variant text-primary font-data-point text-center input-glow rounded" placeholder="8" type="number"/></td>
<td class="py-2"><input class="w-16 bg-background border-outline-variant text-primary font-data-point text-center input-glow rounded" placeholder="2" type="number"/></td>
<td class="py-2 text-center">
<button class="w-8 h-8 bg-surface-container-highest border border-outline-variant flex items-center justify-center text-primary-container hover:bg-primary-container hover:text-on-primary-container transition-all">
<span class="material-symbols-outlined text-[18px]">check</span>
</button>
</td>
</tr>
<tr class="border-b border-outline-variant/30 hover:bg-surface-container-highest transition-colors">
<td class="py-4 text-on-surface">02</td>
<td class="py-4 text-on-surface-variant">80kg x 7</td>
<td class="py-2"><input class="w-20 bg-background border-outline-variant text-primary font-data-point text-center input-glow rounded" placeholder="--" type="number"/></td>
<td class="py-2"><input class="w-16 bg-background border-outline-variant text-primary font-data-point text-center input-glow rounded" placeholder="--" type="number"/></td>
<td class="py-2"><input class="w-16 bg-background border-outline-variant text-primary font-data-point text-center input-glow rounded" placeholder="--" type="number"/></td>
<td class="py-2 text-center">
<button class="w-8 h-8 bg-surface-container-highest border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all">
<span class="material-symbols-outlined text-[18px]">check</span>
</button>
</td>
</tr>
</tbody>
</table>
<button class="mt-4 w-full py-2 border-2 border-dashed border-outline-variant text-on-surface-variant font-label-caps text-label-caps hover:border-primary hover:text-primary transition-all">
                            + AÑADIR SERIE
                        </button>
</div>
<div class="p-4 bg-surface-container-low">
<div class="flex items-center gap-2 mb-2 text-on-surface-variant">
<span class="material-symbols-outlined text-sm">edit_note</span>
<span class="font-label-caps text-[10px] uppercase">Notas de Técnica</span>
</div>
<div class="mb-3 p-2 bg-primary-container/5 border-l-2 border-primary-container">
<p class="text-[12px] text-primary-container font-medium italic">
        AI Suggestion: Readiness allows for +10% volume. Extra set added to main lift.
    </p>
</div><textarea class="w-full bg-background border-outline-variant text-on-surface text-sm rounded h-20 p-3 input-glow resize-none" placeholder="Codos ligeramente hacia adentro, mantener core bloqueado..."></textarea>
</div>
</article>
<!-- Exercise 2 (Condensed for demo) -->
<article class="bg-surface-container border border-outline-variant rounded-lg overflow-hidden opacity-80">
<div class="p-4 bg-surface-container-high border-b border-outline-variant flex justify-between items-center">
<div class="flex items-center gap-3">
<span class="w-8 h-8 flex items-center justify-center bg-surface-container-highest text-on-surface-variant font-bold rounded">2</span>
<h2 class="font-headline-md text-[18px] text-on-surface">Press Inclinado con Mancuernas</h2>
</div>
<div class="text-right">
<span class="font-label-caps text-[10px] text-on-surface-variant block uppercase">Mejor Previo</span>
<span class="font-data-point text-[14px] text-on-surface">36kg x 10 Reps</span>
</div>
</div>
<div class="p-8 flex justify-center text-on-surface-variant font-label-caps">
                        TAP PARA EXPANDIR Y LOGUEAR
                    </div>
</article>
</div>
</section>
<!-- Sidebar Performance Tracker -->

</div>
<!-- Bottom Navigation for Mobile -->
<nav class="md:hidden fixed bottom-0 left-0 w-full glass-panel border-t border-outline-variant flex justify-around py-3 px-2 z-50">
<div class="flex flex-col items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined">dashboard</span>
<span class="text-[9px] font-label-caps">HOME</span>
</div>
<div class="flex flex-col items-center gap-1 text-primary-container">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">fitness_center</span>
<span class="text-[9px] font-label-caps">TRAIN</span>
</div>
<div class="flex flex-col items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined">analytics</span>
<span class="text-[9px] font-label-caps">DATA</span>
</div>
<div class="flex flex-col items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined">smart_toy</span>
<span class="text-[9px] font-label-caps">AI</span>
</div>
<div class="flex flex-col items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined">settings</span>
<span class="text-[9px] font-label-caps">MORE</span>
</div>
</nav>`;
