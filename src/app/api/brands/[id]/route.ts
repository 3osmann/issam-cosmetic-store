import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { brands } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { saveBase64Image } from "@/lib/upload";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await db.select().from(brands).where(eq(brands.id, Number(id))).limit(1);
  if (!item.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item[0]);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  let { name, image, link, order, active } = body;
  if (image && typeof image === "string" && image.startsWith("data:")) {
    image = await saveBase64Image(image);
  }
  const updated = await db.update(brands).set({ name, image, link, order, active }).where(eq(brands.id, Number(id))).returning();
  if (!updated.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated[0]);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = await db.delete(brands).where(eq(brands.id, Number(id))).returning();
  if (!deleted.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(deleted[0]);
}
