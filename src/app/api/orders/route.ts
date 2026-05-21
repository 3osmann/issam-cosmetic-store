import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/schema";
import { NextResponse } from "next/server";

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

    return NextResponse.json(order[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
