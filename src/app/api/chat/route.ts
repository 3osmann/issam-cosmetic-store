import { db } from "@/lib/db";
import { chatMessages } from "@/lib/schema";
import { NextResponse } from "next/server";
import { eq, desc, and } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    if (!customerId) {
      return NextResponse.json({ error: "customerId required" }, { status: 400 });
    }
    const messages = await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.customerId, customerId))
      .orderBy(chatMessages.createdAt);
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, customerName, customerEmail, message } = body;
    if (!customerId || !message) {
      return NextResponse.json({ error: "customerId and message required" }, { status: 400 });
    }
    const result = await db.insert(chatMessages).values({
      customerId,
      customerName: customerName || "Visitor",
      customerEmail: customerEmail || null,
      message,
      isAdmin: false,
      read: false,
    }).returning();
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
