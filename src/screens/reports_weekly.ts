// Ported verbatim from Stitch mockup: fitcoach_12_reporte_semanal_estrat_gico
export const html = `<style>
        body {
            background-color: #0A0A0A;
            color: #e5e2e1;
            font-family: 'Inter', sans-serif;
        }
        .data-border { border: 1px solid #2C2C2C; }
        .active-glow { border-color: #00dbe9; box-shadow: 0 0 10px rgba(0, 219, 233, 0.1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .fill-icon {
            font-variation-settings: 'FILL' 1;
        }
    </style>

<!-- SideNavBar -->
<aside class="h-screen w-64 fixed left-0 top-0 bg-surface-container dark:bg-surface-container-low border-r border-outline-variant flex flex-col py-8 gap-4 z-50 hidden md:flex">
<div class="px-6 mb-4">
<h1 class="font-headline-md text-headline-md text-primary">Elite Performance</h1>
<p class="text-[10px] font-label-caps uppercase text-on-surface-variant">Phase: Hypertrophy</p>
</div>
<nav class="flex-1">
<ul class="space-y-1">
<li>
<a class="flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-label-caps text-label-caps uppercase">Dashboard</span>
</a>
</li>
<li>
<a class="flex items-center gap-4 px-6 py-3 bg-primary-container text-on-primary-container font-bold border-l-4 border-primary transition-all duration-200" href="#">
<span class="material-symbols-outlined fill-icon" style="font-variation-settings: 'FILL' 1;">analytics</span>
<span class="font-label-caps text-label-caps uppercase">Progress</span>
</a>
</li>
<li>
<a class="flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200" href="#">
<span class="material-symbols-outlined">restaurant</span>
<span class="font-label-caps text-label-caps uppercase">Nutrition</span>
</a>
</li>
<li>
<a class="flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200" href="#">
<span class="material-symbols-outlined">fitness_center</span>
<span class="font-label-caps text-label-caps uppercase">Training</span>
</a>
</li>
<li>
<a class="flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200" href="#">
<span class="material-symbols-outlined">smart_toy</span>
<span class="font-label-caps text-label-caps uppercase">AI Coach</span>
</a>
</li>
<li>
<a class="flex items-center gap-4 px-6 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-all duration-200" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="font-label-caps text-label-caps uppercase">Settings</span>
</a>
</li>
</ul>
</nav>
<div class="px-6 mt-auto">
<button class="w-full py-3 bg-secondary-container text-on-secondary font-label-caps text-label-caps uppercase active:scale-95 transition-all">
                Start Session
            </button>
</div>
</aside>
<main class="md:ml-64 min-h-screen relative">
<!-- TopAppBar -->
<header class="w-full sticky top-0 z-40 bg-background border-b border-outline-variant flex justify-between items-center px-6 md:px-margin-desktop py-4 max-w-container-max mx-auto">
<div class="font-display-lg text-[24px] md:text-display-lg text-primary-container tracking-tighter">FitCoach 12%</div>
<div class="flex items-center gap-6">
<div class="hidden md:flex gap-4">
<span class="material-symbols-outlined text-primary cursor-pointer">monitor_weight</span>
<span class="material-symbols-outlined text-primary cursor-pointer">local_fire_department</span>
<span class="material-symbols-outlined text-primary cursor-pointer">account_circle</span>
</div>
<button class="md:hidden material-symbols-outlined text-primary">menu</button>
</div>
</header>
<section class="p-6 md:p-margin-desktop max-w-5xl mx-auto space-y-8">
<!-- Header Section -->
<div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<span class="font-label-caps text-label-caps text-secondary-fixed-dim tracking-[0.2em] uppercase">Executive Analytics</span>
<h2 class="font-display-lg text-display-lg-mobile md:text-display-lg leading-tight mt-2">Reporte Semanal de Rendimiento // Semana 12</h2>
</div>
<div class="flex gap-2">
<button class="px-4 py-2 bg-surface-container-high border border-outline-variant text-on-surface font-label-caps text-[10px] uppercase hover:bg-surface-container-highest transition-colors flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">download</span> PDF Report
                    </button>
<button class="px-4 py-2 bg-primary-container text-on-primary-container font-label-caps text-[10px] uppercase active:opacity-80 transition-opacity flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">share</span> Share Coach
                    </button>
</div>
</div>
<!-- Bento Grid Main Content -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
<!-- KPI: Weight & Measurements -->
<div class="md:col-span-8 bg-surface-container-low data-border p-6 space-y-6">
<div class="flex justify-between items-center">
<h3 class="font-label-caps text-label-caps uppercase flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-secondary-fixed"></span> Peso y Medidas Antropométricas
                        </h3>
<span class="font-data-point text-secondary-fixed">-0.7kg Δ</span>
</div>
<div class="grid grid-cols-2 md:grid-cols-3 gap-8">
<div>
<p class="text-on-surface-variant font-label-caps text-[10px] uppercase mb-1">Promedio Semanal</p>
<p class="font-data-point text-[32px]">67.5 <span class="text-lg opacity-50">kg</span></p>
<p class="text-on-surface-variant text-xs">Anterior: 68.2kg</p>
</div>
<div>
<p class="text-on-surface-variant font-label-caps text-[10px] uppercase mb-1">Cambio Cintura</p>
<p class="font-data-point text-[32px]">-0.5 <span class="text-lg opacity-50">cm</span></p>
<p class="text-on-surface-variant text-xs">Actual: 76.5cm</p>
</div>
<div class="col-span-2 md:col-span-1">
<p class="text-on-surface-variant font-label-caps text-[10px] uppercase mb-1">Tendencia (7D)</p>
<div class="h-12 w-full flex items-end gap-1">
<div class="w-full bg-outline-variant h-[90%]"></div>
<div class="w-full bg-outline-variant h-[85%]"></div>
<div class="w-full bg-outline-variant h-[80%]"></div>
<div class="w-full bg-outline-variant h-[75%]"></div>
<div class="w-full bg-outline-variant h-[70%]"></div>
<div class="w-full bg-outline-variant h-[65%]"></div>
<div class="w-full bg-primary-container h-[60%]"></div>
</div>
</div>
</div>
</div>
<!-- KPI: Adherence -->
<div class="md:col-span-4 bg-surface-container-low data-border p-6 flex flex-col justify-between">
<div>
<h3 class="font-label-caps text-label-caps uppercase mb-4">Adherencia Macros</h3>
<div class="relative w-24 h-24 mx-auto mb-4">
<svg class="w-full h-full transform -rotate-90">
<circle class="text-surface-variant" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" stroke-width="8"></circle>
<circle class="text-secondary-fixed" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" stroke-dasharray="251.2" stroke-dashoffset="10" stroke-width="8"></circle>
</svg>
<div class="absolute inset-0 flex items-center justify-center font-data-point text-2xl">96%</div>
</div>
</div>
<div class="space-y-2">
<div class="flex justify-between text-xs">
<span class="text-on-surface-variant uppercase">Calorías</span>
<span>2,300 / 2,300</span>
</div>
<div class="flex justify-between text-xs">
<span class="text-on-surface-variant uppercase">Proteína</span>
<span>165g / 160g</span>
</div>
<div class="flex justify-between text-xs">
<span class="text-on-surface-variant uppercase">Fast Window</span>
<span class="text-secondary-fixed">10/10 OK</span>
</div>
</div>
</div>
<!-- Training & Activity -->
<div class="md:col-span-6 bg-surface-container-low data-border p-6 space-y-4">
<h3 class="font-label-caps text-label-caps uppercase">Entrenamiento y Actividad</h3>
<div class="grid grid-cols-2 gap-4">
<div class="bg-surface p-4 border-l-2 border-primary">
<p class="text-[10px] text-on-surface-variant uppercase">Volumen Total</p>
<p class="font-data-point text-xl">+4.2% <span class="material-symbols-outlined text-sm align-middle">trending_up</span></p>
<p class="text-[10px] opacity-60">vs semana anterior</p>
</div>
<div class="bg-surface p-4 border-l-2 border-primary">
<p class="text-[10px] text-on-surface-variant uppercase">Pasos Promedio</p>
<p class="font-data-point text-xl">11,400</p>
<p class="text-[10px] opacity-60">Meta: 10,000</p>
</div>
</div>
<div class="p-3 bg-surface-container-highest flex items-center gap-3">
<span class="material-symbols-outlined text-secondary-fixed">sports_soccer</span>
<div>
<p class="text-xs font-bold">Extra: Sesión Fútbol (90 min)</p>
<p class="text-[10px] text-on-surface-variant">Intensidad Alta - 850 kcal est.</p>
</div>
</div>
</div>
<!-- Visual Progress -->
<div class="md:col-span-6 bg-surface-container-low data-border p-6">
<h3 class="font-label-caps text-label-caps uppercase mb-4">Comparativa Visual</h3>
<div class="flex gap-2 h-40">
<div class="flex-1 relative overflow-hidden group">
<div class="absolute inset-0 bg-cover bg-center" data-alt="Close up athletic male physique, side profile progress photo, professional fitness studio lighting, sharp focus, technical overlay, dark aesthetic." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAB35ID-eigvjrOqJmcPQp-wG8rZhKj2DgNYEutrx8SEa9GTEAjeCuH8mVt5E_bMV4QLb7H6wFGtjao7QnyyG1qI1JU4GPaFx8z30tuGA71EvaqOyFxfVXUduxphoOwF5UQaBk1nWp6AyIXnz4ORh2HkjxtfsQ42-RnEFq_ShquCUy60YuH8pYH1dO-6RuDlDtFx4rG3buUTONDkL6Q0OLvfe_7Aq4-LonJJQtbfOBGE6pipThzI4Iv')"></div>
<div class="absolute bottom-2 left-2 bg-black/60 px-2 py-1 text-[10px] uppercase font-label-caps">Lunes 08:00</div>
</div>
<div class="flex-1 relative overflow-hidden group">
<div class="absolute inset-0 bg-cover bg-center" data-alt="Athletic male physique, front profile progress photo, defined abdominal muscles, professional fitness studio lighting, high contrast, technical dark aesthetic." style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBViBcvpWJJYtWvNcEetzjatMd6hNTgvTXhD1WL-UpYI0i59OvwJkhzCXtP-GfOBF-J5ytCCBeYnUjUdw5gSJ8SkYJfH_BeqqmoNSaBB9hYInbYEUQxihfikEizI2chWSTh_PU8tEWAyowUicc10doik9lQmTN9lw75Fy6b7_XQnhDdH6nE5NfQVLK2gip0DFS1xf0canAQd4zR1AsUFvS6OktNUcnRzhtx_vUGopGGLFC2eimQREcy')"></div>
<div class="absolute bottom-2 left-2 bg-secondary-fixed text-on-secondary px-2 py-1 text-[10px] uppercase font-label-caps">Domingo 20:00</div>
</div>
</div>
</div>
<!-- AI STRATEGIC DECISION - HIGHLIGHTED -->
<div class="md:col-span-12 bg-primary/5 border border-primary/30 p-8 relative overflow-hidden group">
<!-- Technical background effect -->
<div class="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
<div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
<div class="space-y-2">
<div class="flex items-center gap-2 text-primary">
<span class="material-symbols-outlined">smart_toy</span>
<span class="font-label-caps text-label-caps uppercase">AI Strategic Analysis</span>
</div>
<p class="text-xl font-headline-md text-primary-fixed">"Déficit efectivo, cintura bajando, fuerza estable."</p>
</div>
<div class="text-center p-4 border-x border-primary/20">
<p class="text-[10px] text-on-surface-variant uppercase mb-1">Estrategia Siguiente Fase</p>
<p class="text-3xl font-display-lg text-secondary-fixed uppercase tracking-widest">Mantener Plan</p>
<p class="text-sm opacity-80 mt-1">Calorías actuales: 2,300 kcal</p>
</div>
<div class="space-y-4">
<div class="flex items-center gap-4">
<span class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
<span class="material-symbols-outlined">flag</span>
</span>
<div>
<p class="text-[10px] text-on-surface-variant uppercase">Próximo Objetivo</p>
<p class="font-bold text-sm">Alcanzar 12,000 pasos promedio</p>
</div>
</div>
<div class="w-full bg-primary/10 h-1">
<div class="bg-primary h-full w-[85%] shadow-[0_0_8px_rgba(0,219,233,0.5)]"></div>
</div>
</div>
</div>
</div>
</div>
<!-- Footer Action Bar -->
<div class="flex justify-center pt-8 border-t border-outline-variant">
<p class="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-widest">Generating updated program for week 13... 85%</p>
</div>
</section>
</main>
<!-- Mobile Navigation (BottomNavBar substitute) -->
<nav class="md:hidden fixed bottom-0 left-0 w-full bg-surface-container border-t border-outline-variant z-50 flex justify-around items-center py-3">
<button class="flex flex-col items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined">dashboard</span>
<span class="text-[9px] font-label-caps uppercase">Dash</span>
</button>
<button class="flex flex-col items-center gap-1 text-primary">
<span class="material-symbols-outlined fill-icon">analytics</span>
<span class="text-[9px] font-label-caps uppercase">Report</span>
</button>
<button class="flex flex-col items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined">fitness_center</span>
<span class="text-[9px] font-label-caps uppercase">Work</span>
</button>
<button class="flex flex-col items-center gap-1 text-on-surface-variant">
<span class="material-symbols-outlined">restaurant</span>
<span class="text-[9px] font-label-caps uppercase">Nutri</span>
</button>
</nav>`;
