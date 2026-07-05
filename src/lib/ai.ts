import OpenAI from "openai";

export const aiEnabled = Boolean(process.env.OPENAI_API_KEY);

let client: OpenAI | null = null;
function getClient(): OpenAI | null {
  if (!aiEnabled) return null;
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// Guardian system prompt: safety layer described in the architecture doc.
export const GUARDIAN = `Eres el AI Coach de FitCoach 12%, un sistema de alto rendimiento orientado a llegar y sostener ~12% de grasa corporal.
Reglas de seguridad INQUEBRANTABLES:
- Nunca sugieras planes por debajo de 1200 kcal/día.
- Nunca sugieras ayunos mayores a 24 horas.
- No des consejo médico; ante señales de trastorno alimentario o angustia, recomienda ayuda profesional.
Estilo: directo, analítico, "lectura honesta", basado en datos. Responde en español.`;

export type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

export async function chat(messages: ChatMsg[]): Promise<string> {
  const c = getClient();
  if (!c) {
    return "El AI Coach está en modo demo (no hay OPENAI_API_KEY configurada). Con la clave activa, aquí verás lecturas honestas y ajustes basados en tus últimos 7 días de datos.";
  }
  const res = await c.chat.completions.create({
    model: MODEL,
    messages: [{ role: "system", content: GUARDIAN }, ...messages],
    temperature: 0.6,
    max_tokens: 500,
  });
  return res.choices[0]?.message?.content?.trim() ?? "Sin respuesta.";
}

// Estimate macros for a free-text meal description. Returns JSON.
export async function estimateMeal(description: string): Promise<{
  totalKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  note: string;
}> {
  const c = getClient();
  if (!c) {
    // Rough heuristic fallback so the feature works without a key.
    const kcal = Math.min(1200, Math.max(150, description.length * 12));
    return {
      totalKcal: kcal,
      proteinG: Math.round((kcal * 0.3) / 4),
      carbsG: Math.round((kcal * 0.4) / 4),
      fatG: Math.round((kcal * 0.3) / 9),
      note: "Estimación demo (sin OPENAI_API_KEY). Ajusta manualmente.",
    };
  }
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
    response_format: { type: "json_object" },
    max_tokens: 200,
  });
  try {
    const parsed = JSON.parse(res.choices[0]?.message?.content ?? "{}");
    return {
      totalKcal: Math.round(parsed.totalKcal ?? 0),
      proteinG: Math.round(parsed.proteinG ?? 0),
      carbsG: Math.round(parsed.carbsG ?? 0),
      fatG: Math.round(parsed.fatG ?? 0),
      note: String(parsed.note ?? ""),
    };
  } catch {
    return { totalKcal: 0, proteinG: 0, carbsG: 0, fatG: 0, note: "No se pudo estimar." };
  }
}
