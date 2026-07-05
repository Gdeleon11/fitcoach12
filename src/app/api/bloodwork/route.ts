import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { findMarker } from "@/lib/bloodmarkers";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const markers = await prisma.bloodMarker.findMany({
    where: { userId },
    orderBy: [{ panelDate: "desc" }, { createdAt: "desc" }],
    take: 200,
  });
  return NextResponse.json({ markers });
}

const schema = z.object({
  markerKey: z.string().min(1),
  name: z.string().max(80).optional(),
  value: z.number().finite(),
  unit: z.string().max(20).optional(),
  panelDate: z.string().optional(), // YYYY-MM-DD
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }
  const d = parsed.data;
  const def = findMarker(d.markerKey);
  const marker = await prisma.bloodMarker.create({
    data: {
      userId,
      markerKey: d.markerKey,
      name: d.name || def?.name || d.markerKey,
      value: d.value,
      unit: d.unit || def?.unit || "",
      panelDate: d.panelDate ? new Date(d.panelDate) : new Date(),
    },
  });
  return NextResponse.json({ marker }, { status: 201 });
}

const delSchema = z.object({ id: z.string() });
export async function DELETE(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = delSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  await prisma.bloodMarker.deleteMany({ where: { id: parsed.data.id, userId } });
  return NextResponse.json({ ok: true });
}
