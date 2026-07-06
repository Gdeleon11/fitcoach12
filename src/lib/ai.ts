import OpenAI from "openai";

// Supports Google Gemini (free tier) via its OpenAI-compatible endpoint,
// or OpenAI directly. Gemini takes priority when GEMINI_API_KEY is set.
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

export const aiEnabled = Boolean(GEMINI_KEY || OPENAI_KEY);

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";

// Fail fast instead of hanging: short timeout + a single retry.
const REQUEST_TIMEOUT_MS = 25_000;

let client: OpenAI | null = null;
function getClient(): OpenAI | null {
  if (!aiEnabled) return null;
  if (!client) {
    if (GEMINI_KEY) {
      client = new OpenAI({ apiKey: GEMINI_KEY, baseURL: GEMINI_BASE_URL, maxRetries: 1, timeout: REQUEST_TIMEOUT_MS });
    } else {
      client = new OpenAI({ apiKey: OPENAI_KEY, maxRetries: 1, timeout: REQUEST_TIMEOUT_MS });
    }
  }
  return client;
}

const MODEL =
  process.env.AI_MODEL ||
  (GEMINI_KEY ? process.env.GEMINI_MODEL || "gemini-2.0-flash" : process.env.OPENAI_MODEL || "gpt-4o-mini");

export const GUARDIAN = `Eres el AI Coach de FitCoach 12%, un sistema de alto rendimiento orientado a llegar y sostener ~12% de grasa corporal.
Reglas de seguridad INQUEBRANTABLES:
- Nunca sugieras planes por debajo de 1200 kcal/día.
- Nunca sugieras ayunos mayores a 24 horas.
- No des consejo médico; ante señales de trastorno alimentario o angustia, recomienda ayuda profesional.
Estilo: directo, analítico, "lectura honesta", basado en datos. Responde en español.`;

export type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

// Sends a prompt expecting a JSON reply and returns the parsed value, or null on
// any failure (bad key, timeout, invalid JSON). Never throws.
export async function aiJson<T = unknown>(system: string, user: string, maxTokens = 900): Promise<T | null> {
  const c = getClient();
  if (!c) return null;
  try {
    const res = await c.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: system + " Responde SOLO con JSON válido, sin texto adicional ni markdown." },
        { role: "user", content: user },
      ],
      temperature: 0.4,
      max_tokens: maxTokens,
    });
    const raw = res.choices[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json\s*|\s*```/g, "").trim();
    // Extract the first JSON object/array in case the model adds stray text.
    const match = cleaned.match(/[[{][\s\S]*[\]}]/);
    return JSON.parse(match ? match[0] : cleaned) as T;
  } catch (err) {
    console.error("aiJson error", err);
    return null;
  }
}

export async function chat(messages: ChatMsg[]): Promise<string> {
  const c = getClient();
  if (!c) {
    return "El AI Coach está en modo demo (no hay clave de IA configurada). Con GEMINI_API_KEY (o OPENAI_API_KEY) activa, aquí verás lecturas honestas y ajustes basados en tus últimos 7 días de datos.";
  }
  try {
    const res = await c.chat.completions.create({
      model: MODEL,
      messages: [{ role: "system", content: GUARDIAN }, ...messages],
      temperature: 0.6,
      max_tokens: 500,
    });
    return res.choices[0]?.message?.content?.trim() ?? "Sin respuesta.";
  } catch (err) {
    console.error("AI chat error", err);
    return "No pude conectar con el motor de IA en este momento. Verifica que la clave (GEMINI_API_KEY) sea válida e inténtalo de nuevo.";
  }
}

const VISION_GUARD = `Eres un coach de composición corporal analizando fotos de progreso de un usuario que las sube voluntariamente para seguir su avance físico.
Tono: profesional, respetuoso, alentador y constructivo. NUNCA hagas comentarios despectivos sobre el cuerpo.
Reglas:
- Da un rango estimado de grasa corporal (ej. "aprox. 15-18%") SIEMPRE con la advertencia de que es una estimación visual imprecisa.
- Comenta desarrollo muscular, definición y postura de forma objetiva y útil.
- Da 2-3 acciones concretas alineadas al objetivo del usuario.
- No diagnostiques ni des consejo médico. Si detectas señales de conducta alimentaria de riesgo, sugiere apoyo profesional.
Responde en español, en 4-6 frases, sin markdown.`;

// Vision analysis of progress photos (data URLs). Never throws.
export async function analyzeImages(dataUrls: string[], context: string): Promise<string> {
  const c = getClient();
  if (!c) return "El análisis con IA requiere una clave de IA configurada (GEMINI_API_KEY). Sin ella no se puede analizar la imagen.";
  try {
    const content = [
      { type: "text" as const, text: context },
      ...dataUrls.slice(0, 3).map((url) => ({ type: "image_url" as const, image_url: { url } })),
    ];
    const res = await c.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: VISION_GUARD },
        { role: "user", content },
      ],
      temperature: 0.5,
      max_tokens: 500,
    });
    return res.choices[0]?.message?.content?.trim() ?? "Sin análisis.";
  } catch (err) {
    console.error("AI analyzeImages error", err);
    return `No se pudo analizar las fotos. Motivo: ${errorReason(err)}`;
  }
}

// Extracts a short, human-readable reason from an OpenAI/Gemini SDK error.
function errorReason(err: unknown): string {
  const e = err as { status?: number; code?: string; message?: string; error?: { message?: string } };
  const status = e?.status ? `HTTP ${e.status}` : "";
  const msg = e?.error?.message || e?.message || String(err);
  const trimmed = msg.length > 260 ? msg.slice(0, 260) + "…" : msg;
  return [status, trimmed].filter(Boolean).join(" · ");
}

// Estimate macros for a free-text meal description. Never throws — returns a
// heuristic fallback on any error so the UI never hangs.
export async function estimateMeal(description: string): Promise<{
  totalKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  note: string;
}> {
  const heuristic = (note: string) => {
    const kcal = Math.min(1200, Math.max(150, description.length * 12));
    return {
      totalKcal: kcal,
      proteinG: Math.round((kcal * 0.3) / 4),
      carbsG: Math.round((kcal * 0.4) / 4),
      fatG: Math.round((kcal * 0.3) / 9),
      note,
    };
  };

  const c = getClient();
  if (!c) return heuristic("Estimación aproximada (sin clave de IA). Ajusta manualmente.");

  try {
    const res = await c.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "Eres un nutricionista. Estima macros de la comida descrita. Responde SOLO JSON válido con las claves: totalKcal, proteinG, carbsG, fatG, note (breve). Números enteros.",
        },
        { role: "user", content: description },
      ],
      temperature: 0.2,
      max_tokens: 200,
    });
    const raw = res.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/```json\s*|\s*```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      totalKcal: Math.round(parsed.totalKcal ?? 0),
      proteinG: Math.round(parsed.proteinG ?? 0),
      carbsG: Math.round(parsed.carbsG ?? 0),
      fatG: Math.round(parsed.fatG ?? 0),
      note: String(parsed.note ?? ""),
    };
  } catch (err) {
    console.error("AI estimateMeal error", err);
    return heuristic("No se pudo estimar con IA (revisa la clave). Estimación aproximada — ajusta los valores.");
  }
}
