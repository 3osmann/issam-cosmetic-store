"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/lib/CartContext";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  salePrice: number;
  bgColor: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export default function ProductDetailPage() {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const id = Number(params.id);
    if (!id) { setLoading(false); return; }
    Promise.all([
      fetch(`/api/products/${id}`).then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ])
      .then(([prodData, allData]) => {
        const p = prodData.product || prodData;
        if (p && p.id) {
          setProduct({
            id: p.id,
            name: p.name,
            image: p.image,
            price: parseFloat(p.price) || 0,
            salePrice: p.salePrice ? parseFloat(p.salePrice) : parseFloat(p.price) || 0,
            bgColor: p.bgColor || "",
            category: p.categoryName || "",
            description: p.description || "",
            rating: Math.round(parseFloat(p.rating) || 4),
            reviews: p.reviews || 0,
            inStock: p.stock > 0,
          });
        }
        const all = Array.isArray(allData) ? allData : allData.products || [];
        setRelatedProducts(all.filter((rp: any) => rp.id !== id).slice(0, 4).map((rp: any) => ({
          id: rp.id,
          name: rp.name,
          image: rp.image,
          price: parseFloat(rp.price) || 0,
          salePrice: rp.salePrice ? parseFloat(rp.salePrice) : parseFloat(rp.price) || 0,
          bgColor: rp.bgColor || "",
          category: "",
          description: "",
          rating: Math.round(parseFloat(rp.rating) || 4),
          reviews: 0,
          inStock: true,
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", paddingTop: 80 }}>
        <p style={{ color: "#999" }}>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", paddingTop: 80 }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#333", marginBottom: 8 }}>{t("product.not_found")}</h2>
          <p style={{ color: "#999", fontSize: 14, marginBottom: 20 }}>{t("product.not_found_hint")}</p>
          <Link href="/shop" style={{ display: "inline-block", background: "#FF5894", color: "#fff", padding: "10px 24px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>{t("product.continue_shopping")}</Link>
        </div>
      </div>
    );
  }

  const images = [product.image, product.image, product.image];

  return (
    <div style={{ background: "#f9f9f9", minHeight: "100vh", paddingTop: 80 }}>
      <style>{`
        .product-page-breadcrumb a { color: #888; text-decoration: none; font-size: 13px; }
        .product-page-breadcrumb a:hover { color: #FF5894; }
        .product-page-breadcrumb span { color: #bbb; margin: 0 6px; }
        .product-page-breadcrumb .current { color: #FF5894; font-weight: 600; }
        .related-card { background: #fff; border-radius: 12px; overflow: hidden; transition: all 0.3s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.04); height: 100%; text-decoration: none; display: block; }
        .related-card:hover { transform: translateY(-3px); box-shadow: 0 6px 24px rgba(0,0,0,0.08); }
        .related-card .thumb { height: 180px; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .related-card .thumb img { max-width: 100%; max-height: 100%; object-fit: contain; transition: transform 0.4s ease; }
        .related-card:hover .thumb img { transform: scale(1.06); }
        .related-card .info { padding: 12px 16px 16px; }
        .related-card .info h4 { font-size: 13px; font-weight: 600; color: #333; margin: 0 0 6px; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .related-card .info .price { font-size: 15px; font-weight: 700; color: #FF5894; }
        .related-card .info .price del { font-size: 12px; font-weight: 400; color: #bbb; margin-right: 4px; }
      `}</style>

      <div style={{ background: "#fff", borderBottom: "1px solid #f0f0f0" }}>
        <div className="container" style={{ padding: "14px 0" }}>
          <div className="product-page-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/shop">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category.toLowerCase().replace(" ", "_")}`}>{product.category}</Link>
            <span>/</span>
            <span className="current">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 0 60px" }}>
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div style={{
              background: product.bgColor || "#fff",
              borderRadius: 16, overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 40, aspectRatio: "1/1",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
            }}>
              <img src={images[selectedImage]} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} style={{
                  width: 72, height: 72, borderRadius: 10, overflow: "hidden", border: selectedImage === i ? "2px solid #FF5894" : "2px solid #eee",
                  background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 6, cursor: "pointer"
                }}>
                  <img src={img} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </button>
              ))}
            </div>
          </div>

          <div className="col-lg-6">
            <span style={{ display: "inline-block", background: "rgba(255,88,148,0.1)", color: "#FF5894", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#222", margin: "0 0 10px", lineHeight: 1.3 }}>{product.name}</h1>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} width="16" height="16" viewBox="0 0 20 20" fill={s <= product.rating ? "#FF5894" : "#e5e5e5"}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <span style={{ fontSize: 13, color: "#999" }}>({product.reviews} {t("product.reviews")})</span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#FF5894" }}>${product.salePrice.toFixed(2)}</span>
              {product.salePrice < product.price && (
                <>
                  <span style={{ fontSize: 16, color: "#bbb", textDecoration: "line-through" }}>${product.price.toFixed(2)}</span>
                  <span style={{ background: "#e8f5e9", color: "#2e7d32", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>
                    Save ${(product.price - product.salePrice).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 14 }}>{product.description}</p>

            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: product.inStock ? "#22c55e" : "#ef4444" }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: product.inStock ? "#22c55e" : "#ef4444" }}>
                {product.inStock ? t("product.in_stock") : t("product.out_of_stock")}
              </span>
            </div>

            {product.inStock && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 10, overflow: "hidden" }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ border: "none", background: "none", padding: "8px 12px", cursor: "pointer", fontSize: 16, color: "#555" }}>-</button>
                  <span style={{ padding: "8px 14px", fontSize: 15, fontWeight: 600, color: "#333", minWidth: 36, textAlign: "center" }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={{ border: "none", background: "none", padding: "8px 12px", cursor: "pointer", fontSize: 16, color: "#555" }}>+</button>
                </div>
                <button onClick={() => { if (product) addItem({ id: product.id, name: product.name, image: product.image, price: product.price, salePrice: product.salePrice, bgColor: product.bgColor }, quantity) }} style={{
                  flex: 1, background: "#FF5894", color: "#fff", border: "none", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s"
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#e04a7c" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#FF5894" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  {t("product.add_to_cart")}
                </button>
                <button onClick={() => setIsWishlisted(!isWishlisted)} style={{
                  width: 48, height: 48, borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "#ef4444" : "none"} stroke={isWishlisted ? "#ef4444" : "#888"} strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, padding: 16, background: "#fff", borderRadius: 12, border: "1px solid #f0f0f0" }}>
              {[
                { icon: "truck", title: t("product.free_shipping"), sub: t("product.free_shipping_hint") },
                { icon: "shield", title: t("product.secure_payment"), sub: t("product.secure_payment_hint") },
                { icon: "rotate", title: t("product.easy_returns"), sub: t("product.easy_returns_hint") },
              ].map((feat, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5894" strokeWidth="2" style={{ margin: "0 auto 6px", display: "block" }}>
                    {feat.icon === "truck" ? <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></> :
                     feat.icon === "shield" ? <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></> :
                     <><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>}
                  </svg>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#333", margin: 0 }}>{feat.title}</p>
                  <p style={{ fontSize: 10, color: "#999", margin: 0 }}>{feat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#222", marginBottom: 16 }}>{t("product.customer_reviews")}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { id: 1, author: "Sarah M.", rating: 5, text: "Absolutely love this product! My skin has never felt better. Will definitely purchase again.", date: "2 weeks ago" },
              { id: 2, author: "Jessica K.", rating: 4, text: "Great quality for the price. Fast shipping too. Would recommend to friends.", date: "1 month ago" },
              { id: 3, author: "Emily R.", rating: 5, text: "This is my third time buying. Consistent quality every time. A staple in my beauty routine.", date: "1 month ago" },
            ].map((review) => (
              <div key={review.id} style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#333" }}>{review.author}</span>
                  <span style={{ fontSize: 12, color: "#bbb" }}>{review.date}</span>
                </div>
                <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 20 20" fill={s <= review.rating ? "#FF5894" : "#e5e5e5"}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#222", marginBottom: 20 }}>{t("product.you_may_also_like")}</h3>
            <div className="row">
              {relatedProducts.map((p) => (
                <div key={p.id} className="col-lg-3 col-md-6 mb-4">
                  <Link href={`/product/${p.id}`} className="related-card">
                    <div className="thumb" style={{ background: p.bgColor || "#fafafa" }}>
                      <img src={p.image} alt={p.name} />
                    </div>
                    <div className="info">
                      <h4>{p.name}</h4>
                      <div className="price">
                        {p.salePrice < p.price ? (
                          <><del>${p.price.toFixed(2)}</del> ${p.salePrice.toFixed(2)}</>
                        ) : (
                          <>${p.price.toFixed(2)}</>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
