import OpenAI from "openai";

// Multi-provider AI with automatic fallback.
// Primary: Google Gemini (free tier) via its OpenAI-compatible endpoint.
// Fallback: Groq (fast, generous free tier) — used when the primary fails (e.g. 429).
// Both expose an OpenAI-compatible API, so we drive them with the `openai` SDK.

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GROQ_KEY = process.env.GROQ_API_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL;

export const aiEnabled = Boolean(GEMINI_KEY || GROQ_KEY || OPENAI_KEY || OLLAMA_BASE_URL);

const REQUEST_TIMEOUT_MS = 25_000;

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

type Provider = { name: string; client: OpenAI; model: string; visionModel: string; supportsVision: boolean };

let cached: Provider[] | null = null;
function providers(): Provider[] {
  if (cached) return cached;
  const list: Provider[] = [];
  if (OLLAMA_BASE_URL) {
    list.push({
      name: "ollama",
      client: new OpenAI({ apiKey: "ollama", baseURL: OLLAMA_BASE_URL, maxRetries: 0, timeout: REQUEST_TIMEOUT_MS * 3 }),
      model: process.env.OLLAMA_MODEL || "llama3.1:latest",
      visionModel: process.env.OLLAMA_VISION_MODEL || "qwen2.5vl:7b",
      supportsVision: true,
    });
  }
  if (GEMINI_KEY) {
    list.push({
      name: "gemini",
      client: new OpenAI({ apiKey: GEMINI_KEY, baseURL: GEMINI_BASE_URL, maxRetries: 0, timeout: REQUEST_TIMEOUT_MS }),
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
      visionModel: process.env.GEMINI_MODEL || "gemini-2.0-flash",
      supportsVision: true,
    });
  }
  if (GROQ_KEY) {
    list.push({
      name: "groq",
      client: new OpenAI({ apiKey: GROQ_KEY, baseURL: GROQ_BASE_URL, maxRetries: 0, timeout: REQUEST_TIMEOUT_MS }),
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      visionModel: process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct",
      supportsVision: true,
    });
  }
  if (OPENAI_KEY) {
    list.push({
      name: "openai",
      client: new OpenAI({ apiKey: OPENAI_KEY, maxRetries: 0, timeout: REQUEST_TIMEOUT_MS }),
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      visionModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
      supportsVision: true,
    });
  }
  cached = list;
  return list;
}

class NoProviderError extends Error {}

// Runs a chat completion across providers, falling back on error. Returns the
// text of the first success. Throws the last error if all providers fail.
type Msg = { role: "system" | "user" | "assistant"; content: unknown };
async function runCompletion(
  messages: Msg[],
  opts: { vision?: boolean; maxTokens: number; temperature: number }
): Promise<string> {
  const all = providers();
  if (all.length === 0) throw new NoProviderError("no ai provider configured");
  // Se prioriza ollama si está configurado. Luego fallback a Groq / Gemini dependiendo del caso de uso.
  const order = opts.vision ? ["ollama", "gemini", "groq", "openai"] : ["ollama", "groq", "gemini", "openai"];
  const provs = order.map((n) => all.find((p) => p.name === n)).filter((p): p is Provider => Boolean(p));
  let lastErr: unknown;
  for (const p of provs) {
    if (opts.vision && !p.supportsVision) continue;
    try {
      const res = await p.client.chat.completions.create({
        model: opts.vision ? p.visionModel : p.model,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        messages: messages as any,
        temperature: opts.temperature,
        max_tokens: opts.maxTokens,
      });
      const text = res.choices[0]?.message?.content?.trim();
      if (text) return text;
      lastErr = new Error("empty response");
    } catch (err) {
      lastErr = err;
      console.error(`AI provider "${p.name}" failed`, (err as { status?: number })?.status ?? err);
    }
  }
  throw lastErr ?? new Error("all providers failed");
}

// Turns an OpenAI/Gemini/Groq SDK error into a clear, user-facing message.
export function friendlyAiError(err: unknown, prefix: string): string {
  if (err instanceof NoProviderError) {
    return `${prefix}: no hay ninguna clave o puente de IA configurado (OLLAMA_BASE_URL, GEMINI_API_KEY o GROQ_API_KEY).`;
  }
  const e = err as { status?: number; message?: string; error?: { message?: string } };
  const status = e?.status;
  if (status === 429) {
    return `${prefix}: se alcanzó el límite de uso de la IA en todos los proveedores. Espera ~1 minuto y reintenta.`;
  }
  if (status === 401 || status === 403) {
    return `${prefix}: alguna clave de IA no es válida. Revisa GEMINI_API_KEY / GROQ_API_KEY en Vercel.`;
  }
  const msg = e?.error?.message || e?.message || String(err);
  const trimmed = msg.length > 200 ? msg.slice(0, 200) + "…" : msg;
  return `${prefix}. Motivo: ${status ? `HTTP ${status} · ` : ""}${trimmed}`;
}

export const GUARDIAN = `Eres el AI Coach de FitCoach 12%, un sistema de alto rendimiento orientado a llegar y sostener ~12% de grasa corporal.
Reglas de seguridad INQUEBRANTABLES:
- Nunca sugieras planes por debajo de 1200 kcal/día.
- Nunca sugieras ayunos mayores a 24 horas.
- No des consejo médico; ante señales de trastorno alimentario o angustia, recomienda ayuda profesional.
Estilo: directo, analítico, "lectura honesta", basado en datos. Responde en español.`;

export type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

