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
    const existing = await db.select().from(stories).where(eq(stories.id, Number(id))).limit(1);
    if (!existing.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await request.json();
    let { type, content, caption, duration, link, active } = body;
    if (caption === "") caption = null;
    if (link === "") link = null;
    const hasContent = content !== undefined;
    const hasType = type !== undefined;
    const hasDuration = duration !== undefined;
    const hasLink = link !== undefined;
    const hasActive = active !== undefined;
    const hasCaption = caption !== undefined;
    if (hasContent && content && typeof content === "string" && content.startsWith("data:")) {
      if (content.startsWith("data:image")) {
        content = await saveBase64Image(content);
      } else if (content.startsWith("data:video")) {
        const matches = content.match(/^data:video\/(\w+);base64,(.+)$/);
        if (matches) {
          const ext = matches[1].replace("mp4", "mp4").replace("webm", "webm").replace("ogg", "ogv");
          const data = matches[2];
          const buffer = Buffer.from(data, "base64");
          const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
          const { writeFile, mkdir } = await import("fs/promises");
          const path = await import("path");
          const os = await import("os");
          try {
            const dir = path.join(process.cwd(), "public", "uploads");
            await mkdir(dir, { recursive: true });
            await writeFile(path.join(dir, filename), buffer);
            content = `/uploads/${filename}`;
          } catch {
            const dir = path.join(os.tmpdir(), "uploads");
            await mkdir(dir, { recursive: true });
            await writeFile(path.join(dir, filename), buffer);
            content = `/api/uploads/${filename}`;
          }
        }
      }
    }
    const now = new Date();
    const merged: Record<string, any> = {};
    if (hasType) merged.type = type || "image";
    if (hasContent) merged.content = content || "";
    if (hasCaption) merged.caption = caption || null;
    if (hasDuration) {
      const days = Math.max(1, Math.min(3, Number(duration) || 1));
      merged.duration = days;
      merged.expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    }
    if (hasLink) merged.link = link;
    if (hasActive) merged.active = active;
    if (!Object.keys(merged).length) return NextResponse.json(existing[0]);
    const updated = await db
      .update(stories)
      .set(merged as any)
      .where(eq(stories.id, Number(id)))
      .returning();
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
