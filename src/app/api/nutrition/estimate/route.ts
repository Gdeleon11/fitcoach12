import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUserId } from "@/lib/session";
import { estimateMeal } from "@/lib/ai";

const schema = z.object({ description: z.string().min(3).max(1000) });

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Describe la comida" }, { status: 400 });
  }
  const estimate = await estimateMeal(parsed.data.description);
  return NextResponse.json({ estimate });
}
