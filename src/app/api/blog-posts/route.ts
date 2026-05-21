import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const all = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, slug, content, excerpt, image, author } = body;
  const created = await db.insert(blogPosts).values({ title, slug, content, excerpt, image, author }).returning();
  return NextResponse.json(created[0], { status: 201 });
}
