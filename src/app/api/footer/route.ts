import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

const KEY = "footer";

const defaults = {
  logo: "/images/logo(1).png",
  aboutText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
  phoneNumber: "(025) 3686 25 16",
  email: "info@beautycosmetic.com",
  address: "123 Beauty Street, New York, NY 10001",
  featureBoxes: [
    { title: "FREE SHIPPING OVER $99" },
    { title: "30 DAYS MONEY BACK" },
    { title: "100% SECURE PAYMENT" },
    { title: "24/7 DEDICATED SUPPORT" },
  ],
  linkGroups: [
    {
      heading: "Top Categories",
      links: [
        { label: "Hair Care", href: "/shop?category=hair_care" },
        { label: "Skin Care", href: "/shop?category=skin_care" },
        { label: "Lip Stick", href: "/shop?category=lip_stick" },
        { label: "Face Pack", href: "/shop?category=face_pack" },
        { label: "Blusher", href: "/shop?category=blusher" },
        { label: "Natural", href: "/shop?category=natural" },
        { label: "Body Care", href: "/shop?category=body_care" },
        { label: "Cheeks", href: "/shop?category=cheeks" },
        { label: "Eyes", href: "/shop?category=eyes" },
        { label: "Nails", href: "/shop?category=nails" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Career", href: "/career" },
        { label: "Blog", href: "/blog" },
        { label: "Sitemap", href: "/sitemap" },
        { label: "Store Locations", href: "/store-locations" },
      ],
    },
    {
      heading: "Help Center",
      links: [
        { label: "Customer Service", href: "/customer-service" },
        { label: "Policy", href: "/policy" },
        { label: "Terms", href: "/terms" },
        { label: "Order Tracking", href: "/order-tracking" },
        { label: "FAQs", href: "/faqs" },
        { label: "My Account", href: "/my-account" },
        { label: "Product Support", href: "/product-support" },
      ],
    },
    {
      heading: "Partner",
      links: [
        { label: "Become Seller", href: "/become-seller" },
        { label: "Affiliate", href: "/affiliate" },
        { label: "Advertise", href: "/advertise" },
        { label: "Partnership", href: "/partnership" },
        { label: "Buy Now", href: "/shop" },
      ],
    },
  ],
  socialLinks: {
    twitter: "#",
    instagram: "#",
    facebook: "#",
    youtube: "#",
    linkedin: "#",
  },
  copyright: "© 2026 Cosmetic Store. All rights reserved.",
  paymentIcons: ["/images/pay1.png", "/images/pay2.png", "/images/pay3.png", "/images/pay4.png", "/images/pay5.png"],
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
    return NextResponse.json({ error: "Failed to save footer settings" }, { status: 500 });
  }
}
