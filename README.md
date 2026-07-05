# FitCoach 12% — Precision System

App de coaching de alto rendimiento construida con **Next.js 14 (App Router) + TypeScript + Tailwind + Prisma + PostgreSQL (Neon)**. Incluye registro/login (email+contraseña y Google), onboarding con cálculo de TDEE/macros, dashboard con datos reales, registro de nutrición con estimación por IA, log de entrenamiento, y un AI Coach con contexto de los últimos 7 días. Las 16 pantallas de diseño (Stitch) están portadas como rutas navegables.

## Stack

- Next.js 14 · React 18 · TypeScript
- Tailwind CSS (tema de diseño FitCoach incluido en `tailwind.config.ts`)
- Prisma ORM → PostgreSQL en Neon
- NextAuth (Credentials con bcrypt + Google OAuth)
- IA: Google Gemini (free tier) vía endpoint compatible con OpenAI — opcional, con fallback demo

## Rutas principales

| Ruta | Descripción | Estado |
|------|-------------|--------|
| `/` | Landing | — |
| `/register`, `/login` | Alta e inicio de sesión | Funcional (Neon) |
| `/onboarding` | Perfil + cálculo de plan | Funcional |
| `/dashboard` | Command Center con KPIs reales | Funcional |
| `/tracking` | Check-in diario | Funcional |
| `/nutrition` | Registro de comidas + estimación IA | Funcional |
| `/training/log` | Log de entrenamiento con series | Funcional |
| `/coach` | AI Coach (contexto 7 días) | Funcional |
| `/progress`, `/reports/*`, `/dashboard/readiness`, `/dashboard/adaptive`, `/training/volume`, `/biodata`, `/bloodwork`, `/supplements`, `/elite` | Módulos avanzados portados del diseño | Vistas navegables |

## 1. Crear la base de datos en Neon

1. Entra a https://neon.tech y crea un proyecto (región cercana, PostgreSQL).
2. En **Dashboard → Connection Details** copia dos cadenas:
   - **Pooled** (host con `-pooler`) → será `DATABASE_URL`.
   - **Direct** (sin `-pooler`) → será `DIRECT_URL`.
   Ambas deben terminar en `?sslmode=require`.

## 2. Configurar variables de entorno

Copia `.env.example` a `.env` y completa:

```bash
cp .env.example .env
```

```
DATABASE_URL="postgresql://...-pooler...neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://...neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="..."   # genera con: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""      # opcional
GOOGLE_CLIENT_SECRET=""  # opcional
GEMINI_API_KEY=""        # IA gratis (Google AI Studio). Sin esto, la IA va en modo demo
GEMINI_MODEL="gemini-2.0-flash"
```

## 3. Instalar y crear las tablas

```bash
npm install
npx prisma db push      # crea todas las tablas en Neon
npm run dev             # http://localhost:3000
```

(Opcional) usuario demo: `node prisma/seed.mjs` → `demo@fitcoach12.app` / `demo1234`.

## 4. Google OAuth (opcional)

1. https://console.cloud.google.com/apis/credentials → **Crear credenciales → ID de cliente OAuth → Aplicación web**.
2. **Orígenes autorizados de JavaScript:** `http://localhost:3000` y tu dominio de Vercel.
3. **URIs de redirección autorizados:**
   - `http://localhost:3000/api/auth/callback/google`
   - `https://TU-APP.vercel.app/api/auth/callback/google`
4. Copia el Client ID y Secret a `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

El botón de Google aparece automáticamente solo si esas dos variables están configuradas.

## 5. Deploy en Vercel

1. Sube este proyecto a GitHub (repo `fitcoach12`).
2. En https://vercel.com → **Add New → Project** → importa el repo.
3. En **Settings → Environment Variables** agrega las mismas variables del `.env`
   (usa tu URL real de Vercel en `NEXTAUTH_URL`, p. ej. `https://fitcoach12.vercel.app`).
4. Deploy. El `buildCommand` de `vercel.json` ejecuta `prisma generate && prisma db push && next build`,
   así que las tablas se crean en Neon en el primer despliegue.

### Notas
- El plan (TDEE, calorías objetivo, macros) se recalcula en el servidor cuando el perfil tiene peso, altura, edad, sexo y actividad.
- Capa de seguridad IA: nunca programa por debajo de 1200 kcal ni ayunos > 24 h.
- La estimación de macros y el chat del coach usan **Gemini** (`gemini-2.0-flash`) vía el endpoint compatible con OpenAI de Google. Consigue tu clave gratis en https://aistudio.google.com/apikey.
