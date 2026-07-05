import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { SLOT_KEYS } from "@/lib/supplements";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const supplements = await prisma.supplement.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ supplements });
}

const slotEnum = z.enum(SLOT_KEYS as [string, ...string[]]);
const createSchema = z.object({
  name: z.string().min(1).max(80),
  dosage: z.string().max(40).optional(),
  slot: slotEnum.default("MORNING"),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal("")),
  notes: z.string().max(300).optional(),
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }
  const d = parsed.data;
  const supplement = await prisma.supplement.create({
    data: { userId, name: d.name, dosage: d.dosage || null, slot: d.slot, time: d.time || null, notes: d.notes || null },
  });
  return NextResponse.json({ supplement }, { status: 201 });
}

const patchSchema = z.object({
  id: z.string(),
  active: z.boolean().optional(),
  name: z.string().min(1).max(80).optional(),
  dosage: z.string().max(40).optional(),
  slot: slotEnum.optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal("")),
  notes: z.string().max(300).optional(),
});

export async function PATCH(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const { id, ...rest } = parsed.data;
  const data: Record<string, unknown> = { ...rest };
  if (rest.time === "") data.time = null;
  // Ownership-safe update.
  const res = await prisma.supplement.updateMany({ where: { id, userId }, data });
  if (res.count === 0) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

const delSchema = z.object({ id: z.string() });
export async function DELETE(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = delSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  await prisma.supplement.deleteMany({ where: { id: parsed.data.id, userId } });
  return NextResponse.json({ ok: true });
}
