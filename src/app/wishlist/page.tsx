"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useWishlist } from "@/lib/WishlistContext";
import { useCart } from "@/lib/CartContext";

const wishlistStyles = `
  .wl-page { background: #f9f9f9; min-height: 100vh; }
  .wl-hero {
    padding: 120px 0 30px; text-align: center;
  }
  .wl-hero h1 { font-family: "Elsie",serif; font-size: 36px; font-weight: 400; color: #222; margin: 0 0 4px; }
  .wl-hero p { font-size: 14px; color: #999; margin: 0; }
  .wl-count { font-size: 13px; color: #999; margin-bottom: 20px; }
  .wl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
  .wl-card {
    background: #fff; border-radius: 14px; overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05); transition: all 0.25s;
    position: relative;
  }
  .wl-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
  .wl-thumb {
    height: 200px; display: flex; align-items: center; justify-content: center;
    padding: 20px; position: relative; overflow: hidden;
  }
  .wl-thumb img { max-width: 100%; max-height: 100%; object-fit: contain; transition: transform 0.4s; }
  .wl-card:hover .wl-thumb img { transform: scale(1.06); }
  .wl-thumb .wl-del {
    position: absolute; top: 10px; right: 10px; z-index: 2;
    width: 30px; height: 30px; border-radius: 50%;
    background: rgba(255,255,255,0.85); border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
  }
  .wl-thumb .wl-del:hover { background: #FF5894; }
  .wl-thumb .wl-del:hover svg { color: #fff; }
  .wl-badge {
    position: absolute; top: 10px; left: 10px; z-index: 2;
    background: #FF5894; color: #fff; font-size: 10px; font-weight: 600;
    padding: 3px 9px; border-radius: 20px;
  }
  .wl-oos {
    position: absolute; inset: 0; background: rgba(255,255,255,0.65);
    display: flex; align-items: center; justify-content: center; z-index: 3;
  }
  .wl-oos span {
    background: #fff; color: #e74c3c; font-size: 12px; font-weight: 600;
    padding: 4px 14px; border-radius: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .wl-body { padding: 14px 16px 18px; }
  .wl-body h3 { font-size: 14px; font-weight: 600; color: #222; margin: 0 0 4px; line-height: 1.4; }
  .wl-body h3 a { color: inherit; text-decoration: none; }
  .wl-body h3 a:hover { color: #FF5894; }
  .wl-body .wl-price { font-size: 16px; font-weight: 700; color: #FF5894; margin-top: 6px; }
  .wl-body .wl-price del { font-size: 12px; color: #bbb; font-weight: 400; margin-left: 6px; }
  .wl-body .wl-atc {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    width: 100%; margin-top: 10px; padding: 8px 0;
    background: #FF5894; color: #fff; border: none; border-radius: 8px;
    font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.2s;
  }
  .wl-body .wl-atc:hover { background: #e64a7e; }
  .wl-body .wl-atc:disabled { background: #ddd; color: #999; cursor: not-allowed; }
  .wl-empty { text-align: center; padding: 80px 20px; }
  .wl-empty svg { width: 80px; height: 80px; color: #ddd; margin-bottom: 16px; }
  .wl-empty h2 { font-size: 22px; font-weight: 700; color: #333; margin: 0 0 6px; }
  .wl-empty p { font-size: 14px; color: #999; margin: 0 0 24px; }
  .wl-empty a {
    display: inline-block; background: #FF5894; color: #fff; padding: 12px 32px;
    border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none;
  }
  .wl-empty a:hover { background: #e64a7e; }
`;

interface WishlistItem {
  id: number;
  name: string;
  image: string;
  price: number;
  salePrice: number;
  bgColor: string;
  rating: number;
  inStock: boolean;
}

