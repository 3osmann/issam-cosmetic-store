import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories, banners, products, testimonials, brands, blogPosts } from "@/lib/schema";
import { asc, desc } from "drizzle-orm";

function formatProduct(p: any) {
  return {
    name: p.name,
    image: p.image,
    price: parseFloat(p.price),
    salePrice: p.salePrice ? parseFloat(p.salePrice) : null,
    bgColor: p.bgColor,
    slug: p.slug,
  };
}

export async function GET() {
  const [allCategories, allBanners, allProducts, allTestimonials, allBrands, allBlogPosts] = await Promise.all([
    db.select().from(categories),
    db.select().from(banners).orderBy(asc(banners.order)),
    db.select().from(products),
    db.select().from(testimonials),
    db.select().from(brands),
    db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt)).limit(3),
  ]);

  const bestSellers = allProducts.filter((p) => p.isBestSeller).slice(0, 8).map(formatProduct);
  const newArrivals = allProducts.filter((p) => p.isNewArrival).slice(0, 8).map(formatProduct);
  const deals = allProducts.slice(0, 6).map(formatProduct);

  const data = {
    categories: allCategories.map((c) => ({ name: c.name, image: c.image, slug: c.slug })),
    banners: allBanners.map((b) => ({
      title: b.title,
      subtitle: b.subtitle,
      image: b.image,
      link: b.link,
      btnText: b.btnText,
    })),
    bestSellers,
    newArrivals,
    deals,
    testimonials: allTestimonials.map((t) => ({
      name: t.name,
      role: t.role,
      image: t.image,
      text: t.text,
      rating: t.rating,
    })),
    brands: allBrands.map((b) => ({ name: b.name, image: b.image, link: b.link })),
    blogPosts: allBlogPosts.map((p) => ({
      title: p.title,
      slug: p.slug,
      image: p.image,
      author: p.author,
      publishedAt: p.publishedAt,
      excerpt: p.excerpt,
    })),
  };

  return NextResponse.json(data);
}
