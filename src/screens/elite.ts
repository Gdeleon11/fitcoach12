// Ported from Stitch mockup (nav chrome stripped): fitcoach_12_elite_performance_suite
export const html = `<style>
        body {
            background-color: #131313;
            color: #e5e2e1;
            font-family: 'Inter', sans-serif;
            overflow-x: hidden;
        }
        .step-transition {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-card {
            background: rgba(28, 27, 27, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid #3b494b;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        input[type="range"] {
            -webkit-appearance: none;
            width: 100%;
            background: transparent;
        }
        input[type="range"]::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            background: #3b494b;
            border-radius: 2px;
        }
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #00f0ff;
            cursor: pointer;
            margin-top: -8px;
            box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
        }
    </style>

<!-- Top AppBar Component -->

<div class="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-8 px-4">
<!-- Background Animation -->
<div class="fixed inset-0 pointer-events-none opacity-20">

</div>
<div class="w-full max-w-2xl z-10">
<!-- Progress Indicator -->
<div class="mb-12">
<div class="flex justify-between mb-2">
<span class="font-label-caps text-label-caps text-on-surface-variant uppercase">Configuración de Perfil</span>
<span class="font-label-caps text-label-caps text-primary-container" id="progress-text">Paso 1 de 4</span>
</div>
<div class="h-1 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-primary-container w-1/4 transition-all duration-500" id="progress-bar"></div>
</div>
</div>
<form id="onboarding-form">
<!-- STEP 1: Datos Personales -->
<section class="step-transition" id="step-1">
<div class="mb-8">
<h2 class="font-headline-md text-headline-md text-primary mb-2">Comencemos con lo básico</h2>
<p class="font-body-regular text-body-regular text-on-surface-variant">Necesitamos estos datos para calcular tu metabolismo basal con precisión clínica.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="space-y-2">
<label class="font-label-caps text-label-caps text-on-surface-variant uppercase">Edad</label>
<input class="w-full bg-surface-container-lowest border-b-2 border-outline-variant focus:border-primary-container outline-none py-3 px-4 text-primary font-data-point text-data-point transition-all" type="number" value="40"/>
</div>
<div class="space-y-2">
<label class="font-label-caps text-label-caps text-on-surface-variant uppercase">Sexo</label>
<div class="flex gap-2">
<button class="flex-1 py-3 border border-primary-container bg-primary-container/10 text-primary-container font-label-caps text-label-caps uppercase" type="button">Hombre</button>
<button class="flex-1 py-3 border border-outline-variant text-on-surface-variant font-label-caps text-label-caps uppercase hover:bg-surface-container-high transition-colors" type="button">Mujer</button>
</div>
</div>
<div class="space-y-2">
<label class="font-label-caps text-label-caps text-on-surface-variant uppercase">Altura (cm)</label>
<input class="w-full bg-surface-container-lowest border-b-2 border-outline-variant focus:border-primary-container outline-none py-3 px-4 text-primary font-data-point text-data-point transition-all" type="number" value="163"/>
</div>
<div class="space-y-2">
<label class="font-label-caps text-label-caps text-on-surface-variant uppercase">Peso Actual (kg)</label>
<input class="w-full bg-surface-container-lowest border-b-2 border-outline-variant focus:border-primary-container outline-none py-3 px-4 text-primary font-data-point text-data-point transition-all" type="number" value="68"/>
</div>
</div>
</section>
<!-- STEP 2: Objetivos y Actividad (Hidden by Default) -->
<section class="step-transition hidden" id="step-2">
<div class="mb-8">
<h2 class="font-headline-md text-headline-md text-primary mb-2">Misión: 12% Grasa Corporal</h2>
<p class="font-body-regular text-body-regular text-on-surface-variant">Define tu intensidad y cómo te mueves en el día a día.</p>
</div>
<div class="space-y-8">
<div class="space-y-4">
<label class="font-label-caps text-label-caps text-on-surface-variant uppercase">Nivel de Actividad Semanal</label>
<div class="grid grid-cols-1 gap-3">
<label class="flex items-center p-4 glass-card cursor-pointer border-primary-container/50 bg-primary-container/5">
<input checked="" class="hidden" name="activity" type="radio"/>
<span class="material-symbols-outlined text-primary-container mr-4">fitness_center</span>
<div>
<p class="font-label-caps text-label-caps text-primary">Moderado (3-5 días)</p>
<p class="text-xs text-on-surface-variant">Entrenamientos de fuerza y cardio ligero.</p>
</div>
<span class="material-symbols-outlined text-primary-container ml-auto" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</label>
<label class="flex items-center p-4 glass-card cursor-pointer hover:bg-surface-container-high transition-colors">
<input class="hidden" name="activity" type="radio"/>
<span class="material-symbols-outlined text-on-surface-variant mr-4">directions_run</span>
<div>
<p class="font-label-caps text-label-caps text-on-surface-variant">Intenso (6-7 días)</p>
<p class="text-xs text-on-surface-variant">Atleta de alto rendimiento o trabajo físico pesado.</p>
</div>
</label>
</div>
</div>
<div class="space-y-4">
<label class="font-label-caps text-label-caps text-on-surface-variant uppercase">Objetivo de Composición</label>
<div class="p-6 glass-card border-secondary-container">
<div class="flex justify-between items-end mb-4">
<span class="font-label-caps text-label-caps text-secondary-fixed-dim">META DE GRASA</span>
<span class="font-data-point text-display-lg text-secondary-container">12%</span>
</div>
<div class="h-2 bg-surface-container-highest rounded-full">
<div class="h-full bg-secondary-container w-[12%] shadow-[0_0_15px_rgba(195,244,0,0.4)]"></div>
</div>
<p class="mt-4 text-xs text-on-surface-variant">Estado actual estimado: <span class="text-tertiary-fixed-dim">22%</span>. Fase: Déficit Calórico Controlado.</p>
</div>
</div>
</div>
</section>
<!-- STEP 3: Nutrición y Ventana (Hidden by Default) -->
<section class="step-transition hidden" id="step-3">
<div class="mb-8">
<h2 class="font-headline-md text-headline-md text-primary mb-2">Protocolo de Alimentación</h2>
<p class="font-body-regular text-body-regular text-on-surface-variant">La adherencia es la clave del 12%. Ajusta tu ventana de ayuno.</p>
</div>
<div class="space-y-8">
<div class="space-y-4">
<label class="font-label-caps text-label-caps text-on-surface-variant uppercase">Ventana de Comida (Time-Restricted Feeding)</label>
<div class="p-6 glass-card relative overflow-hidden">
<div class="flex justify-between items-center mb-6">
<div class="text-center">
<p class="text-xs text-on-surface-variant mb-1">INICIO</p>
<p class="font-data-point text-data-point text-primary-container">07:00 AM</p>
</div>
<div class="flex-1 px-4">
<div class="h-0.5 bg-outline-variant relative">
<div class="absolute inset-y-0 left-0 w-full h-full bg-primary-container opacity-20"></div>
</div>
</div>
<div class="text-center">
<p class="text-xs text-on-surface-variant mb-1">FIN</p>
<p class="font-data-point text-data-point text-primary-container">05:00 PM</p>
</div>
</div>
<div class="flex gap-2">
<span class="px-3 py-1 bg-surface-container-highest rounded text-[10px] font-label-caps text-on-surface-variant">10 HORAS NUTRICIÓN</span>
<span class="px-3 py-1 bg-surface-container-highest rounded text-[10px] font-label-caps text-on-surface-variant">14 HORAS AYUNO</span>
</div>
</div>
</div>
<div class="space-y-4">
<label class="font-label-caps text-label-caps text-on-surface-variant uppercase">Preferencias Dietéticas</label>
<div class="grid grid-cols-2 gap-3">
<div class="p-4 border border-outline-variant flex items-center gap-3 cursor-pointer hover:border-primary-container transition-all">
<span class="material-symbols-outlined text-primary">restaurant</span>
<span class="font-label-caps text-label-caps uppercase">Omnívoro</span>
</div>
<div class="p-4 border border-outline-variant flex items-center gap-3 cursor-pointer hover:border-primary-container transition-all">
<span class="material-symbols-outlined text-on-surface-variant">eco</span>
<span class="font-label-caps text-label-caps uppercase">Vegetariano</span>
</div>
<div class="p-4 border border-outline-variant flex items-center gap-3 cursor-pointer hover:border-primary-container transition-all">
<span class="material-symbols-outlined text-on-surface-variant">egg_alt</span>
<span class="font-label-caps text-label-caps uppercase">Keto</span>
</div>
<div class="p-4 border border-primary-container bg-primary-container/10 flex items-center gap-3 cursor-pointer">
<span class="material-symbols-outlined text-primary-container">bolt</span>
<span class="font-label-caps text-label-caps uppercase">High Protein</span>
</div>
</div>
</div>
</div>
</section>
<!-- STEP 4: Resumen (Hidden by Default) -->
<section class="step-transition hidden" id="step-4">
<div class="mb-8 text-center">
<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-container/20 mb-4 border-2 border-secondary-container">
<span class="material-symbols-outlined text-secondary-container text-4xl" style="font-variation-settings: 'FILL' 1;">analytics</span>
</div>
<h2 class="font-headline-md text-headline-md text-primary mb-2">Plan Maestro Generado</h2>
<p class="font-body-regular text-body-regular text-on-surface-variant">Basado en tus datos de 40 años, 1.63m y 68kg.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<!-- TDEE Card -->
<div class="glass-card p-6 flex flex-col items-center justify-center border-primary-container/30">
<label class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">TDEE Calculado</label>
<div class="font-data-point text-display-lg text-primary-container">2,400</div>
<p class="font-label-caps text-label-caps text-primary-container opacity-60">KCAL / DÍA</p>
<div class="mt-4 pt-4 border-t border-outline-variant w-full text-center">
<p class="text-xs text-on-surface-variant uppercase tracking-widest">Gasto Energético Total Diario</p>
</div>
</div>
<!-- Macros Card -->
<div class="glass-card p-6 border-secondary-container/30">
<label class="font-label-caps text-label-caps text-on-surface-variant uppercase mb-4 block text-center">Macros Sugeridos</label>
<div class="space-y-4">
<div class="flex justify-between items-center">
<div class="flex items-center gap-2">
<div class="w-3 h-3 bg-secondary-container rounded-full"></div>
<span class="font-label-caps text-label-caps">PROTEÍNA</span>
</div>
<span class="font-data-point text-data-point text-primary">160g</span>
</div>
<div class="flex justify-between items-center">
<div class="flex items-center gap-2">
<div class="w-3 h-3 bg-tertiary-fixed-dim rounded-full"></div>
<span class="font-label-caps text-label-caps">GRASAS</span>
</div>
<span class="font-data-point text-data-point text-primary">70g</span>
</div>
<div class="flex justify-between items-center">
<div class="flex items-center gap-2">
<div class="w-3 h-3 bg-primary-fixed-dim rounded-full"></div>
<span class="font-label-caps text-label-caps">CARBS</span>
</div>
<span class="font-data-point text-data-point text-primary">282g</span>
</div>
</div>
</div>
<!-- Summary Note -->
<div class="md:col-span-2 glass-card p-4 flex items-start gap-4 bg-surface-container-high/40">
<span class="material-symbols-outlined text-secondary-container">info</span>
<p class="text-xs text-on-surface-variant leading-relaxed">
                                Este plan está diseñado para alcanzar el 12% de grasa corporal manteniendo la masa muscular. El ratio de 2.3g de proteína por kg de peso asegura la preservación del tejido metabólicamente activo durante el déficit.
                            </p>
</div>
</div>
</section>
<!-- Navigation Controls -->
<div class="mt-12 flex justify-between items-center">
<button class="px-8 py-3 font-label-caps text-label-caps text-on-surface-variant uppercase hover:text-primary transition-colors disabled:opacity-0" disabled="" id="prev-btn" type="button">
                        Atrás
                    </button>
<button class="px-10 py-4 bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase rounded-lg shadow-[0_4px_20px_rgba(0,240,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all" id="next-btn" type="button">
                        Continuar
                    </button>
</div>
</form>
</div>
</div>
<!-- Footer Identity -->
<footer class="py-8 border-t border-outline-variant bg-surface-container-lowest">
<div class="max-w-container-max mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-4">
<div class="flex items-center gap-2">
<div class="w-8 h-8 bg-primary-container rounded-full flex items-center justify-center">
<span class="material-symbols-outlined text-on-primary-container text-sm">bolt</span>
</div>
<span class="font-label-caps text-label-caps text-primary tracking-widest uppercase">Elite Performance Phase: Phase 1</span>
</div>
<p class="font-label-caps text-[10px] text-on-surface-variant uppercase">© 2024 FitCoach Precision Systems</p>
</div>
</footer>`;
