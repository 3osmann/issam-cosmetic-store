"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import StoriesBar from "@/components/home/StoriesBar";
import { motion } from "framer-motion";

const instagramFeed = ["/images/insta1.png", "/images/insta2.png", "/images/insta3.png", "/images/insta4.png", "/images/insta5.png", "/images/insta6.png"];

const counters = [
  { value: 1, suffix: "+", label: "Products" },
  { value: 10, suffix: "+", label: "Active Years" },
  { value: 6, suffix: "", label: "Branches" },
  { value: 20, suffix: "K+", label: "Happy Customer" },
];

function Timer() {
  const [time, setTime] = useState({ days: 0, hours: 19, minutes: 24, seconds: 48 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) days = 0;
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <>
      <div className="timer-section">
        <span>{String(time.days).padStart(2, "0")}</span>
        <span>Days</span>
      </div>
      <div className="timer-section">
        <span>{String(time.hours).padStart(2, "0")}</span>
        <span>Hours</span>
      </div>
      <div className="timer-section">
        <span>{String(time.minutes).padStart(2, "0")}</span>
        <span>Minutes</span>
      </div>
      <div className="timer-section">
        <span>{String(time.seconds).padStart(2, "0")}</span>
        <span>Seconds</span>
      </div>
    </>
  );
}

