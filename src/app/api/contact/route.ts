import { db } from "@/lib/db";
import { contactMessages } from "@/lib/schema";
import { NextResponse } from "next/server";
import { sendMail, logoCids } from "@/lib/mail";
import { sendWhatsApp } from "@/lib/whatsapp";

function emailLayout(content: string, title: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
  .logo-light { display:block !important; }
  .logo-dark { display:none !important; }
  @media (prefers-color-scheme:dark) {
    .logo-light { display:none !important; }
    .logo-dark { display:block !important; }
    .email-body { background-color:#1a1a1a !important; }
    .email-card { background-color:#2d2d2d !important; }
    .email-content { color:#e0e0e0 !important; }
    .email-label { color:#aaa !important; }
    .email-field { background-color:#383838 !important; }
    .email-field p { color:#e0e0e0 !important; }
    .email-footer { border-top-color:#444 !important; }
  }
</style></head>
<body class="email-body" style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table class="email-card" role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        <tr>
          <td style="background:linear-gradient(135deg,#d63384,#e83e8c);padding:40px 40px 30px;text-align:center;">
            <img class="logo-light" src="cid:${logoCids.light}" alt="Beauty Cosmetic Store" style="height:48px;width:auto;border:0;display:block;margin:0 auto;" />
            <img class="logo-dark" src="cid:${logoCids.dark}" alt="Beauty Cosmetic Store" style="height:48px;width:auto;border:0;display:none;margin:0 auto;" />
            <h1 style="color:#ffffff;font-size:22px;font-weight:600;margin:16px 0 0;letter-spacing:-0.3px;">${title}</h1>
          </td>
        </tr>
        <tr><td class="email-content" style="padding:32px 40px 24px;color:#333333;font-size:15px;line-height:1.6;">
          ${content}
        </td></tr>
        <tr>
          <td class="email-footer" style="padding:24px 40px 32px;border-top:1px solid #eeeeee;text-align:center;">
            <p style="margin:0 0 6px;font-size:13px;color:#999999;">&copy; ${new Date().getFullYear()} Beauty Cosmetic Store. All rights reserved.</p>
            <p style="margin:0;font-size:13px;color:#999999;">This is an automated message, please do not reply directly.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function adminEmailContent(name: string, email: string, subject: string, message: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr><td style="padding:12px 16px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;">
        <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Name</p>
        <p style="margin:0;font-size:15px;color:#333;font-weight:500;">${name}</p>
      </td></tr>
      <tr><td style="padding:12px 16px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;">
        <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Email</p>
        <p style="margin:0;font-size:15px;color:#333;font-weight:500;"><a href="mailto:${email}" style="color:#d63384;text-decoration:none;">${email}</a></p>
      </td></tr>
      <tr><td style="padding:12px 16px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;">
        <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Subject</p>
        <p style="margin:0;font-size:15px;color:#333;font-weight:500;">${subject || "N/A"}</p>
      </td></tr>
      <tr><td style="padding:16px;background:#f8f9fa;border-radius:8px;">
        <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
        <p style="margin:0;font-size:15px;color:#333;line-height:1.7;">${message}</p>
      </td></tr>
    </table>
    <div style="margin-top:16px;padding:16px 20px;background:#fff3f8;border-radius:8px;border-left:4px solid #d63384;">
      <p style="margin:0;font-size:14px;color:#666;">Reply to this message from the admin dashboard.</p>
    </div>
  `;
}

function userAutoReplyContent(name: string, message: string) {
  return `
    <p style="margin:0 0 20px;font-size:16px;">Dear <strong>${name}</strong>,</p>
    <p style="margin:0 0 16px;color:#555;">Thank you for reaching out to <strong>Beauty Cosmetic Store</strong>!</p>
    <p style="margin:0 0 20px;color:#555;">We have received your message and our team will get back to you within 24 hours. For urgent inquiries, please contact us directly via phone.</p>
    <div style="padding:16px 20px;background:#f8f9fa;border-radius:8px;margin-bottom:20px;">
      <p style="margin:0 0 6px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Your Message</p>
      <p style="margin:0;font-size:14px;color:#555;line-height:1.6;font-style:italic;">"${message}"</p>
    </div>
    <div style="margin:24px 0;padding:16px 20px;background:#fff3f8;border-radius:8px;border-left:4px solid #d63384;">
      <p style="margin:0 0 4px;font-size:14px;color:#d63384;font-weight:600;">Need help right away?</p>
      <p style="margin:0;font-size:14px;color:#666;">Visit our store or call us during business hours.</p>
    </div>
    <p style="margin:24px 0 0;color:#555;">Warm regards,</p>
    <p style="margin:4px 0 0;font-size:16px;color:#d63384;font-weight:600;">Beauty Cosmetic Store Team</p>
  `;
}

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
      const escapedName = body.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const escapedEmail = body.email.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const escapedSubject = (body.subject || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const escapedMessage = body.message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

      await sendMail({
        to: process.env.MAIL_FROM_ADDRESS || "",
        subject: `New Contact: ${escapedSubject || "No Subject"} - From ${escapedName}`,
        html: emailLayout(adminEmailContent(escapedName, escapedEmail, escapedSubject, escapedMessage), "New Contact Message"),
      });
      await sendMail({
        to: body.email,
        subject: `Thank you for contacting Beauty Cosmetic Store`,
        html: emailLayout(userAutoReplyContent(escapedName, escapedMessage), "We've Received Your Message"),
      });

      const adminPhone = process.env.WHATSAPP_ADMIN_NUMBER || "";
      if (adminPhone) {
        await sendWhatsApp({
          to: adminPhone,
          message:
            `📬 *New Contact Message*\n\n` +
            `👤 *Name:* ${escapedName}\n` +
            `📧 *Email:* ${escapedEmail}\n` +
            `📝 *Subject:* ${escapedSubject || "N/A"}\n\n` +
            `💬 *Message:*\n${escapedMessage}`,
        });
      }
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
    }

    return NextResponse.json(message[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
