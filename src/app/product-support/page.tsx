"use client"
export default function ProductSupportPage() {
  return (
    <div style={{ padding: "150px 0 60px" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontFamily: "Elsie, serif", fontSize: 36, marginBottom: 16 }}>Product Support</h1>
        <p style={{ lineHeight: 1.8, marginBottom: 24 }}>Need help with a product? Browse our support resources or contact our team.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div style={{ padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
            <h4 style={{ marginBottom: 8 }}>Usage Guides</h4>
            <p style={{ color: "#666", fontSize: 14 }}>Step-by-step instructions for our products</p>
          </div>
          <div style={{ padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
            <h4 style={{ marginBottom: 8 }}>Ingredients</h4>
            <p style={{ color: "#666", fontSize: 14 }}>Detailed ingredient lists and safety info</p>
          </div>
          <div style={{ padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
            <h4 style={{ marginBottom: 8 }}>Returns</h4>
            <p style={{ color: "#666", fontSize: 14 }}>How to return or exchange a product</p>
          </div>
          <div style={{ padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
            <h4 style={{ marginBottom: 8 }}>Contact Support</h4>
            <p style={{ color: "#666", fontSize: 14 }}>Reach our product specialists</p>
          </div>
        </div>
        <p style={{ color: "#666" }}>For product-specific inquiries: <a href="mailto:support@beautycosmetic.com" style={{ color: "#FF5894" }}>support@beautycosmetic.com</a></p>
      </div>
    </div>
  )
}
