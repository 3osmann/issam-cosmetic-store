import { db } from "@/lib/db";
import { seoSettings } from "@/lib/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const settings = await db.select().from(seoSettings).orderBy(seoSettings.page);
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch SEO settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, page, title, description, ogImage, keywords } = body;

    if (!page) {
      return NextResponse.json({ error: "Page is required" }, { status: 400 });
    }

    const existing = await db.select().from(seoSettings).where(eq(seoSettings.page, page)).limit(1);

    let result;
    if (existing.length > 0) {
      result = await db.update(seoSettings).set({
        title: title || null,
        description: description || null,
        ogImage: ogImage || null,
        keywords: keywords || null,
        updatedAt: new Date(),
      }).where(eq(seoSettings.id, existing[0].id)).returning();
    } else {
      result = await db.insert(seoSettings).values({
        page,
        title: title || null,
        description: description || null,
        ogImage: ogImage || null,
        keywords: keywords || null,
      }).returning();
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save SEO settings" }, { status: 500 });
  }
}
