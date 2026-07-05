// Supplement scheduling helpers. Pure logic over the user's own supplement plan.

export const SLOTS = [
  { key: "MORNING", label: "Mañana", icon: "wb_sunny" },
  { key: "PRE_WORKOUT", label: "Pre-entreno", icon: "bolt" },
  { key: "POST_WORKOUT", label: "Post-entreno", icon: "fitness_center" },
  { key: "WITH_MEALS", label: "Con comidas", icon: "restaurant" },
  { key: "EVENING", label: "Noche", icon: "bedtime" },
] as const;

export type SlotKey = (typeof SLOTS)[number]["key"];

export const SLOT_KEYS = SLOTS.map((s) => s.key) as SlotKey[];

export function slotLabel(key: string): string {
  return SLOTS.find((s) => s.key === key)?.label ?? key;
}
export function slotIcon(key: string): string {
  return SLOTS.find((s) => s.key === key)?.icon ?? "medication";
}
export function slotOrder(key: string): number {
  const i = SLOTS.findIndex((s) => s.key === key);
  return i === -1 ? 99 : i;
}

export type SuppLite = { name: string; dosage: string | null; slot: string; time: string | null; active: boolean };

// Next dose among active supplements that have an explicit time, relative to `now` (HH:MM).
export function nextDose(supps: SuppLite[], nowHHMM: string): SuppLite | null {
  const timed = supps.filter((s) => s.active && s.time).sort((a, b) => (a.time as string).localeCompare(b.time as string));
  if (timed.length === 0) return null;
  const upcoming = timed.find((s) => (s.time as string) >= nowHHMM);
  // If nothing later today, the next is tomorrow's first.
  return upcoming ?? timed[0];
}
