"use client"
export default function CustomerServicePage() {
  return (
    <div style={{ padding: "150px 0 60px" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontFamily: "Elsie, serif", fontSize: 36, marginBottom: 16 }}>Customer Service</h1>
        <p style={{ lineHeight: 1.8, marginBottom: 24 }}>We are here to help! Reach out to us through any of the following channels.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div style={{ padding: 20, border: "1px solid #eee", borderRadius: 8, textAlign: "center" }}>
            <h4 style={{ marginBottom: 8 }}>📞 Phone</h4>
            <p style={{ color: "#666" }}>(025) 3686 25 16</p>
            <p style={{ color: "#999", fontSize: 13 }}>Mon-Fri 9AM-6PM</p>
          </div>
          <div style={{ padding: 20, border: "1px solid #eee", borderRadius: 8, textAlign: "center" }}>
            <h4 style={{ marginBottom: 8 }}>✉️ Email</h4>
            <p style={{ color: "#666" }}>support@beautycosmetic.com</p>
            <p style={{ color: "#999", fontSize: 13 }}>24/7 support</p>
          </div>
        </div>
        <p style={{ lineHeight: 1.8 }}>For order inquiries, please include your order number in all communications. We aim to respond within 24 hours.</p>
      </div>
    </div>
  )
}
