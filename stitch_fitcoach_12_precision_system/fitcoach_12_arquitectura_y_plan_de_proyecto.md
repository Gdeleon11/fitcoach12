# FitCoach 12% - Product Architecture & Design Document

## 1. Stack Tecnológico Recomendado
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React (icons), Tremor/Recharts (dashboards).
- **Backend/API:** Next.js API Routes (Serverless) para velocidad, evolucionando a NestJS si la lógica de entrenamiento/IA se vuelve muy compleja.
- **Base de Datos:** PostgreSQL (vía Supabase o Neon) por su robustez con datos relacionales de salud.
- **ORM:** Prisma para tipado estricto extremo.
- **Auth:** NextAuth.js o Supabase Auth.
- **IA:** OpenAI API (GPT-4o para análisis visual y de logs) con estructuración via JSON Mode/Zod.
- **Storage:** Supabase Storage o AWS S3 para fotos de progreso y archivos PDF.

## 2. Modelo de Datos (Esquema Simplificado)

### Core
- **User:** id, email, password, createdAt.
- **UserProfile:** userId, name, age, height, gender, activityLevel, goalBodyFat, foodWindowStart, foodWindowEnd.

### Tracking
- **DailyCheckIn:** id, userId, date, weight, waist, sleep, energy, hunger, fatigue, digestion, stress, notes.
- **NutritionLog:** id, userId, date, totalKcal, protein, carbs, fat, waterLiters.
- **Workout:** id, userId, date, type (Strength/Cardio/Sport), duration, intensity, rpe.
- **WorkoutSet:** workoutId, exerciseName, reps, weight, rir.

### Progress & AI
- **ProgressPhoto:** id, userId, date, url, angle (Front/Side/Back), aiAnalysis (JSON).
- **AIRecommendation:** id, userId, date, type (CalorieAdj/TrainingAdj), reasoning, actionStep.
- **HealthDataBuffer:** id, userId, source (Manual/File), rawContent, parsedStatus.

## 3. Estrategia de IA (Orchestration)
1. **Context Window:** Cada petición enviará los últimos 7 días de `DailyCheckIn` y `NutritionLog` + Perfil base.
2. **Safety Layer:** Un prompt de sistema "Guardian" que intercepta y bloquea cualquier sugerencia de <1200kcal o ayunos >24h.
3. **Structured Output:** La IA responderá siempre con un objeto JSON que separa el mensaje para el usuario del "AdjustmentPayload" para el motor de reglas.

## 4. Plan de Implementación (Fases)
- **Fase 1: Onboarding & Core Engine.** Captura de datos, cálculo de TDEE/Macros iniciales y creación de cuenta.
- **Fase 2: The Command Center (Dashboard).** Visualización de KPIs y estado de adherencia.
- **Fase 3: Daily Log & Nutrition.** Registro rápido y estimación de macros via IA.
- **Fase 4: Visual Analysis.** Carga de fotos y primer análisis de composición corporal.
- **Fase 5: AI Coach Integration.** Chat con contexto y reportes automáticos.

## 5. Riesgos Técnicos
- **Inconsistencia de Fotos:** Variaciones de luz/ángulo que pueden confundir a la IA. Mitigación: Guía visual de "ghost overlay" en mobile.
- **Precisión de Macros:** La estimación manual suele ser errónea. Mitigación: Validar logs via IA comparando fotos de comida vs texto.
