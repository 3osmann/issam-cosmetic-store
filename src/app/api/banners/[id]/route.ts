import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { banners } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const banner = await db.select().from(banners).where(eq(banners.id, Number(id))).limit(1);
  if (!banner.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(banner[0]);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const updated = await db.update(banners).set(body).where(eq(banners.id, Number(id))).returning();
  if (!updated.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated[0]);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = await db.delete(banners).where(eq(banners.id, Number(id))).returning();
  if (!deleted.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(deleted[0]);
}
