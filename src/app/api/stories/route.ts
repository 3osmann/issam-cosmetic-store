import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stories } from "@/lib/schema";
import { desc, and, eq, gte } from "drizzle-orm";
import { saveBase64Image } from "@/lib/upload";

export const runtime = "nodejs";

export async function GET() {
  const now = new Date();
  const all = await db.select().from(stories).orderBy(desc(stories.createdAt));
  const mapped = all.map((s) => ({
    ...s,
    expired: new Date(s.expiresAt) < now,
  }));
  return NextResponse.json(mapped);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { type, content, caption, duration, link, active } = body;
    if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });
    if (caption === "") caption = null;
    if (link === "") link = null;
    if (content && typeof content === "string" && content.startsWith("data:")) {
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
    const days = Math.max(1, Math.min(3, Number(duration) || 1));
    const now = new Date();
    const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const created = await db
      .insert(stories)
      .values({ type: type || "image", content, caption, duration: days, link, active: active !== false, expiresAt })
      .returning();
    return NextResponse.json(created[0], { status: 201 });
  } catch (error: any) {
    console.error("POST story error:", error);
    return NextResponse.json({ error: error.message || "Failed to create story" }, { status: 500 });
  }
}
