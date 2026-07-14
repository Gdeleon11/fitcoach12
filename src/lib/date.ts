import { z } from "zod";

export const dateSchema = z.string()
  .transform((val) => {
    const trimmed = val.trim();
    // Format DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      const [d, m, y] = trimmed.split("/");
      return `${y}-${m}-${d}`;
    }
    // Format DD-MM-YYYY
    if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
      const [d, m, y] = trimmed.split("-");
      return `${y}-${m}-${d}`;
    }
    return trimmed;
  })
  .refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: "Fecha inválida. Debe ser YYYY-MM-DD, DD/MM/YYYY o DD-MM-YYYY",
  });
