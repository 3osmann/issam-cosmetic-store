"use client"
export default function BecomeSellerPage() {
  return (
    <div style={{ padding: "150px 0 60px" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontFamily: "Elsie, serif", fontSize: 36, marginBottom: 16 }}>Become a Seller</h1>
        <p style={{ lineHeight: 1.8, marginBottom: 24 }}>Join our marketplace and reach thousands of beauty enthusiasts. We make it easy to list and sell your products.</p>
        <ul style={{ lineHeight: 2.5, marginBottom: 24, paddingLeft: 20 }}>
          <li>Easy onboarding process</li>
          <li>Low commission fees</li>
          <li>Access to a large customer base</li>
          <li>Marketing and promotional support</li>
          <li>Secure payment processing</li>
          <li>Dedicated seller support team</li>
        </ul>
        <p style={{ color: "#666" }}>Interested? Email us at <a href="mailto:sellers@beautycosmetic.com" style={{ color: "#FF5894" }}>sellers@beautycosmetic.com</a></p>
      </div>
    </div>
  )
}
