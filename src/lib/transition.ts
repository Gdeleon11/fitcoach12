// Phase-transition recommendation engine (cut / maintenance / mini-cut / diet break).
// Pure logic over the user's own data.

export type TransitionInput = {
  weeklyChangePct: number | null; // weekly % bodyweight change over the window
  weightPoints: number;
  daysLoggedNutrition: number;
  avgReadiness: number | null; // 0-100
};

export type TransitionResult = {
  status: "continue_cut" | "maintenance" | "mini_cut" | "diet_break" | "insufficient";
  title: string;
  message: string;
  color: string;
};

const COLORS = {
  continue_cut: "#c3f400",
  maintenance: "#00f0ff",
  mini_cut: "#FFCC00",
  diet_break: "#FFCC00",
  insufficient: "#849495",
};

export function computeTransition(input: TransitionInput): TransitionResult {
  if (input.weightPoints < 2 || input.weeklyChangePct == null) {
    return {
      status: "insufficient",
      title: "Datos insuficientes",
      message:
        "Registra tu peso en varios días (idealmente 2-4 semanas) para que el sistema pueda recomendar si continuar, mantener o cambiar de fase.",
      color: COLORS.insufficient,
    };
  }

  // Accumulated fatigue → prioritize recovery regardless of scale movement.
  if (input.avgReadiness != null && input.avgReadiness < 50) {
    return {
      status: "diet_break",
      title: "Toma un diet break",
      message: `Tu readiness promedio está bajo (${Math.round(input.avgReadiness)}/100): señal de fatiga acumulada. Sube a mantenimiento 1-2 semanas (sin ayunos ni <1200 kcal), duerme y baja estrés, y luego retoma el plan.`,
      color: COLORS.diet_break,
    };
  }

  const pct = input.weeklyChangePct;

  if (pct <= -1.1) {
    return {
      status: "diet_break",
      title: "Ritmo demasiado agresivo",
      message: `Pierdes ${pct}%/semana, un ritmo alto que arriesga masa muscular. Sube calorías hacia mantenimiento unos días o toma un diet break corto, manteniendo proteína alta.`,
      color: COLORS.diet_break,
    };
  }

  if (pct <= -0.25) {
    return {
      status: "continue_cut",
      title: "Continúa el déficit",
      message: `Progreso saludable (${pct}%/semana). Mantén la fase actual; sigue registrando peso y adherencia. Revisa de nuevo en 1-2 semanas.`,
      color: COLORS.continue_cut,
    };
  }

  if (pct < 0.3) {
    // Plateau.
    if (input.daysLoggedNutrition < 3) {
      return {
        status: "insufficient",
        title: "Plateau — confirma adherencia",
        message: `Tu peso está estancado (${pct}%/semana) pero registraste pocos días de nutrición. Registra 4+ días para saber si es un plateau real antes de cambiar de fase.`,
        color: COLORS.insufficient,
      };
    }
    return {
      status: "mini_cut",
      title: "Plateau: aplica un mini-cut",
      message: `Estás en plateau (${pct}%/semana) con buena adherencia. Aplica un mini-cut de 2-3 semanas con un déficit algo mayor (o +NEAT), o toma un diet break de 1 semana y retoma. No bajes de 1200 kcal.`,
      color: COLORS.mini_cut,
    };
  }

  // Gaining.
  return {
    status: "maintenance",
    title: "Peso al alza: reevalúa",
    message: `Tu peso sube (${pct}%/semana). Pasa a mantenimiento, revisa calorías y actividad, y define si buscas recomposición o reiniciar el déficit.`,
    color: COLORS.maintenance,
  };
}
