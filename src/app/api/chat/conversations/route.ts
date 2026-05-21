import { db } from "@/lib/db";
import { chatMessages } from "@/lib/schema";
import { NextResponse } from "next/server";
import { sql, desc } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.execute(sql`
      SELECT 
        customer_id,
        customer_name,
        customer_email,
        COUNT(*)::int as total_messages,
        COUNT(*) FILTER (WHERE is_admin = false AND read = false)::int as unread,
        MAX(created_at) as last_message_at,
        (SELECT message FROM chat_messages cm2 WHERE cm2.customer_id = chat_messages.customer_id ORDER BY created_at DESC LIMIT 1) as last_message
      FROM chat_messages
      GROUP BY customer_id, customer_name, customer_email
      ORDER BY MAX(created_at) DESC
    `);
    return NextResponse.json(result.rows || []);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}
