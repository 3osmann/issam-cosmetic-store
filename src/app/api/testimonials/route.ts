import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const all = await db.select().from(testimonials).orderBy(desc(testimonials.id));
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, role, text, image, rating } = body;
  const created = await db.insert(testimonials).values({ name, role, text, image, rating }).returning();
  return NextResponse.json(created[0], { status: 201 });
}
