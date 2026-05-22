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
                <div className="cart_totals" style={{
                  background: "#fff", borderRadius: 16, overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)",
                  position: "sticky", top: "calc(var(--header-height, 120px) + 16px)",
                }}>
                  <div style={{
                    background: "linear-gradient(135deg,#FF5894,#e83e8c)", padding: "20px 24px",
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "#fff" }}>{t("cart.order_summary")}</h2>
                  </div>

                  <div style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
                        <span style={{ fontSize: 14, color: "#666" }}>{t("cart.subtotal")} ({itemCount} items)</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>${subtotal.toFixed(2)}</span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid #f5f5f5" }}>
                        <span style={{ fontSize: 14, color: "#666" }}>{t("cart.shipping")}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: shipping === 0 ? "#10b981" : "#333" }}>
                          {shipping === 0 ? (
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                              {t("cart.free")}
                            </span>
                          ) : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>

                      {couponApplied && (
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid #f5f5f5" }}>
                          <span style={{ fontSize: 14, color: "#10b981", display: "flex", alignItems: "center", gap: 6 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                            Discount (10%)
                          </span>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#10b981" }}>-${discount.toFixed(2)}</span>
                        </div>
                      )}

                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "14px 0", marginTop: 4,
                        borderTop: "2px solid #FF5894", borderBottom: "2px solid #FF5894",
                      }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: "#333" }}>{t("cart.total")}</span>
                        <span style={{ fontSize: 22, fontWeight: 800, color: "#FF5894" }}>${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    {subtotal < 50 && subtotal > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#999", marginBottom: 6 }}>
                          <span>Free Shipping</span>
                          <span>${(50 - subtotal).toFixed(2)} away</span>
                        </div>
                        <div style={{ width: "100%", height: 6, background: "#f0f0f0", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%`, height: "100%", background: "linear-gradient(90deg,#10b981,#34d399)", borderRadius: 3, transition: "width 0.3s" }} />
                        </div>
                      </div>
                    )}

                    <Link href="/checkout" style={{ textDecoration: "none", display: "block" }}>
                      <button style={{
                        width: "100%", marginTop: 20, padding: "14px 24px",
                        background: "linear-gradient(135deg,#FF5894,#e83e8c)", color: "#fff",
                        border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700,
                        cursor: "pointer", transition: "all 0.3s",
                        boxShadow: "0 4px 16px rgba(255,88,148,0.3)",
                        letterSpacing: 0.3,
                      }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(255,88,148,0.4)"; }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,88,148,0.3)"; }}>
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          {t("cart.checkout")}
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                        </span>
                      </button>
                    </Link>

                    <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, color: "#aaa" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      Secure checkout
                    </div>

                    <div style={{ marginTop: 12, textAlign: "center" }}>
                      <Link href="/shop" style={{ color: "#999", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, transition: "color 0.2s" }}
                        onMouseOver={(e) => e.currentTarget.style.color = "#FF5894"}
                        onMouseOut={(e) => e.currentTarget.style.color = "#999"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                        {t("cart.continue_shopping")}
                      </Link>
                    </div>
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
