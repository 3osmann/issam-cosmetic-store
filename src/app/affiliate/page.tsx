"use client"
export default function AffiliatePage() {
  return (
    <div style={{ padding: "150px 0 60px" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontFamily: "Elsie, serif", fontSize: 36, marginBottom: 16 }}>Affiliate Program</h1>
        <p style={{ lineHeight: 1.8, marginBottom: 24 }}>Earn commissions by promoting our products. Our affiliate program offers competitive rates and real-time tracking.</p>
        <ul style={{ lineHeight: 2.5, marginBottom: 24, paddingLeft: 20 }}>
          <li>Up to 15% commission on every sale</li>
          <li>30-day cookie duration</li>
          <li>Real-time analytics dashboard</li>
          <li>Marketing materials and banners</li>
          <li>Monthly payouts</li>
        </ul>
        <p style={{ color: "#666" }}>Sign up at <a href="/contact" style={{ color: "#FF5894" }}>contact us</a> to get started.</p>
      </div>
    </div>
  )
}
