import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, Number(id)))
    .limit(1);
  if (!result.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const product = result[0];
  let categoryName = "";
  if (product.categoryId) {
    const cat = await db.select().from(categories).where(eq(categories.id, product.categoryId)).limit(1);
    if (cat.length) categoryName = cat[0].name;
  }
  return NextResponse.json({ ...product, categoryName });
}
