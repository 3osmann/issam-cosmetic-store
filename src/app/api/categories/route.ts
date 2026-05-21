import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/schema";

export async function GET() {
  const all = await db.select().from(categories);
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, slug, image, description } = body;
  const created = await db.insert(categories).values({ name, slug, image, description }).returning();
  return NextResponse.json(created[0], { status: 201 });
}
