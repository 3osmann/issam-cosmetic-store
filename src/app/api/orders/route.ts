import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/schema";
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

function adminOrderContent(order: { id: number; name: string; email: string; phone: string; total: string; street: string; city: string; state: string; zip: string; country: string; paymentMethod: string; items: { name: string; quantity: number; price: string }[] }) {
  const itemsHtml = order.items.map((item) =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;">${item.name} &times; ${item.quantity}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;text-align:right;">$${Number(item.price).toFixed(2)}</td></tr>`
  ).join("");
  return `
    <p style="margin:0 0 16px;font-size:16px;">New order <strong>#${order.id}</strong> has been placed.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <tr><td style="padding:12px 16px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;">
        <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Customer</p>
        <p style="margin:0;font-size:15px;color:#333;font-weight:500;">${order.name}</p>
      </td></tr>
      <tr><td style="padding:12px 16px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;">
        <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Email</p>
        <p style="margin:0;font-size:15px;color:#333;font-weight:500;">${order.email}</p>
      </td></tr>
      <tr><td style="padding:12px 16px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;">
        <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Phone</p>
        <p style="margin:0;font-size:15px;color:#333;font-weight:500;">${order.phone}</p>
      </td></tr>
      <tr><td style="padding:12px 16px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;">
        <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Shipping Address</p>
        <p style="margin:0;font-size:15px;color:#333;font-weight:500;">${order.street}, ${order.city}, ${order.state} ${order.zip}, ${order.country}</p>
      </td></tr>
      <tr><td style="padding:12px 16px;background:#f8f9fa;border-radius:8px;margin-bottom:8px;">
        <p style="margin:0 0 4px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Payment Method</p>
        <p style="margin:0;font-size:15px;color:#333;font-weight:500;text-transform:capitalize;">${order.paymentMethod}</p>
      </td></tr>
      <tr><td style="padding:16px;background:#f8f9fa;border-radius:8px;">
        <p style="margin:0 0 8px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Items</p>
        <table width="100%" cellpadding="0" cellspacing="0">${itemsHtml}</table>
        <div style="border-top:2px solid #d63384;margin-top:8px;padding-top:8px;text-align:right;font-size:16px;font-weight:700;color:#d63384;">Total: $${order.total}</div>
      </td></tr>
    </table>
  `;
}

export async function GET() {
  try {
    const result = await db.select().from(orders);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const order = await db.insert(orders).values({
      userId: body.userId,
      email: body.email,
      phone: body.phone,
      total: body.total,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      status: "pending",
    }).returning();

    if (body.items && body.items.length > 0) {
      await db.insert(orderItems).values(
        body.items.map((item: any) => ({
          orderId: order[0].id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        }))
      );
    }

    const adminEmail = process.env.MAIL_FROM_ADDRESS || "";
    const adminWhatsApp = process.env.WHATSAPP_ADMIN_NUMBER || "";
    const addr = body.shippingAddress || {};
    const items = body.items || [];

    try {
      const itemsHtml = items.map((i: any) =>
        `• ${i.name || `Product #${i.productId}`} × ${i.quantity} — $${Number(i.price).toFixed(2)}`
      ).join("\n");

      const orderSummary =
        `🛒 *New Order #${order[0].id}*\n\n` +
        `👤 *Customer:* ${addr.name || "N/A"}\n` +
        `📧 *Email:* ${body.email || "N/A"}\n` +
        `📞 *Phone:* ${body.phone || "N/A"}\n` +
        `📍 *Address:* ${addr.street || ""}, ${addr.city || ""}, ${addr.state || ""} ${addr.zip || ""}, ${addr.country || ""}\n` +
        `💳 *Payment:* ${body.paymentMethod || "N/A"}\n\n` +
        `*Items:*\n${itemsHtml}\n\n` +
        `💰 *Total: $${Number(body.total).toFixed(2)}*`;

      await Promise.allSettled([
        sendMail({
          to: adminEmail,
          subject: `New Order #${order[0].id} — $${Number(body.total).toFixed(2)}`,
          html: emailLayout(
            adminOrderContent({
              id: order[0].id,
              name: addr.name || "",
              email: body.email || "",
              phone: body.phone || "",
              total: Number(body.total).toFixed(2),
              street: addr.street || "",
              city: addr.city || "",
              state: addr.state || "",
              zip: addr.zip || "",
              country: addr.country || "",
              paymentMethod: body.paymentMethod || "",
              items: items.map((i: any) => ({
                name: i.name || `Product #${i.productId}`,
                quantity: i.quantity,
                price: Number(i.price).toFixed(2),
              })),
            }),
            "New Order Received"
          ),
        }),
        adminWhatsApp ? sendWhatsApp({ to: adminWhatsApp, message: orderSummary }) : Promise.resolve(),
      ]);
    } catch (notifError) {
      console.error("Failed to send notifications:", notifError);
    }

    return NextResponse.json(order[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
