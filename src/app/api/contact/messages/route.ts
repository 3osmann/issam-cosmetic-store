import { db } from "@/lib/db";
import { contactMessages } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const messages = await db.query.contactMessages.findMany({
      orderBy: desc(contactMessages.createdAt),
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
