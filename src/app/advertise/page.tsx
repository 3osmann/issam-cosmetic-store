"use client"
export default function AdvertisePage() {
  return (
    <div style={{ padding: "150px 0 60px" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontFamily: "Elsie, serif", fontSize: 36, marginBottom: 16 }}>Advertise With Us</h1>
        <p style={{ lineHeight: 1.8, marginBottom: 24 }}>Promote your brand to our engaged audience of beauty lovers. We offer various advertising options.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div style={{ padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
            <h4 style={{ marginBottom: 8 }}>Banner Ads</h4>
            <p style={{ color: "#666", fontSize: 14 }}>Place your banner on our high-traffic pages</p>
          </div>
          <div style={{ padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
            <h4 style={{ marginBottom: 8 }}>Sponsored Posts</h4>
            <p style={{ color: "#666", fontSize: 14 }}>Featured products in our newsletter and blog</p>
          </div>
          <div style={{ padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
            <h4 style={{ marginBottom: 8 }}>Product Placement</h4>
            <p style={{ color: "#666", fontSize: 14 }}>Premium positioning in category pages</p>
          </div>
          <div style={{ padding: 20, border: "1px solid #eee", borderRadius: 8 }}>
            <h4 style={{ marginBottom: 8 }}>Social Media</h4>
            <p style={{ color: "#666", fontSize: 14 }}>Promotion across our social channels</p>
          </div>
        </div>
        <p style={{ color: "#666" }}>Contact our advertising team at <a href="mailto:ads@beautycosmetic.com" style={{ color: "#FF5894" }}>ads@beautycosmetic.com</a></p>
      </div>
    </div>
  )
}
