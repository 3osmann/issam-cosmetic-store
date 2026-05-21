import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

const KEY = "header";

const defaults = {
  logo: "/images/logo.png",
  topbarText: "Free Shipping On Orders Over $99",
  shopNowLink: "/shop",
  hotlineText: "Hotline",
  phoneNumber: "(025) 3686 25 16",
  email: "info@beautycosmetic.com",
  navItems: [
    { label: "Home", href: "/", children: [] },
    { label: "Blog", href: "/blog", children: [
      { label: "Blog With Left Sidebar", href: "/blog?sidebar=left" },
      { label: "Blog With Right Sidebar", href: "/blog?sidebar=right" },
    ]},
    { label: "Pages", href: "/shop", children: [
      { label: "Page With Left Sidebar", href: "/shop?sidebar=left" },
      { label: "Page With Right Sidebar", href: "/shop?sidebar=right" },
      { label: "Cheeks", href: "/shop?category=cheeks" },
      { label: "Shop", href: "/shop" },
    ]},
    { label: "Contact", href: "/contact", children: [] },
    { label: "Buy Now", href: "/shop", children: [] },
  ],
  socialLinks: {
    twitter: "#",
    instagram: "#",
    facebook: "#",
    youtube: "#",
    linkedin: "#",
    google: "#",
  },
};

export async function GET() {
  try {
    const row = await db.select().from(siteSettings).where(eq(siteSettings.key, KEY)).limit(1);
    return NextResponse.json(row.length > 0 ? row[0].value : defaults);
  } catch {
    return NextResponse.json(defaults);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, KEY)).limit(1);
    if (existing.length > 0) {
      await db.update(siteSettings).set({ value: body, updatedAt: new Date() }).where(eq(siteSettings.key, KEY));
    } else {
      await db.insert(siteSettings).values({ key: KEY, value: body });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save header settings" }, { status: 500 });
  }
}
