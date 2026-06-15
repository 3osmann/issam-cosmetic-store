import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stories, storyItems } from "@/lib/schema";
import { desc, eq, inArray, and, gte } from "drizzle-orm";
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

export async function GET() {
  const now = new Date();
  const all = await db.select().from(stories).orderBy(desc(stories.createdAt));
  if (!all.length) return NextResponse.json([]);
  const allItems = await db.select().from(storyItems)
    .where(inArray(storyItems.storyId, all.map(s => s.id)))
    .orderBy(storyItems.sortOrder);
  const itemsByStory: Record<number, typeof allItems> = {};
  for (const item of allItems) {
    if (!itemsByStory[item.storyId]) itemsByStory[item.storyId] = [];
    itemsByStory[item.storyId].push(item);
  }
  const mapped = all.map((s) => ({
    ...s,
    items: itemsByStory[s.id] || [],
    expired: new Date(s.expiresAt) < now,
  }));
  return NextResponse.json(mapped);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { type, content, caption, duration, link, active, items } = body;
    if (caption === "") caption = null;
    if (link === "") link = null;
    const days = Math.max(1, Math.min(3, Number(duration) || 1));
    const now = new Date();
    const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    if (items && Array.isArray(items)) {
      for (const item of items) {
        if (item.caption === "") item.caption = null;
        item.content = await processContent(item.content);
      }
      if (!items.length) return NextResponse.json({ error: "At least one item is required" }, { status: 400 });
      const captionFallback = items[0].type === "text" ? items[0].content : (items[0].caption || null);
      const [story] = await db.insert(stories).values({
        type: items[0].type || "image",
        content: items[0].content,
        caption: captionFallback,
        duration: days,
        link,
        active: active !== false,
        expiresAt,
      }).returning();
      for (let i = 0; i < items.length; i++) {
        await db.insert(storyItems).values({
          storyId: story.id,
          type: items[i].type || "image",
          content: items[i].content,
          caption: items[i].caption || null,
          sortOrder: i,
        });
      }
      const created = await db.select().from(stories).where(eq(stories.id, story.id)).limit(1);
      const storyItemsRows = await db.select().from(storyItems).where(eq(storyItems.storyId, story.id)).orderBy(storyItems.sortOrder);
      return NextResponse.json({ ...created[0], items: storyItemsRows }, { status: 201 });
    }
    if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });
    content = await processContent(content);
    const created = await db.insert(stories).values({
      type: type || "image",
      content,
      caption,
      duration: days,
      link,
      active: active !== false,
      expiresAt,
    }).returning();
    await db.insert(storyItems).values({
      storyId: created[0].id,
      type: type || "image",
      content,
      caption,
      sortOrder: 0,
    });
    return NextResponse.json({ ...created[0], items: [{ type: type || "image", content, caption }] }, { status: 201 });
  } catch (error: any) {
    console.error("POST story error:", error);
    return NextResponse.json({ error: error.message || "Failed to create story" }, { status: 500 });
  }
}
