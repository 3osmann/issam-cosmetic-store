import { db } from "./lib/db";
import { eq } from "drizzle-orm";
import {
  users, categories, products, blogPosts, banners, testimonials, brands, siteSettings,
} from "./lib/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(products);
  await db.delete(categories);
  await db.delete(blogPosts);
  await db.delete(banners);
  await db.delete(testimonials);
  await db.delete(brands);
  await db.delete(siteSettings);
  await db.delete(users);

  // Admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await db.insert(users).values({
    name: "Admin",
    email: "admin@beautycosmetic.com",
    password: hashedPassword,
    role: "admin",
  });

  // Categories
  const catData = [
    { name: "Hair care", slug: "hair_care", image: "/images/hair-care.png" },
    { name: "Skin care", slug: "skin_care", image: "/images/skin-care.png" },
    { name: "Lip stick", slug: "lip_stick", image: "/images/lip-stick.png" },
    { name: "Face Pack", slug: "face_pack", image: "/images/face-pack.png" },
    { name: "Blusher", slug: "blusher", image: "/images/blusher.png" },
    { name: "Natural", slug: "natural", image: "/images/natural.png" },
    { name: "Body Care", slug: "body_care", image: "/images/body-care.png" },
    { name: "Cheeks", slug: "cheeks", image: "/images/cheeks.png" },
    { name: "Eyes", slug: "eyes", image: "/images/eyes.png" },
    { name: "Nails", slug: "nails", image: "/images/nails.png" },
  ];

  await db.insert(categories).values(catData);
  console.log(`Inserted ${catData.length} categories`);

  // Build category lookup
  const allCats = await db.select().from(categories);
  const catMap = new Map(allCats.map((c) => [c.slug, c.id]));

  // Products
  const productData = [
    { name: "Nivea Cocoa Nourish", slug: "nivea-cocoa-nourish", image: "/images/nivea-cocoa-nourish.png", price: 65.01, salePrice: 49.01, bgColor: "#AC5004", categorySlug: "hair_care", isBestSeller: true },
    { name: "Pantene Pro-V shampoo", slug: "pantene-pro-v-shampoo", image: "/images/pantene-pro-v-shampoo.png", price: 65.01, salePrice: 49.01, bgColor: "#D44C64", categorySlug: "hair_care", isBestSeller: true, isNewArrival: true },
    { name: "Charmacy CMC matte Foundation", slug: "charmacy-cmc-matte-foundation", image: "/images/deal-pro4.png", price: 65.01, salePrice: 49.01, bgColor: "#C9A88C", categorySlug: "face_pack", isBestSeller: true },
    { name: "Dove Mens Dandruff Lotion", slug: "dove-mens-dandruff-lotion", image: "/images/dove-mens-dandruff-lotion-hair.png", price: 65.01, salePrice: 49.01, bgColor: "#595D5F", categorySlug: "hair_care", isBestSeller: true, isNewArrival: true },
    { name: "Maybelline BB Cream", slug: "maybelline-bb-cream", image: "/images/maybelline-bb-cream-foundation.png", price: 65.01, salePrice: 49.01, bgColor: "#EFCAA2", categorySlug: "skin_care", isBestSeller: true },
    { name: "Lotion Cleanser Toner", slug: "lotion-cleanser-toner", image: "/images/lotion-cleanser-toner.png", price: 65.01, salePrice: 49.01, bgColor: "#595D5F", categorySlug: "skin_care", isBestSeller: true },
    { name: "Chaiceness Herbal Extract", slug: "chaiceness-herbal-extract", image: "/images/chaiceness-plant-herbal-extract.png", price: 65.01, salePrice: 49.01, bgColor: "#FFB2B2", categorySlug: "natural", isBestSeller: true },
    { name: "Pellentesque posuere purus", slug: "pellentesque-posuere-purus", image: "/images/pellentesque-posuere-purus-in-lacus.png", price: 65.01, salePrice: 49.01, bgColor: "#FFB2B2", categorySlug: "natural", isBestSeller: true, isNewArrival: true },
    { name: "Cocooil Organic coconut Oil", slug: "cocooil-organic-coconut-oil", image: "/images/deal-pro6.png", price: 65.01, salePrice: 49.01, bgColor: "#AC5004", categorySlug: "natural", isNewArrival: true },
    { name: "E.L.F putty blush caribbean", slug: "elf-putty-blush-caribbean", image: "/images/deal-pro5.png", price: 65.01, salePrice: 49.01, bgColor: "#D44C64", categorySlug: "blusher" },
    { name: "Anny Nourishing Nail Polish", slug: "anny-nourishing-nail-polish", image: "/images/deal-pro3.png", price: 65.01, salePrice: 49.01, bgColor: "#C9A88C", categorySlug: "nails", isBestSeller: true },
    { name: "E.L.F Hydrating face Primer", slug: "elf-hydrating-face-primer", image: "/images/deal-pro2.png", price: 65.01, salePrice: 49.01, bgColor: "#595D5F", categorySlug: "skin_care" },
    { name: "Pond's White Beauty face wash", slug: "ponds-white-beauty-face-wash", image: "/images/ponds-white-beauty-face-wash.png", price: 65.01, salePrice: 49.01, bgColor: "#FFB2B2", categorySlug: "skin_care", isBestSeller: true, isNewArrival: true },
    { name: "Loreal Hairstyling product", slug: "loreal-hairstyling-product", image: "/images/loreal-hairstyling-product.png", price: 65.01, salePrice: 49.01, bgColor: "#7A4A2C", categorySlug: "hair_care", isNewArrival: true },
    { name: "Head And Shoulders Shampoo", slug: "head-and-shoulders-shampoo", image: "/images/head-and-shoulders-classic-clean-shampoo.png", price: 65.01, salePrice: 49.01, bgColor: "#FFB2B2", categorySlug: "hair_care", isNewArrival: true },
    { name: "Laneige Sunscreen Toner", slug: "laneige-sunscreen-toner", image: "/images/laneige-sunscreen-skin-toner.png", price: 65.01, salePrice: 49.01, bgColor: "#D68A8F", categorySlug: "skin_care", isNewArrival: true },
    { name: "Vaseline Intensive Care", slug: "vaseline-intensive-care", image: "/images/vaseline-intensive-care.png", price: 65.01, salePrice: 49.01, bgColor: "#5DCA56", categorySlug: "body_care", isBestSeller: true, isNewArrival: true },
    { name: "Lakme MAC Cosmetics Eye Shadow", slug: "lakme-mac-cosmetics-eye-shadow", image: "/images/lakme-cosmetics-eye-liner.png", price: 65.01, salePrice: 49.01, bgColor: "#AC5004", categorySlug: "eyes", isBestSeller: true },
    { name: "CC Foaming Face", slug: "cc-foaming-face", image: "/images/face-pack.png", price: 65.01, salePrice: 49.01, bgColor: "#FFB2B2", categorySlug: "face_pack", isBestSeller: true },
  ];

  const productValues = productData.map((p) => ({
    name: p.name,
    slug: p.slug,
    price: String(p.price),
    salePrice: String(p.salePrice),
    image: p.image,
    bgColor: p.bgColor,
    categoryId: catMap.get(p.categorySlug) || null,
    stock: 50,
    rating: "4.5",
    reviews: Math.floor(Math.random() * 100) + 10,
    isNewArrival: p.isNewArrival || false,
    isBestSeller: p.isBestSeller || false,
  }));

  await db.insert(products).values(productValues);
  console.log(`Inserted ${productData.length} products`);

  // Blog posts
  const blogData = [
    {
      title: "5 Reasons Why Regular Manicures and Pedicures Are Essential for Your Health",
      slug: "reasons-why-regular-manicures-and-pedicures",
      image: "/images/Image.png",
      author: "Magnifico_admin",
      excerpt: "Regular manicures and pedicures are not just about aesthetics; they play a crucial role in maintaining overall health. From improving blood circulation to preventing nail infections.",
      content: "Regular manicures and pedicures are not just about aesthetics; they play a crucial role in maintaining overall health. From improving blood circulation to preventing nail infections, here are five compelling reasons to make them a part of your self-care routine.",
    },
    {
      title: "The Power of Detox: How a Sauna Session Can Revitalize Your Body",
      slug: "power-of-detox-sauna-session",
      image: "/images/Image-1.png",
      author: "Magnifico_admin",
      excerpt: "Sauna sessions have been used for centuries to promote relaxation and detoxification. In this post, we explore how regular sauna use can help flush out toxins and improve cardiovascular health.",
      content: "Sauna sessions have been used for centuries to promote relaxation and detoxification. In this post, we explore how regular sauna use can help flush out toxins, improve cardiovascular health, and leave you feeling rejuvenated.",
    },
    {
      title: "The Secret to Glowing Skin: How Facials Transform Your Beauty Routine",
      slug: "secret-to-glowing-skin-facials",
      image: "/images/Image-2.png",
      author: "Magnifico_admin",
      excerpt: "Facials are more than just a luxurious treat; they are essential for maintaining healthy, glowing skin. Learn about the different types of facials and how they can address specific skin concerns.",
      content: "Facials are more than just a luxurious treat; they are essential for maintaining healthy, glowing skin. Learn about the different types of facials and how they can address specific skin concerns.",
    },
  ];

  await db.insert(blogPosts).values(blogData);
  console.log(`Inserted ${blogData.length} blog posts`);

  // Banners
  const bannerData = [
    { title: "Summer Glow Collection", subtitle: "Discover the perfect summer glow with our new collection of natural beauty products", image: "/images/slide2.jpg", btnText: "Shop Now", link: "/products", order: 0, active: true },
    { title: "Premium Skin Care", subtitle: "Experience luxury skincare with our premium range of organic products", image: "/images/slide1.jpg", btnText: "Shop Now", link: "/products", order: 1, active: true },
    { title: "New Arrivals", subtitle: "Check out the latest trends in beauty and cosmetics", image: "/images/slide3.jpg", btnText: "Explore", link: "/products", order: 2, active: true },
  ];
  await db.insert(banners).values(bannerData);
  console.log(`Inserted ${bannerData.length} banners`);

  // Testimonials
  const testimonialData = [
    { name: "Sarah Johnson", role: "Beauty Enthusiast", text: "I absolutely love this shop! The quality of their products is outstanding and the customer service is top-notch. I've been a loyal customer for over a year now.", rating: 5, image: "/images/testimonial-1.png", active: true },
    { name: "Emily Davis", role: "Makeup Artist", text: "As a professional makeup artist, I rely on high-quality products. This store never disappoints. Their range of cosmetics is incredible and the prices are very reasonable.", rating: 5, image: "/images/testimonial-2.png", active: true },
    { name: "Jessica Williams", role: "Skincare Blogger", text: "I've tried many skincare products but nothing compares to the quality I found here. My skin has never looked better. Highly recommended to everyone!", rating: 5, image: "/images/testimonial-3.png", active: true },
  ];
  await db.insert(testimonials).values(testimonialData);
  console.log(`Inserted ${testimonialData.length} testimonials`);

  // Brands
  const brandData = [
    { name: "L'Oréal", image: "/images/brand-1.png", link: "#", order: 0, active: true },
    { name: "Maybelline", image: "/images/brand-2.png", link: "#", order: 1, active: true },
    { name: "Nivea", image: "/images/brand-3.png", link: "#", order: 2, active: true },
    { name: "P&G", image: "/images/brand-4.png", link: "#", order: 3, active: true },
    { name: "Estée Lauder", image: "/images/brand-5.png", link: "#", order: 4, active: true },
  ];
  await db.insert(brands).values(brandData);
  console.log(`Inserted ${brandData.length} brands`);

  // Site settings
  const settingsData = [
    {
      key: "site_info",
      value: {
        name: "Magnifico",
        tagline: "Your Premium Beauty Destination",
        email: "info@magnifico.com",
        phone: "+1 (555) 123-4567",
        address: "123 Beauty Street, Fashion City, NY 10001",
      },
    },
    {
      key: "social_links",
      value: {
        facebook: "https://facebook.com/magnifico",
        instagram: "https://instagram.com/magnifico",
        twitter: "https://twitter.com/magnifico",
        youtube: "https://youtube.com/@magnifico",
      },
    },
    {
      key: "homepage_sections",
      value: {
        showHero: true,
        showCategories: true,
        showBestSellers: true,
        showNewArrivals: true,
        showBanners: true,
        showTestimonials: true,
        showBrands: true,
        showBlog: true,
      },
    },
  ];
  await db.insert(siteSettings).values(settingsData);
  console.log(`Inserted ${settingsData.length} site settings`);

  console.log("Seed completed successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
