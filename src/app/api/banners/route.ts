import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { banners } from "@/lib/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const allBanners = await db.select().from(banners).orderBy(asc(banners.order));
  return NextResponse.json(allBanners);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, subtitle, image, link, btnText, order, active } = body;
  const created = await db.insert(banners).values({ title, subtitle, image, link, btnText, order, active }).returning();
  return NextResponse.json(created[0], { status: 201 });
}
