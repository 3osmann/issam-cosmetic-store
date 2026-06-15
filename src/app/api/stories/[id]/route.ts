import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stories, storyItems } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { saveBase64Image } from "@/lib/upload";

export const runtime = "nodejs";

async function processContent(content: string) {
  if (!content || typeof content !== "string") return content;
  if (!content.startsWith("data:")) return content;
  if (content.startsWith("data:image")) {
    return await saveBase64Image(content);
  }
  if (content.startsWith("data:video")) {
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
        return `/uploads/${filename}`;
      } catch {
        const dir = path.join(os.tmpdir(), "uploads");
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, filename), buffer);
        return `/api/uploads/${filename}`;
      }
    }
  }
  return content;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [story] = await db.select().from(stories).where(eq(stories.id, Number(id))).limit(1);
  if (!story) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const items = await db.select().from(storyItems).where(eq(storyItems.storyId, story.id)).orderBy(storyItems.sortOrder);
  return NextResponse.json({ ...story, items });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await db.select().from(stories).where(eq(stories.id, Number(id))).limit(1);
    if (!existing.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await request.json();
    let { type, content, caption, duration, link, active, items } = body;
    if (caption === "") caption = null;
    if (link === "") link = null;
    const hasContent = content !== undefined;
    const hasType = type !== undefined;
    const hasDuration = duration !== undefined;
    const hasLink = link !== undefined;
    const hasActive = active !== undefined;
    const hasCaption = caption !== undefined;
    const hasItems = items !== undefined;
    if (hasItems && Array.isArray(items)) {
      for (const item of items) {
        if (item.caption === "") item.caption = null;
        item.content = await processContent(item.content);
      }
      const captionFallback = items[0]?.type === "text" ? items[0].content : (items[0]?.caption || null);
      const merged: Record<string, any> = {
        type: items[0]?.type || existing[0].type,
        content: items[0]?.content || existing[0].content,
        caption: captionFallback,
      };
      if (hasDuration) {
        const days = Math.max(1, Math.min(3, Number(duration) || 1));
        merged.duration = days;
        merged.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      }
      if (hasLink) merged.link = link;
      if (hasActive) merged.active = active;
      await db.update(stories).set(merged).where(eq(stories.id, Number(id)));
      await db.delete(storyItems).where(eq(storyItems.storyId, Number(id)));
      for (let i = 0; i < items.length; i++) {
        await db.insert(storyItems).values({
          storyId: Number(id),
          type: items[i].type || "image",
          content: items[i].content,
          caption: items[i].caption || null,
          sortOrder: i,
        });
      }
    } else {
      if (hasContent && content && typeof content === "string" && content.startsWith("data:")) {
        content = await processContent(content);
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
      if (!Object.keys(merged).length) {
        const resultItems = await db.select().from(storyItems).where(eq(storyItems.storyId, Number(id))).orderBy(storyItems.sortOrder);
        return NextResponse.json({ ...existing[0], items: resultItems });
      }
      await db.update(stories).set(merged as any).where(eq(stories.id, Number(id)));
    }
    const updated = await db.select().from(stories).where(eq(stories.id, Number(id))).limit(1);
    const resultItems = await db.select().from(storyItems).where(eq(storyItems.storyId, Number(id))).orderBy(storyItems.sortOrder);
    return NextResponse.json({ ...updated[0], items: resultItems });
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
    await db.update(stories).set({ expiresAt, active: true }).where(eq(stories.id, Number(id)));
    const updated = await db.select().from(stories).where(eq(stories.id, Number(id))).limit(1);
    const items = await db.select().from(storyItems).where(eq(storyItems.storyId, Number(id))).orderBy(storyItems.sortOrder);
    return NextResponse.json({ ...updated[0], items });
  } catch (error: any) {
    console.error("POST story repost error:", error);
    return NextResponse.json({ error: error.message || "Failed to repost story" }, { status: 500 });
  }
}
