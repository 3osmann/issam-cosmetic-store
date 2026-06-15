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
  try {
    const body = await request.json();
    let { name, image, link, order, active } = body;
    if (image && typeof image === "string" && image.startsWith("data:")) {
      image = await saveBase64Image(image);
    }
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    const created = await db.insert(brands).values({ name, image: image || "", link, order, active }).returning();
    return NextResponse.json(created[0], { status: 201 });
  } catch (error: any) {
    console.error("POST brand error:", error);
    return NextResponse.json({ error: error.message || "Failed to create brand" }, { status: 500 });
  }
}