const pageStyles = `
  .our_products-box, .trending_products-box { position: relative; }
  .products-image {
    position: relative !important;
    min-height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .product-bg-circle {
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    bottom: auto !important;
    right: auto !important;
    margin: 0 !important;
    width: 130px !important;
    height: 130px !important;
  }
  .products-image img {
    position: relative;
    z-index: 2;
    max-height: 150px;
    width: auto;
    object-fit: contain;
  }
  .best-wishlist-btn {
    position: absolute; top: 12px; right: 12px; z-index: 10;
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,255,255,0.9); border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
    opacity: 0;
  }
  .products-image:hover .best-wishlist-btn,
  .our_products-box:hover .best-wishlist-btn,
  .trending_products-box:hover .best-wishlist-btn { opacity: 1; }
  .best-wishlist-btn:hover { background: #FF5894; }
  .best-wishlist-btn:hover svg { stroke: #fff; }
  .banner-hero-row {
    --banner-height: 400px;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
  }
  .banner-hero-row > [class*="col-"] {
    display: flex;
    flex-direction: column;
  }
  .banner-hero-row .carousel {
    flex: 1;
    width: 100%;
    height: 100%;
    min-height: var(--banner-height);
    border-radius: 20px;
    overflow: hidden;
  }
  .banner-hero-row .carousel-inner {
    height: 100%;
    min-height: var(--banner-height);
  }
  .banner-hero-row .carousel-item {
    height: 100%;
    min-height: var(--banner-height);
  }
  .banner-hero-row .carousel-item img {
    height: var(--banner-height) !important;
    min-height: var(--banner-height) !important;
    width: 100% !important;
    object-fit: cover !important;
    border-radius: 20px;
    display: block;
  }
  .banner-hero-row .beauty-care-details {
    flex: 1;
    width: 100%;
    height: 100%;
    min-height: var(--banner-height);
    border-radius: 20px;
    overflow: hidden;
  }
  .banner-hero-row .beauty-care-details > img {
    height: var(--banner-height) !important;
    min-height: var(--banner-height) !important;
    width: 100% !important;
    object-fit: cover !important;
    border-radius: 20px;
    display: block;
  }
  @media (max-width: 1199px) {
    .banner-hero-row { --banner-height: 340px; }
  }
  @media (max-width: 991px) {
    .banner-hero-row { --banner-height: 300px; }
    .banner-hero-row > [class*="col-"] { margin-bottom: 12px; }
    .banner-hero-row > [class*="col-"]:last-child { margin-bottom: 0; }
    .popular-category .cat-images {
      display: grid !important;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px !important;
    }
    .popular-category .up-to-off { width: auto !important; }
    .popular-category .cat-image { width: 100% !important; height: auto !important; max-height: 56px; }
  }
  @media (max-width: 576px) {
    .banner-hero-row { --banner-height: 220px; }
    .popular-category .cat-images { grid-template-columns: repeat(4, 1fr); }
    .product-bg-circle { width: 100px !important; height: 100px !important; }
    .products-image img { max-height: 120px; }
    .products-image { min-height: 130px; }
  }
  .banner-promo-row {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    --promo-duo-height: 220px;
  }
  .banner-promo-row > [class*="col-"] {
    display: flex;
    flex-direction: column;
  }
  .banner-promo-row .get-offer-details,
  .banner-promo-row .check-out-details,
  .banner-promo-row .body-lotion-details {
    flex: 1;
    width: 100%;
    position: relative;
    border-radius: 20px;
    overflow: hidden;
  }
  .banner-promo-row .promo-banner-img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 20px;
    object-fit: cover;
  }
  @media (max-width: 991px) {
    .banner-promo-row { --promo-duo-height: 190px; gap: 0; }
    .banner-promo-row > .col-12 { margin-bottom: 10px !important; }
    .banner-promo-row > .col-6 {
      flex: 0 0 50% !important;
      max-width: 50% !important;
      width: 50% !important;
      margin-bottom: 0 !important;
      padding-left: 6px !important;
      padding-right: 6px !important;
    }
    .banner-promo-row > .col-6:nth-child(2) { padding-left: 12px !important; padding-right: 6px !important; }
    .banner-promo-row > .col-6:nth-child(3) { padding-left: 6px !important; padding-right: 12px !important; }
    .banner-promo-row .check-out-details,
    .banner-promo-row .body-lotion-details {
      min-height: var(--promo-duo-height);
      height: 100%;
    }
    .banner-promo-row .check-out-details .promo-banner-img,
    .banner-promo-row .body-lotion-details .promo-banner-img {
      width: 100% !important;
      height: var(--promo-duo-height) !important;
      min-height: var(--promo-duo-height) !important;
      object-fit: cover !important;
      border-radius: 16px !important;
    }
    .banner-promo-row .check-out-content {
      top: 14px !important;
      left: 14px !important;
    }
    .banner-promo-row .check-out-content h3 {
      font-size: 13px !important;
      line-height: 1.25 !important;
      width: 95% !important;
    }
    .banner-promo-row .check-out-content p { font-size: 9px !important; margin: 2px 0 !important; }
    .banner-promo-row .check-out-content h6 { font-size: 15px !important; line-height: 1.2 !important; }
    .banner-promo-row .body-lotion-content {
      top: 14px !important;
      left: 14px !important;
    }
    .banner-promo-row .body-lotion-content h3 { font-size: 13px !important; line-height: 1.25 !important; }
    .banner-promo-row .body-lotion-content p { font-size: 9px !important; margin: 2px 0 !important; }
    .banner-promo-row .body-lotion-content h6 { font-size: 15px !important; line-height: 1.2 !important; }
    .banner-promo-row .shop-now-lotion-button {
      bottom: 12px !important;
      left: 12px !important;
    }
    .banner-promo-row .shop-now-lotion-button a {
      font-size: 10px !important;
      padding: 7px 14px !important;
    }
  }
  @media (max-width: 390px) {
    .banner-promo-row { --promo-duo-height: 165px; }
    .banner-promo-row .check-out-content h3,
    .banner-promo-row .body-lotion-content h3 { font-size: 11px !important; }
    .banner-promo-row .check-out-content h6,
    .banner-promo-row .body-lotion-content h6 { font-size: 13px !important; }
  }
`;

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [categories, setCategories] = useState([
    { name: "Hair care", image: "/images/hair-care.png", slug: "hair_care" },
    { name: "Skin care", image: "/images/skin-care.png", slug: "skin_care" },
    { name: "Lip stick", image: "/images/lip-stick.png", slug: "lip_stick" },
    { name: "Face Pack", image: "/images/face-pack.png", slug: "face_pack" },
    { name: "Blusher", image: "/images/blusher.png", slug: "blusher" },
    { name: "Natural", image: "/images/natural.png", slug: "natural" },
    { name: "Body Care", image: "/images/body-care.png", slug: "body_care" },
    { name: "Cheeks", image: "/images/cheeks.png", slug: "cheeks" },
    { name: "Eyes", image: "/images/eyes.png", slug: "eyes" },
    { name: "Nails", image: "/images/nails.png", slug: "nails" },
  ]);
  const [bestSellers, setBestSellers] = useState([
    { name: "Nivea Cocoa Nourish", image: "/images/nivea-cocoa-nourish.png", price: 65.01, salePrice: 49.01, bgColor: "#AC5004" },
    { name: "Pantene Pro-V shampoo", image: "/images/pantene-pro-v-shampoo.png", price: 65.01, salePrice: 49.01, bgColor: "#D44C64" },
    { name: "Charmacy CMC matte Foundation", image: "/images/deal-pro4.png", price: 65.01, salePrice: 49.01, bgColor: "#C9A88C" },
    { name: "Dove Mens Dandruff Lotion", image: "/images/dove-mens-dandruff-lotion-hair.png", price: 65.01, salePrice: 49.01, bgColor: "#595D5F" },
    { name: "Maybelline BB Cream", image: "/images/maybelline-bb-cream-foundation.png", price: 65.01, salePrice: 49.01, bgColor: "#EFCAA2" },
    { name: "Lotion Cleanser Toner", image: "/images/lotion-cleanser-toner.png", price: 65.01, salePrice: 49.01, bgColor: "#595D5F" },
    { name: "Chaiceness Herbal Extract", image: "/images/chaiceness-plant-herbal-extract.png", price: 65.01, salePrice: 49.01, bgColor: "#FFB2B2" },
    { name: "Pellentesque posuere", image: "/images/pellentesque-posuere-purus-in-lacus.png", price: 65.01, salePrice: 49.01, bgColor: "#FFB2B2" },
  ]);
  const [deals, setDeals] = useState([
    { name: "Cocooil Organic coconut Oil", image: "/images/deal-pro6.png", price: 65.01, salePrice: 49.01 },
    { name: "E.L.F putty blush caribbean", image: "/images/deal-pro5.png", price: 65.01, salePrice: 49.01 },
    { name: "Charmacy CMC matte Foundation", image: "/images/deal-pro4.png", price: 65.01, salePrice: 49.01 },
    { name: "Anny Nourishing Nail Polish", image: "/images/deal-pro3.png", price: 65.01, salePrice: 49.01 },
    { name: "E.L.F Hydrating face Primer", image: "/images/deal-pro2.png", price: 65.01, salePrice: 49.01 },
    { name: "Pond's White Beauty face wash", image: "/images/deal-pro1.png", price: 65.01, salePrice: 49.01 },
  ]);
  const [newArrivals, setNewArrivals] = useState([
    { name: "Loreal Hairstyling product", image: "/images/loreal-hairstyling-product.png", price: 65.01, salePrice: 49.01, bgColor: "#7A4A2C" },
    { name: "Head And Shoulders Shampoo", image: "/images/head-and-shoulders-classic-clean-shampoo.png", price: 65.01, salePrice: 49.01, bgColor: "#FFB2B2" },
    { name: "Pellentesque posuere purus", image: "/images/pellentesque-posuere-purus-in-lacus.png", price: 65.01, salePrice: 49.01, bgColor: "#FFB2B2" },
    { name: "Dove Mens Dandruff Lotion", image: "/images/dove-mens-dandruff-lotion-hair.png", price: 65.01, salePrice: 49.01, bgColor: "#595D5F" },
    { name: "Pantene Pro-V shampoo", image: "/images/pantene-pro-v-shampoo.png", price: 65.01, salePrice: 49.01, bgColor: "#D44C64" },
    { name: "Laneige Sunscreen Toner", image: "/images/laneige-sunscreen-skin-toner.png", price: 65.01, salePrice: 49.01, bgColor: "#D68A8F" },
    { name: "Vaseline Intensive Care", image: "/images/vaseline-intensive-care.png", price: 65.01, salePrice: 49.01, bgColor: "#5DCA56" },
    { name: "Ponds White Beauty face wash", image: "/images/ponds-white-beauty-face-wash.png", price: 65.01, salePrice: 49.01, bgColor: "#FFC9D9" },
  ]);
  const [blogs, setBlogs] = useState([
    { title: "5 Reasons Why Regular Manicures and Pedicures Are Essential for Your Health", image: "/images/Image.png", date: "Sep 18", author: "Magnifico_admin", comments: 0 },
    { title: "The Power of Detox: How a Sauna Session Can Revitalize Your Body", image: "/images/Image-1.png", date: "Sep 18", author: "Magnifico_admin", comments: 0 },
    { title: "The Secret to Glowing Skin: How Facials Transform Your Beauty Routine", image: "/images/Image-2.png", date: "Sep 18", author: "Magnifico_admin", comments: 0 },
  ]);
  const [brands, setBrands] = useState(["/images/brand1.png", "/images/brand2.png", "/images/brand3.png", "/images/brand4.png", "/images/brand5.png", "/images/brand6.png"]);
  const [testimonials, setTestimonials] = useState([
    { name: "Aria Foster", role: "CEO, InnovateTech", image: "/images/testimonial1.png", text: "Using this product has completely changed my daily routine. I noticed results within the first week and couldn't be happier!" },
    { name: "Evelyn Martinez", role: "Graphic Designer", image: "/images/testimonial2.png", text: "I was hesitant at first, but after just a few uses, the difference is incredible. Highly recommend this!" },
    { name: "Chloe Bennet", role: "Yoga Instructor", image: "/images/testimonial3.png", text: "The quality and care put into this product is unmatched. It is now a staple in my household." },
  ]);

  useEffect(() => {
    fetch("/api/homepage")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories?.length) setCategories(data.categories);
        if (data.bestSellers?.length) setBestSellers(data.bestSellers);
        if (data.newArrivals?.length) setNewArrivals(data.newArrivals);
        if (data.blogPosts?.length) {
          setBlogs(data.blogPosts.map((p: any) => ({
            title: p.title,
            image: p.image,
            author: p.author,
            comments: 0,
            date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Sep 18",
          })));
        }
        if (data.testimonials?.length) setTestimonials(data.testimonials);
        if (data.brands?.length) setBrands(data.brands.map((b: any) => b.image));
        if (data.deals?.length) setDeals(data.deals);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
      <section id="banner">
        <div className="container">
          <div className="popular-category" style={{ marginBottom: 40, paddingTop: 200 }}>
            <h3 className="heading">Popular Categories</h3>
            <div className="cat-images">
              {categories.map((cat) => (
                <div key={cat.slug} className="up-to-off">
                  <div className="cat-box">
                    <Link href={`/shop?category=${cat.slug}`}>
                      <img src={cat.image} className="cat-image" alt={cat.name} />
                      <p className="category text-center">{cat.name}</p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <StoriesBar />
          <div className="row banner-hero-row">
            <div className="col-lg-8">
              <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                  {[0, 1, 2].map((idx) => (
                    <button key={idx} type="button" className={idx === activeSlide ? "active" : ""} onClick={() => setActiveSlide(idx)} />
                  ))}
                </div>
                <div className="carousel-inner">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className={`carousel-item ${idx === activeSlide ? "active" : ""}`}>
                      <img src={`/images/slider${idx + 1}.png`} className="d-block w-100 banner-slide-img" alt={`Slide ${idx + 1}`} />
                      <div className="carousel-caption d-none d-md-block">
                        <h1 className="slider-heading">Free Shipping Beauty</h1>
                        <p className="slider-paragraph">Shop Top Quality Haircare, Makeup, Skincare, Nailcare &amp; Much More.</p>
                        <div className="slider-button-box">
                          <Link href="/contact" className="slider-button"><span>Book Now</span></Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="beauty-care-details">
                <img src="/images/beauty-care.png" className="img-fluid banner-side-img" alt="Beauty & Care" />
                <div className="beauty-care-content">
                  <h3>Beauty &amp; Care</h3>
                  <h6>From $299</h6>
                </div>
                <div className="discover-button">
                  <Link href="/shop">Discover Now</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3 banner-promo-row">
            <div className="col-lg-6 col-12">
              <div className="get-offer-details">
                <img src="/images/get-offer.png" className="get-offer-img promo-banner-img" alt="Get 50% Off" />
                <div className="get-offer-content">
                  <h3>Get Your 50% Off</h3>
                  <h6>Nourish your skin with toxin-free cosmetic products.</h6>
                  <div className="shop-now-button">
                    <Link href="/shop">Shop Now</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="check-out-details">
                <img src="/images/check-this-out.png" className="promo-banner-img" alt="Check This Out" />
                <div className="check-out-content">
                  <h3>Check This Out</h3>
                  <p>FROM</p>
                  <h6>$169</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="body-lotion-details">
                <img src="/images/body-lotion.png" className="promo-banner-img" alt="Body Lotion" />
                <div className="body-lotion-content">
                  <h3>Body Lotion</h3>
                  <p>From</p>
                  <h6>$39</h6>
                </div>
                <div className="shop-now-lotion-button">
                  <Link href="/shop">Shop Now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="best-seller">
        <div className="container tests">
          <div className="row" style={{ justifyContent: "center" }}>
            <motion.div className="our_products-head" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="our_products-tag">
                <h2 className="main_heading">Best Seller Of Cosmetics</h2>
              </div>
              <div className="view-all-products">
                <Link href="/shop">View All Product</Link>
              </div>
            </motion.div>
            <div className="col-lg-12 p-0 m-0">
              <motion.div className="p-0 our_products-info" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                <div className="row">
                  {bestSellers.map((product, i) => (
                    <motion.div key={i} className="col-lg-3 mt-5 col-md-6 items-our_products" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                      <div className="our_products-box">
                        <Link href="/wishlist" className="best-wishlist-btn" title="Add to wishlist">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </Link>
                        <div className="products-center" style={{ display: "flex", alignItems: "center" }}>
                          <div className="products-image">
                            <img src={product.image} className="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" />
                            <div className="product-bg-circle" style={{ backgroundColor: product.bgColor }} />
                          </div>
                        </div>
                        <div className="product-title">
                          <Link href="/shop">{product.name}</Link>
                        </div>
                        <div className="price-re-sel">
                          <h5 className="product-offer-price price-product">$ {product.price}</h5>
                          <span className="ms-2 tre-product-regular-price"><s>$ {product.salePrice}</s></span>
                        </div>
                        <div className="trending-cart">
                          <i className="fal fa-shopping-cart"></i>
                          <Link href="/shop" className="button product_type_simple add_to_cart_button ajax_add_to_cart">Add to cart</Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
          <div className="cart-container">
            <div className="row" style={{ justifyContent: "space-between" }}>
              {[
                { title: "Skincare", subtitle: "Organic Ingredients", image: "/images/card-product1.png" },
                { title: "Candice Green", subtitle: "Creative Digression, Makeup", image: "/images/card-product2.png" },
                { title: "What's News", subtitle: "Shop Our New arrivals!", image: "/images/card-product3.png" },
              ].map((card, i) => (
                <div key={i} className="col-lg-4 mt-5 product-card">
                  <div className="row">
                    <div className="col-lg-5 col-md-5">
                      <div className="text-side">
                        <div className="left">
                          <h2 className="main-head">{card.title}</h2>
                          <h6 className="small-head">{card.subtitle}</h6>
                          <div className="shop-btn">
                            <Link href="/shop">Shop Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-7 col-md-5 col-sm-12 col-12 img-side">
                      <img src={card.image} alt="slide-img" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="deal-of-the-day">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="row counter-deals">
                <img src="/images/deal-left1.png" alt="img" />
                {counters.map((counter, i) => (
                  <div key={i} className={`col-lg-6 col-md-3 counter_box bg_${i + 1}`}>
                    <div className="counter-flex">
                      <p className="number"><span className="count">{counter.value}</span></p>
                      <h6 className="title mb-0 p-0">{counter.suffix}</h6>
                    </div>
                    <div className="text-counter">
                      <h6 className="title mb-0 p-0">{counter.label}</h6>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="deals-day-headings">
                <h2 className="main_heading">Deals Of the Day</h2>
                <div className="view-all-products">
                  <Link href="/shop">View All Product</Link>
                </div>
              </div>
              <div className="row mt-5">
                {deals.map((deal, i) => (
                  <div key={i} className="col-lg-4 col-md-6 product-inner-content-box">
                    <div className="product-image deal-img" style={{ position: "relative" }}>
                      <img src={deal.image} alt={deal.name} />
                      <div className="products-meta">
                        <h6><Link href="/shop">{deal.name}</Link></h6>
                        <div className="price-re-sel">
                          <h5 className="product-offer-price price-product">$ {deal.price}</h5>
                          <span className="ms-2 tre-product-regular-price"><s>$ {deal.salePrice}</s></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="timer">
                <h2>Offer Will Be End</h2>
                <Timer />
              </div>
            </div>
            <div className="col-lg-3 p-0">
              <div className="deals-day-right">
                <img src="/images/deal-right1.png" alt="img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="shop-new-arrival">
        <div className="container tests">
          <div className="row" style={{ justifyContent: "center" }}>
            <motion.div className="trending_products-head" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="trending-products">
                <h2 className="main_heading">Shop New Arrivals</h2>
              </div>
              <div className="view-all-products">
                <Link href="/shop">View All Product</Link>
              </div>
            </motion.div>
            <div className="col-lg-12 p-0 m-0">
              <motion.div className="p-0 trending_products-info" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                <div className="row">
                  {newArrivals.map((product, i) => (
                    <motion.div key={i} className="col-lg-3 col-md-6 mt-5 items-trending_products" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                      <div className="trending_products-box">
                        <Link href="/wishlist" className="best-wishlist-btn" title="Add to wishlist">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </Link>
                        <div className="products-center">
                          <div className="products-image">
                            <img src={product.image} className="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="" decoding="async" />
                            <div className="product-bg-circle" style={{ backgroundColor: product.bgColor }} />
                          </div>
                        </div>
                        <div className="tre-product-title">
                          <Link href="/shop">{product.name}</Link>
                        </div>
                        <div className="trending-product-pricing">
                          <h5 className="tre-product-offer-price price-product">$ {product.price}</h5>
                          <span className="ms-2 tre-product-regular-price"><s>$ {product.salePrice}</s></span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="featured-products">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="ramdom-products">
                <h2 className="main_heading">Random</h2>
                <div className="view-all-products">
                  <Link href="/shop">View All Product</Link>
                </div>
                <div className="p-0 our_products-info wow zoomInUp" data-wow-duration="2s">
                  <div className="row">
                    {newArrivals.slice(1, 4).map((product, i) => (
                      <div key={i} className="col-lg-12 col-md-6 items-our_products">
                        <div className="our_products-box">
                          <div className="random-products-justify" style={{ display: "flex", alignItems: "center" }}>
                            <div className="img">
                              <img src={product.image} alt={product.name} />
                            </div>
                          </div>
                          <div className="product-title">
                            <Link href="/shop">{product.name}</Link>
                            <div className="price-re-sel">
                              <h5 className="product-offer-price price-product">$ {product.price}</h5>
                              <span className="ms-2 tre-product-regular-price"><s>$ {product.salePrice}</s></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <img src="/images/ran-fea-center.png" alt="Featured Center" className="img-fluid" />
            </div>
            <div className="col-lg-3">
              <div className="ramdom-products">
                <h2 className="main_heading">Featured</h2>
                <div className="view-all-products">
                  <Link href="/shop">View All Product</Link>
                </div>
                <div className="p-0 our_products-info wow zoomInUp" data-wow-duration="2s">
                  <div className="row">
                    {[
                      { name: "Lakme Cosmetics Eye liner", image: "/images/lakme-cosmetics-eye-liner.png", price: 65.01, salePrice: 49.01 },
                      { name: "Ponds White Beauty face wash", image: "/images/ponds-white-beauty-face-wash.png", price: 65.01, salePrice: 49.01 },
                      { name: "Pellentesque posuere", image: "/images/pellentesque-posuere-purus-in-lacus.png", price: 65.01, salePrice: 49.01 },
                    ].map((product, i) => (
                      <div key={i} className="col-lg-12 col-md-6 items-our_products">
                        <div className="our_products-box">
                          <div className="random-products-justify" style={{ display: "flex", alignItems: "center" }}>
                            <div className="img">
                              <img src={product.image} alt={product.name} />
                            </div>
                          </div>
                          <div className="product-title">
                            <Link href="/shop">{product.name}</Link>
                            <div className="price-re-sel">
                              <h5 className="product-offer-price price-product">$ {product.price}</h5>
                              <span className="ms-2 tre-product-regular-price"><s>$ {product.salePrice}</s></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="our-blogs" style={{ padding: "60px 0", background: "#fff" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ color: "#FF5894", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2 }}>Latest News</span>
            <h2 style={{ fontFamily: "Elsie, serif", fontSize: 36, fontWeight: 400, color: "#222", marginTop: 6, marginBottom: 0 }}>The Blogs</h2>
            <p style={{ color: "#999", fontSize: 14, marginTop: 8, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>Stay inspired with beauty tips, trends, and stories from our experts</p>
          </div>
          <div className="row" style={{ marginTop: 0 }}>
            {blogs.map((blog, i) => (
              <div key={i} className="col-lg-4 mb-4">
                <div style={{
                  background: "#fff", borderRadius: 16, overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)", height: "100%",
                  display: "flex", flexDirection: "column",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
                >
                  <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
                    <img src={blog.image} alt={blog.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }} />
                    <div style={{ position: "absolute", top: 14, left: 14, background: "#FF5894", color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>
                      {blog.date.split(" ")[0]}
                    </div>
                  </div>
                  <div style={{ padding: "18px 22px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#aaa", marginBottom: 10 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        {blog.author}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        {blog.comments} Comments
                      </span>
                    </div>
                    <Link href="/blog" style={{ textDecoration: "none" }}>
                      <h5 style={{ fontSize: 15, fontWeight: 700, color: "#222", lineHeight: 1.45, margin: "0 0 0", transition: "color 0.2s", flex: 1 }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#FF5894"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#222"; }}
                      >{blog.title}</h5>
                    </Link>
                    <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#FF5894", textDecoration: "none", marginTop: 14, transition: "gap 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.gap = "10px"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.gap = "6px"; }}
                    >
                      Read More
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="our-brands" style={{ padding: "50px 0", background: "#fff" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontFamily: "Elsie, serif", fontSize: 28, fontWeight: 400, color: "#222", margin: 0 }}>Our Trusted Brands</h2>
            <p style={{ color: "#999", fontSize: 14, marginTop: 6 }}>We partner with the best names in beauty</p>
          </div>
          <div className="row justify-content-center align-items-center">
            {brands.map((brand, i) => (
              <div key={i} className="col-lg-2 col-md-3 col-4 text-center mb-3">
                <div style={{
                  background: "#fafafa", borderRadius: 12, padding: "20px 16px",
                  transition: "all 0.3s ease", cursor: "pointer"
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <img src={brand} alt={`Brand ${i + 1}`} style={{ maxWidth: "100%", height: 40, objectFit: "contain", filter: "grayscale(0.4)", transition: "filter 0.3s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.filter = "grayscale(0)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.filter = "grayscale(0.4)"; }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonial" style={{ padding: "60px 0", background: "#fff" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ color: "#FF5894", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2 }}>Testimonials</span>
            <h2 style={{ fontFamily: "Elsie, serif", fontSize: 36, fontWeight: 400, color: "#222", marginTop: 6, marginBottom: 0 }}>What Our Customers Say</h2>
          </div>
          <div className="row justify-content-center">
            {testimonials.map((t, i) => (
              <div key={i} className="col-lg-4 col-md-6 mb-4">
                <div style={{
                  background: "#FFEBEF", borderRadius: 16, padding: "28px 24px",
                  boxShadow: "0 4px 20px rgba(255,88,148,0.08)", height: "100%",
                  transition: "all 0.3s ease", position: "relative"
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(255,88,148,0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,88,148,0.08)"; }}
                >
                  <div style={{ color: "#FF5894", fontSize: 28, lineHeight: 1, marginBottom: 12, opacity: 0.3 }}>&ldquo;</div>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>{t.text}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid rgba(255,88,148,0.15)", paddingTop: 16 }}>
                    <img src={t.image} alt={t.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid #fff" }} />
                    <div>
                      <h5 style={{ fontSize: 14, fontWeight: 700, color: "#333", margin: 0 }}>{t.name}</h5>
                      <span style={{ fontSize: 12, color: "#999" }}>{t.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="instagram-feed">
        <div className="container">
          <div className="text-center">
            <h2>Instagram Feed</h2>
            <p>Follow Us On @cosmeticstore</p>
          </div>
          <div className="row">
            {instagramFeed.map((img, i) => (
              <div key={i} className="col-lg-2 col-md-4 col-sm-4 col-6">
                <img src={img} alt={`Instagram ${i + 1}`} className="img-fluid" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="newsletter" className="position-relative" style={{ background: "linear-gradient(135deg, #FF5894, #FF8DB5)", padding: "60px 0", marginBottom: 80 }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center text-white">
              <h2 className="newsletter-heading">Subscribe &amp; Get 10% OFF for first order</h2>
              <div className="wpcf7">
                <div className="d-flex gap-2">
                  <input type="email" placeholder="Enter your email address" className="form-control rounded-pill py-3 px-4 border-0" />
                  <button className="btn btn-dark rounded-pill px-4 fw-semibold">SUBSCRIBE</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img src="/images/plane.png" alt="Plane" className="position-absolute end-0 top-50 translate-middle-y opacity-25" />
      </section>
    </>
  );
}
