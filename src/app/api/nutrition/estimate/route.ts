import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/session";
import { estimateMeal } from "@/lib/ai";
import { buildUserContext } from "@/lib/context";

export const maxDuration = 60;

const schema = z.object({
  description: z.string().min(3).max(1000),
  image: z.string().optional(),
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Describe la comida" }, { status: 400 });
  }
  const context = await buildUserContext(userId);
  const estimate = await estimateMeal(parsed.data.description, parsed.data.image, context);
  return NextResponse.json({ estimate });
}
