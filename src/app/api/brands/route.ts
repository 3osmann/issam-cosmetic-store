import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { brands } from "@/lib/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const all = await db.select().from(brands).orderBy(asc(brands.order));
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, image, link, order } = body;
  const created = await db.insert(brands).values({ name, image, link, order }).returning();
  return NextResponse.json(created[0], { status: 201 });
}
