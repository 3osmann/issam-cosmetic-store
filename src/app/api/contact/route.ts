import { db } from "@/lib/db";
import { contactMessages } from "@/lib/schema";
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = await db.insert(contactMessages).values({
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
    }).returning();

    try {
      const adminHtml = `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Subject:</strong> ${body.subject || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${body.message}</p>
      `;
      await sendMail({
        to: process.env.MAIL_FROM_ADDRESS || "",
        subject: `New Contact: ${body.subject || "No Subject"} - From ${body.name}`,
        html: adminHtml,
      });
      await sendMail({
        to: body.email,
        subject: `Thank you for contacting Beauty Cosmetic Store`,
        html: `
          <h2>Thank You for Reaching Out!</h2>
          <p>Dear ${body.name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p><strong>Your Message:</strong></p>
          <p>${body.message}</p>
          <br>
          <p>Best regards,</p>
          <p><strong>Beauty Cosmetic Store Team</strong></p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
    }

    return NextResponse.json(message[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
