import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const bestSeller = searchParams.get("bestSeller");
  const newArrival = searchParams.get("newArrival");

  try {
    let conditions = [];
    if (featured === "true") conditions.push(eq(products.isFeatured, true));
    if (bestSeller === "true") conditions.push(eq(products.isBestSeller, true));
    if (newArrival === "true") conditions.push(eq(products.isNewArrival, true));

    let result;
    if (conditions.length > 0) {
      result = await db.select().from(products).where(conditions[0]);
    } else {
      result = await db.select().from(products);
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await db.insert(products).values(body).returning();
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