export async function chat(messages: ChatMsg[]): Promise<string> {
  if (!aiEnabled) {
    return "El AI Coach está en modo demo (no hay clave ni puente de IA configurado). Con OLLAMA_BASE_URL, GEMINI_API_KEY o GROQ_API_KEY verás lecturas honestas basadas en tus últimos 7 días de datos.";
  }
  try {
    return await runCompletion([{ role: "system", content: GUARDIAN }, ...messages], { maxTokens: 500, temperature: 0.6 });
  } catch (err) {
    return friendlyAiError(err, "No pude responder ahora");
  }
}

// Prompt expecting JSON. Returns parsed value or null on any failure.
export async function aiJson<T = unknown>(system: string, user: string, maxTokens = 900): Promise<T | null> {
  if (!aiEnabled) return null;
  try {
    const raw = await runCompletion(
      [
        { role: "system", content: system + " Responde SOLO con JSON válido, sin texto adicional ni markdown." },
        { role: "user", content: user },
      ],
      { maxTokens, temperature: 0.4 }
    );
    const cleaned = raw.replace(/```json\s*|\s*```/g, "").trim();
    const match = cleaned.match(/[[{][\s\S]*[\]}]/);
    return JSON.parse(match ? match[0] : cleaned) as T;
  } catch (err) {
    console.error("aiJson error", err);
    return null;
  }
}

// Vision analysis of progress photos (data URLs). Never throws.
export async function analyzeImages(dataUrls: string[], context: string): Promise<string> {
  if (!aiEnabled) return "El análisis con IA requiere una configuración de IA (OLLAMA_BASE_URL, GEMINI_API_KEY o GROQ_API_KEY). Sin ella no se puede analizar la imagen.";
  try {
    const content = [
      { type: "text" as const, text: context },
      ...dataUrls.slice(0, 3).map((url) => ({ type: "image_url" as const, image_url: { url } })),
    ];
    return await runCompletion(
      [
        { role: "system", content: VISION_GUARD },
        { role: "user", content },
      ],
      { vision: true, maxTokens: 500, temperature: 0.5 }
    );
  } catch (err) {
    return friendlyAiError(err, "No se pudieron analizar las fotos");
  }
}

const VISION_GUARD = `Eres un coach de composición corporal Élite analizando fotos de progreso de un usuario.
Tu análisis debe ser extremadamente fino, clínico y detallado. Tono: objetivo, técnico, directo y constructivo. NUNCA hagas comentarios despectivos.
Reglas de análisis visual:
1. Da un rango estimado de grasa corporal (ej. "aprox. 14-16%") advirtiendo que es estimación visual.
2. Analiza grupos musculares específicos visibles: vascularización, estriaciones (hombros, pecho, cuádriceps), inserciones y simetría.
3. Evalúa la distribución de grasa (abdominal, flancos, lumbar, pecho).
4. Da 2-3 acciones hiper-específicas de entrenamiento o nutrición (ej. "aumentar volumen en deltoide lateral", "ligero superávit", etc) alineadas al objetivo de 12% de grasa.
5. No des consejo médico.
Responde en español, de forma estructurada en 4-6 frases, sin markdown.`;

// Estimate macros for a free-text meal description and optional image. Never throws.
export async function estimateMeal(description: string, image?: string, context?: string): Promise<{
  totalKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  sodiumMg: number | null;
  note: string;
}> {
  const heuristic = (note: string) => {
    const kcal = Math.min(1200, Math.max(150, description.length * 12));
    return {
      totalKcal: kcal,
      proteinG: Math.round((kcal * 0.3) / 4),
      carbsG: Math.round((kcal * 0.4) / 4),
      fatG: Math.round((kcal * 0.3) / 9),
      sodiumMg: null,
      note,
    };
  };
  if (!aiEnabled) return heuristic("Estimación aproximada (sin clave de IA). Ajusta manualmente.");
  try {
    const content: any[] = [{ type: "text", text: description }];
    if (image) {
      content.push({ type: "image_url", image_url: { url: image } });
    }
    const raw = await runCompletion(
      [
        {
          role: "system",
          content:
            "Eres un nutricionista de élite analizando comidas" + (image ? " mediante fotos" : "") + ".\n" +
            (context ? context + "\n" : "") +
            "Analiza la comida descrita. Evalúa si ayuda o perjudica a su objetivo actual, considerando lo que ya ha comido hoy. Haz comentarios críticos sobre la calidad de los ingredientes y la estimación de sodio. " +
            "Responde SOLO JSON válido con las claves: totalKcal, proteinG, carbsG, fatG, sodiumMg (estimado numérico), y note (tu análisis crítico en 1-2 párrafos cortos). Números enteros. Si la foto no es comida, estima 0.",
        },
        { role: "user", content },
      ],
      { maxTokens: 400, temperature: 0.3, vision: Boolean(image) }
    );
    const cleaned = raw.replace(/```json\s*|\s*```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : cleaned);
    return {
      totalKcal: Math.round(parsed.totalKcal ?? 0),
      proteinG: Math.round(parsed.proteinG ?? 0),
      carbsG: Math.round(parsed.carbsG ?? 0),
      fatG: Math.round(parsed.fatG ?? 0),
      sodiumMg: typeof parsed.sodiumMg === "number" ? Math.round(parsed.sodiumMg) : null,
      note: String(parsed.note ?? ""),
    };
  } catch (err) {
    console.error("AI estimateMeal error", err);
    return heuristic("No se pudo estimar con IA (límite o clave). Estimación aproximada — ajusta los valores.");
  }
}
