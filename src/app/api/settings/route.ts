import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const all = await db.select().from(siteSettings);
  const obj: Record<string, unknown> = {};
  for (const row of all) {
    obj[row.key] = row.value;
  }
  return NextResponse.json(obj);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { key, value } = body;
  const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  if (existing.length) {
    const updated = await db.update(siteSettings).set({ value }).where(eq(siteSettings.key, key)).returning();
    return NextResponse.json(updated[0]);
  }
  const created = await db.insert(siteSettings).values({ key, value }).returning();
  return NextResponse.json(created[0], { status: 201 });
}