const initialWishlist: WishlistItem[] = [
  { id: 1, name: "Nivea Cocoa Nourish", image: "/images/nivea-cocoa-nourish.png", price: 65.01, salePrice: 49.01, bgColor: "#AC5004", rating: 4, inStock: true },
  { id: 3, name: "Charmacy CMC matte Foundation", image: "/images/deal-pro4.png", price: 65.01, salePrice: 49.01, bgColor: "", rating: 4, inStock: true },
  { id: 5, name: "Maybelline BB Cream", image: "/images/maybelline-bb-cream-foundation.png", price: 65.01, salePrice: 49.01, bgColor: "#EFCAA2", rating: 5, inStock: true },
  { id: 7, name: "Chaiceness Herbal Extract", image: "/images/chaiceness-plant-herbal-extract.png", price: 65.01, salePrice: 49.01, bgColor: "#FFB2B2", rating: 4, inStock: false },
  { id: 10, name: "E.L.F putty blush caribbean", image: "/images/deal-pro5.png", price: 65.01, salePrice: 49.01, bgColor: "", rating: 4, inStock: true },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} style={{ color: i < rating ? "#f59e0b" : "#ddd", fill: i < rating ? "#f59e0b" : "none" }} />
      ))}
    </div>
  );
}

export default function WishlistPage() {
  const { t } = useLanguage();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const prods = (Array.isArray(data) ? data : data.products || [])
          .filter((p: any) => wishlist.includes(p.id))
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            image: p.image,
            price: parseFloat(p.price) || 0,
            salePrice: p.salePrice ? parseFloat(p.salePrice) : parseFloat(p.price) || 0,
            bgColor: p.bgColor || "",
            rating: Math.round(parseFloat(p.rating) || 4),
            inStock: p.inStock !== false,
          }));
        setItems(prods);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [wishlist]);

  const removeItem = (id: number) => toggleWishlist(id);
  const moveToCart = (item: WishlistItem) => {
    addItem({ id: item.id, name: item.name, image: item.image, price: item.price, salePrice: item.salePrice, bgColor: item.bgColor });
    toggleWishlist(item.id);
  };

  return (
    <div className="wl-page">
      <style dangerouslySetInnerHTML={{ __html: wishlistStyles }} />
      <div className="wl-hero">
        <h1>{t("wishlist.title")}</h1>
        <p style={{ fontSize: 14, color: "#999", margin: 0 }}>Save & shop your favorite products</p>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "30px 20px" }}>
        {items.length > 0 ? (
          <>
            <p className="wl-count">{items.length} {t("wishlist.items")}</p>
            <div className="wl-grid">
              {items.map((item) => (
                <div key={item.id} className="wl-card">
                  <div className="wl-thumb" style={item.bgColor ? { backgroundColor: item.bgColor } : { backgroundColor: "#f5f5f5" }}>
                    <Link href={`/product/${item.id}`}>
                      <img src={item.image} alt={item.name} />
                    </Link>
                    <button className="wl-del" onClick={() => removeItem(item.id)} title="Remove">
                      <Trash2 size={14} style={{ color: "#999", transition: "color 0.2s" }} />
                    </button>
                    {item.salePrice < item.price && (
                      <span className="wl-badge">{t("shop.sale")}</span>
                    )}
                    {!item.inStock && (
                      <div className="wl-oos">
                        <span>{t("product.out_of_stock")}</span>
                      </div>
                    )}
                  </div>
                  <div className="wl-body">
                    <h3><Link href={`/product/${item.id}`}>{item.name}</Link></h3>
                    <StarRating rating={item.rating} />
                    <div className="wl-price">
                      ${item.salePrice.toFixed(2)}
                      {item.salePrice < item.price && <del>${item.price.toFixed(2)}</del>}
                    </div>
                    <button className="wl-atc" disabled={!item.inStock} onClick={() => moveToCart(item)}>
                      <ShoppingCart size={14} />
                      {item.inStock ? t("wishlist.move_to_cart") : t("product.out_of_stock")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="wl-empty">
            <Heart />
            <h2>{t("wishlist.empty")}</h2>
            <p>{t("wishlist.empty_hint")}</p>
            <Link href="/shop">{t("wishlist.browse")}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
