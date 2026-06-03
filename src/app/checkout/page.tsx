"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/lib/CartContext";

export default function CheckoutPage() {
  const { t } = useLanguage();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    paymentMethod: "cod",
  });
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState("");

  const discount = 0;
  const finalTotal = total - discount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    if (!form.name || !form.email || !form.street || !form.city) {
      setError("Please fill in all required fields");
      return;
    }
    setPlacing(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          phone: form.phone,
          total: finalTotal,
          shippingAddress: {
            name: form.name,
            street: form.street,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country,
          },
          paymentMethod: form.paymentMethod,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.salePrice,
          })),
        }),
      });
      if (res.ok) {
        setPlaced(true);
        clearCart();
      } else {
        setError("Failed to place order. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  if (placed) {
    return (
      <div className="woocommerce" style={{ padding: "80px 0" }}>
        <div className="container text-center" style={{ maxWidth: 500, margin: "0 auto" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#333", marginBottom: 8 }}>Order Placed!</h2>
          <p style={{ color: "#666", marginBottom: 24 }}>Thank you for your order. We&apos;ll send you a confirmation email shortly.</p>
          <Link href="/" style={{ display: "inline-block", padding: "12px 32px", background: "#FF5894", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 600, marginRight: 12 }}>
            Back to Home
          </Link>
          <Link href="/account" style={{ display: "inline-block", padding: "12px 32px", background: "#fff", color: "#FF5894", borderRadius: 8, textDecoration: "none", fontWeight: 600, border: "2px solid #FF5894" }}>
            View Orders
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="woocommerce" style={{ padding: "80px 0" }}>
        <div className="container text-center">
          <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.2 }}>🛒</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#333", marginBottom: 8 }}>Your cart is empty</h2>
          <p style={{ color: "#999", marginBottom: 24 }}>Add some products before checking out.</p>
          <Link href="/shop" style={{ display: "inline-block", padding: "12px 32px", background: "#FF5894", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 600 }}>
            Browse Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="woocommerce" style={{ padding: "40px 0 80px" }}>
      <div className="container">
        <nav className="woocommerce-breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link>&nbsp;/&nbsp;<Link href="/cart">Cart</Link>&nbsp;/&nbsp;<span style={{ color: "#FF5894" }}>Checkout</span>
        </nav>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-7">
              <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 32 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: "#333" }}>Billing Details</h2>

                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group" style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 }}>Full Name *</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" }} />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group" style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 }}>Email *</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" }} />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group" style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 }}>Phone *</label>
                      <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" }} />
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 }}>Street Address *</label>
                  <input required value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" }} />
                </div>

                <div className="row">
                  <div className="col-lg-4">
                    <div className="form-group" style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 }}>City *</label>
                      <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                        style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" }} />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group" style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 }}>State</label>
                      <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                        style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" }} />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group" style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 }}>Zip Code</label>
                      <input value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })}
                        style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" }} />
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 6 }}>Country</label>
                  <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none", background: "#fff" }}>
                    <option value="US">United States</option>
                    <option value="FR">France</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="TN">Tunisia</option>
                  </select>
                </div>

                <div style={{ marginTop: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#333" }}>Payment Method</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { value: "cod", label: "Cash on Delivery", desc: "Pay when you receive your order" },
                      { value: "card", label: "Credit Card", desc: "Visa, Mastercard, American Express" },
                      { value: "paypal", label: "PayPal", desc: "Pay with your PayPal account" },
                    ].map((method) => (
                      <label key={method.value} style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                        border: form.paymentMethod === method.value ? "2px solid #FF5894" : "1px solid #ddd",
                        borderRadius: 10, cursor: "pointer", background: form.paymentMethod === method.value ? "#fff5f8" : "#fff",
                        transition: "all 0.2s",
                      }}>
                        <input type="radio" name="payment" value={method.value} checked={form.paymentMethod === method.value}
                          onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} style={{ accentColor: "#FF5894" }} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: "#333" }}>{method.label}</div>
                          <div style={{ fontSize: 12, color: "#999" }}>{method.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {error && (
                  <div style={{ marginTop: 16, padding: "12px 16px", background: "#fef2f2", borderRadius: 8, color: "#b91c1c", fontSize: 13 }}>
                    {error}
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-5">
              <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 28, position: "sticky", top: "calc(var(--header-height, 120px) + 16px)" }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#333" }}>Your Order</h2>

                <table className="shop_table" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ fontWeight: 600, color: "#555", padding: "8px 0", borderBottom: "2px solid #eee", fontSize: 13 }}>Product</th>
                      <th style={{ fontWeight: 600, color: "#555", padding: "8px 0", borderBottom: "2px solid #eee", fontSize: 13, textAlign: "right" }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td style={{ padding: "10px 0", borderBottom: "1px solid #f5f5f5", fontSize: 14, color: "#555" }}>
                          {item.name} <strong style={{ color: "#333" }}>&times; {item.quantity}</strong>
                        </td>
                        <td style={{ padding: "10px 0", borderBottom: "1px solid #f5f5f5", textAlign: "right", fontWeight: 600, fontSize: 14 }}>
                          ${(item.salePrice * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th style={{ padding: "10px 0", fontWeight: 500, color: "#666", fontSize: 14 }}>Subtotal</th>
                      <td style={{ padding: "10px 0", textAlign: "right", fontWeight: 600, fontSize: 14 }}>${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <th style={{ padding: "10px 0", fontWeight: 500, color: "#666", fontSize: 14 }}>Shipping</th>
                      <td style={{ padding: "10px 0", textAlign: "right", fontWeight: 600, fontSize: 14 }}>
                        {shipping === 0 ? <span style={{ color: "#10b981" }}>Free</span> : `$${shipping.toFixed(2)}`}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ padding: "12px 0", fontWeight: 700, color: "#333", fontSize: 16, borderTop: "2px solid #eee" }}>Total</th>
                      <td style={{ padding: "12px 0", textAlign: "right", fontWeight: 700, color: "#FF5894", fontSize: 20, borderTop: "2px solid #eee" }}>
                        ${finalTotal.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                <button type="submit" disabled={placing}
                  style={{ width: "100%", marginTop: 20, padding: "14px 24px", background: placing ? "#ccc" : "#FF5894", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: placing ? "not-allowed" : "pointer", transition: "background 0.3s" }}>
                  {placing ? "Processing..." : `Place Order — $${finalTotal.toFixed(2)}`}
                </button>

                <div style={{ marginTop: 12, textAlign: "center" }}>
                  <Link href="/cart" style={{ color: "#999", fontSize: 13, textDecoration: "none" }}>&larr; Back to Cart</Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
