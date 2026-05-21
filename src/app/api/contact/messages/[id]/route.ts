import { db } from "@/lib/db";
import { contactMessages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { reply } = body;

    if (!reply) {
      return NextResponse.json({ error: "Reply is required" }, { status: 400 });
    }

    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, parseInt(id))).limit(1);

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    await db.update(contactMessages)
      .set({ reply, answered: true, answeredAt: new Date() })
      .where(eq(contactMessages.id, parseInt(id)));

    try {
      await sendMail({
        to: message.email,
        subject: `Re: ${message.subject || "Your inquiry"} - Beauty Cosmetic Store`,
        html: `
          <h2>Reply to Your Inquiry</h2>
          <p>Dear ${message.name},</p>
          <p>Thank you for contacting us. Here is our response:</p>
          <div style="padding: 16px; background: #f5f5f5; border-radius: 8px; margin: 16px 0;">
            <p>${reply}</p>
          </div>
          <p><strong>Your original message:</strong></p>
          <p style="color: #666;">${message.message}</p>
          <br>
          <p>Best regards,</p>
          <p><strong>Beauty Cosmetic Store Team</strong></p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send reply email:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
