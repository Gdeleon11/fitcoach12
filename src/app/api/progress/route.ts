import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { dateSchema } from "@/lib/date";

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const photos = await prisma.progressPhoto.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 60,
  });
  return NextResponse.json({ photos });
}

const schema = z.object({
  // data URL (image compressed client-side). Cap ~2MB to protect the DB.
  url: z.string().startsWith("data:image/").max(2_800_000),
  angle: z.enum(["FRONT", "SIDE", "BACK"]).optional(),
  date: dateSchema.optional(), // backdate to any day
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Imagen inválida o demasiado grande" }, { status: 400 });
  }
  const when = parsed.data.date ? new Date(`${parsed.data.date}T12:00:00Z`) : undefined;
  const photo = await prisma.progressPhoto.create({
    data: { userId, url: parsed.data.url, angle: parsed.data.angle ?? "FRONT", ...(when ? { date: when } : {}) },
  });
  return NextResponse.json({ photo }, { status: 201 });
}

const delSchema = z.object({ id: z.string() });

export async function DELETE(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = delSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  // Ensure ownership before deleting.
  await prisma.progressPhoto.deleteMany({ where: { id: parsed.data.id, userId } });
  return NextResponse.json({ ok: true });
}
