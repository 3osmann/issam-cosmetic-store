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
    let { type, content, duration, link, active } = body;
    if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });
    if (type === "image" && content && typeof content === "string" && content.startsWith("data:")) {
      content = await saveBase64Image(content);
    }
    const days = Math.max(1, Math.min(3, Number(duration) || 1));
    const now = new Date();
    const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const created = await db
      .insert(stories)
      .values({ type: type || "image", content, duration: days, link, active: active !== false, expiresAt })
      .returning();
    return NextResponse.json(created[0], { status: 201 });
  } catch (error: any) {
    console.error("POST story error:", error);
    return NextResponse.json({ error: error.message || "Failed to create story" }, { status: 500 });
  }
}
