import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stories } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { saveBase64Image } from "@/lib/upload";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await db.select().from(stories).where(eq(stories.id, Number(id))).limit(1);
  if (!item.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item[0]);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    let { type, content, duration, link, active } = body;
    if (type === "image" && content && typeof content === "string" && content.startsWith("data:")) {
      content = await saveBase64Image(content);
    }
    const days = Math.max(1, Math.min(3, Number(duration) || 1));
    const now = new Date();
    const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const updated = await db
      .update(stories)
      .set({
        type: type || "image",
        content: content || "",
        duration: days,
        link,
        active: active !== false,
        expiresAt,
      })
      .where(eq(stories.id, Number(id)))
      .returning();
    if (!updated.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    console.error("PUT story error:", error);
    return NextResponse.json({ error: error.message || "Failed to update story" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = await db.delete(stories).where(eq(stories.id, Number(id))).returning();
  if (!deleted.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(deleted[0]);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await db.select().from(stories).where(eq(stories.id, Number(id))).limit(1);
    if (!item.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const now = new Date();
    const expiresAt = new Date(now.getTime() + item[0].duration * 24 * 60 * 60 * 1000);
    const updated = await db
      .update(stories)
      .set({ expiresAt, active: true })
      .where(eq(stories.id, Number(id)))
      .returning();
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    console.error("POST story repost error:", error);
    return NextResponse.json({ error: error.message || "Failed to repost story" }, { status: 500 });
  }
}
