import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

const SETTINGS_KEY = "homepage";

export async function GET() {
  try {
    const row = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, SETTINGS_KEY))
      .limit(1);

    const data = row.length > 0 ? row[0].value : {
      heroTitle: "",
      heroSubtitle: "",
      dealsHeading: "",
      featuredCategories: [],
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch homepage settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { heroTitle, heroSubtitle, dealsHeading, featuredCategories } = body;

    const existing = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, SETTINGS_KEY))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(siteSettings)
        .set({ value: { heroTitle, heroSubtitle, dealsHeading, featuredCategories }, updatedAt: new Date() })
        .where(eq(siteSettings.key, SETTINGS_KEY));
    } else {
      await db
        .insert(siteSettings)
        .values({ key: SETTINGS_KEY, value: { heroTitle, heroSubtitle, dealsHeading, featuredCategories } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save homepage settings" }, { status: 500 });
  }
}
