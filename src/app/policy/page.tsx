"use client"
export default function PolicyPage() {
  return (
    <div style={{ padding: "150px 0 60px" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontFamily: "Elsie, serif", fontSize: 36, marginBottom: 24 }}>Privacy Policy</h1>
        <p style={{ lineHeight: 1.8, marginBottom: 16 }}>Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.</p>
        <h3 style={{ marginTop: 24, marginBottom: 8 }}>Information We Collect</h3>
        <p style={{ lineHeight: 1.8, marginBottom: 16 }}>We collect information you provide when placing an order, creating an account, or contacting us. This includes your name, email address, shipping address, and payment information.</p>
        <h3 style={{ marginTop: 24, marginBottom: 8 }}>How We Use Your Information</h3>
        <p style={{ lineHeight: 1.8, marginBottom: 16 }}>We use your information to process orders, provide customer support, and send promotional offers (with your consent). We never sell your personal data to third parties.</p>
        <h3 style={{ marginTop: 24, marginBottom: 8 }}>Security</h3>
        <p style={{ lineHeight: 1.8, marginBottom: 16 }}>We implement industry-standard security measures to protect your data. All payment transactions are encrypted via SSL.</p>
      </div>
    </div>
  )
}
