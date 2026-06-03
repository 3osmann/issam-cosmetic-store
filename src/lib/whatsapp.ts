export async function sendWhatsApp({ to, message }: { to: string; message: string }) {
  // WhatsApp Cloud API
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  if (phoneNumberId && accessToken) {
    const res = await fetch(
      `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message },
        }),
      }
    );
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`WhatsApp Cloud API error: ${err}`);
    }
    return;
  }

  // Development fallback
  console.log("[WhatsApp Notification]", { to, message });
}
