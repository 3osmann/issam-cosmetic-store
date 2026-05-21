import { db } from "@/lib/db";
import { chatMessages } from "@/lib/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updateData: Record<string, unknown> = {};
    if (body.read !== undefined) updateData.read = body.read;
    if (body.message !== undefined) updateData.message = body.message;
    if (body.isAdmin !== undefined) updateData.isAdmin = body.isAdmin;
    if (body.customerName !== undefined) updateData.customerName = body.customerName;
    const result = await db.update(chatMessages)
      .set(updateData)
      .where(eq(chatMessages.id, parseInt(id)))
      .returning();
    return NextResponse.json(result[0] || { error: "Not found" }, { status: result[0] ? 200 : 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(chatMessages).where(eq(chatMessages.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
