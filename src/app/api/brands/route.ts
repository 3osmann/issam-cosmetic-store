import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { brands } from "@/lib/schema";
import { asc } from "drizzle-orm";
import { saveBase64Image } from "@/lib/upload";

export const runtime = "nodejs";

export async function GET() {
  const all = await db.select().from(brands).orderBy(asc(brands.order));
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const body = await request.json();
  let { name, image, link, order, active } = body;
  if (image && typeof image === "string" && image.startsWith("data:")) {
    image = await saveBase64Image(image);
  }
  const created = await db.insert(brands).values({ name, image, link, order, active }).returning();
  return NextResponse.json(created[0], { status: 201 });
}
