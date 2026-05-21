"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/lib/CartContext";

export default function CartPage() {
  const { t } = useLanguage();
  const { items, updateQuantity, removeItem, subtotal, shipping, total, itemCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const discount = couponApplied ? subtotal * 0.1 : 0;
  const finalTotal = total - discount;

  return (
    <div className="woocommerce" style={{ padding: "40px 0 80px" }}>
      <div className="container">
        <nav className="woocommerce-breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link>&nbsp;/&nbsp;<span style={{ color: "#FF5894" }}>Cart</span>
        </nav>

        {items.length > 0 ? (
          <div className="row">
            <div className="col-lg-8">
              <form className="woocommerce-cart-form">
                <table className="shop_table shop_table_responsive cart" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th className="product-remove" style={{ width: 40 }}>&nbsp;</th>
                      <th className="product-thumbnail" style={{ width: 100 }}>&nbsp;</th>
                      <th className="product-name">{t("cart.product")}</th>
                      <th className="product-price">{t("cart.price")}</th>
                      <th className="product-quantity">{t("cart.quantity")}</th>
                      <th className="product-subtotal">{t("cart.subtotal")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="woocommerce-cart-form__cart-item">
                        <td className="product-remove" style={{ textAlign: "center" }}>
                          <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: "#999", fontSize: 18, cursor: "pointer", padding: 4 }}>&times;</button>
                        </td>
                        <td className="product-thumbnail">
                          <div style={{ width: 80, height: 80, borderRadius: 12, background: item.bgColor || "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", padding: 8 }}>
                            <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                          </div>
                        </td>
                        <td className="product-name" data-title="Product">
                          <Link href={`/product/${item.id}`} style={{ color: "#333", fontWeight: 500, textDecoration: "none" }}>{item.name}</Link>
                        </td>
                        <td className="product-price" data-title="Price">
                          <span className="woocommerce-Price-amount amount">${item.salePrice.toFixed(2)}</span>
                        </td>
                        <td className="product-quantity" data-title="Quantity">
                          <div className="quantity" style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 6, width: "fit-content" }}>
                            <button onClick={() => updateQuantity(item.id, -1)} style={{ background: "none", border: "none", padding: "6px 10px", cursor: "pointer", color: "#666", fontSize: 14 }}>-</button>
                            <span style={{ padding: "6px 12px", fontSize: 14, fontWeight: 500, minWidth: 30, textAlign: "center", borderLeft: "1px solid #ddd", borderRight: "1px solid #ddd" }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} style={{ background: "none", border: "none", padding: "6px 10px", cursor: "pointer", color: "#666", fontSize: 14 }}>+</button>
                          </div>
                        </td>
                        <td className="product-subtotal" data-title="Subtotal" style={{ fontWeight: 700, color: "#FF5894" }}>
                          <span className="woocommerce-Price-amount amount">${(item.salePrice * item.quantity).toFixed(2)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </form>
              <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
                <div style={{ display: "flex", gap: 8, flex: 1 }}>
                  <input type="text" placeholder={t("cart.coupon")} value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ flex: 1, padding: "10px 14px", border: "1px solid #ddd", borderRadius: 6, fontSize: 14, outline: "none" }} />
                  <button onClick={() => setCouponApplied(true)} disabled={!couponCode || couponApplied}
                    style={{ padding: "10px 24px", background: couponCode && !couponApplied ? "#FF5894" : "#ddd", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: couponCode && !couponApplied ? "pointer" : "not-allowed" }}>
                    {t("cart.apply")}
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="cart-collaterals">
                <div className="cart_totals" style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 28 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#333" }}>{t("cart.order_summary")}</h2>
                  <table className="shop_table shop_table_responsive" style={{ width: "100%" }}>
                    <tbody>
                      <tr className="cart-subtotal">
                        <th style={{ fontWeight: 400, color: "#666", padding: "8px 0" }}>{t("cart.subtotal")}</th>
                        <td style={{ textAlign: "right", fontWeight: 600, padding: "8px 0" }}><span className="woocommerce-Price-amount amount">${subtotal.toFixed(2)}</span></td>
                      </tr>
                      <tr className="shipping">
                        <th style={{ fontWeight: 400, color: "#666", padding: "8px 0" }}>{t("cart.shipping")}</th>
                        <td style={{ textAlign: "right", fontWeight: 600, padding: "8px 0" }}>
                          {shipping === 0 ? <span style={{ color: "#10b981" }}>{t("cart.free")}</span> : <span className="woocommerce-Price-amount amount">${shipping.toFixed(2)}</span>}
                        </td>
                      </tr>
                      {couponApplied && (
                        <tr className="cart-discount">
                          <th style={{ fontWeight: 400, color: "#10b981", padding: "8px 0" }}>{t("cart.discount")} (10%)</th>
                          <td style={{ textAlign: "right", fontWeight: 600, color: "#10b981", padding: "8px 0" }}>-${discount.toFixed(2)}</td>
                        </tr>
                      )}
                      <tr className="order-total">
                        <th style={{ fontWeight: 700, color: "#333", padding: "12px 0", borderTop: "2px solid #eee" }}>{t("cart.total")}</th>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#FF5894", fontSize: 20, padding: "12px 0", borderTop: "2px solid #eee" }}>
                          <span className="woocommerce-Price-amount amount">${finalTotal.toFixed(2)}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {subtotal < 50 && subtotal > 0 && (
                    <div style={{ marginTop: 16, padding: "12px 16px", background: "#f0fdf4", borderRadius: 8, fontSize: 13, color: "#166534", display: "flex", alignItems: "center", gap: 8 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 14h6"/></svg>
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping
                    </div>
                  )}
                  <Link href="/checkout">
                    <button style={{ width: "100%", marginTop: 20, padding: "14px 24px", background: "#FF5894", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "background 0.3s" }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "#e04a7c")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "#FF5894")}>
                      {t("cart.checkout")}
                    </button>
                  </Link>
                  <div style={{ marginTop: 12, textAlign: "center" }}>
                    <Link href="/shop" style={{ color: "#999", fontSize: 13, textDecoration: "none" }}>&larr; {t("cart.continue_shopping")}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center" style={{ padding: "80px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.2 }}>🛒</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#333", marginBottom: 8 }}>{t("cart.empty")}</h2>
            <p style={{ color: "#999", marginBottom: 24 }}>{t("cart.empty_hint")}</p>
            <Link href="/shop" style={{ display: "inline-block", padding: "12px 32px", background: "#FF5894", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
              {t("cart.continue_shopping")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
