"use client"
import Link from "next/link"
export default function AboutPage() {
  return (
    <div style={{ padding: "150px 0 60px", maxWidth: 900, margin: "0 auto" }}>
      <div className="container">
        <h1 style={{ fontFamily: "Elsie, serif", fontSize: 36, marginBottom: 16 }}>About Us</h1>
        <p style={{ lineHeight: 1.8, marginBottom: 16 }}>Welcome to Beauty Cosmetic Store, your number one source for premium beauty and cosmetic products. We are dedicated to providing you the very best of cosmetics, with a focus on quality, customer service, and uniqueness.</p>
        <p style={{ lineHeight: 1.8, marginBottom: 16 }}>Founded in 2024, Beauty Cosmetic Store has come a long way from its beginnings. When we first started out, our passion for eco-friendly and cruelty-free beauty products drove us to start our own business.</p>
        <p style={{ lineHeight: 1.8, marginBottom: 16 }}>We now serve customers all over the world and are thrilled to be a part of the beauty industry. We hope you enjoy our products as much as we enjoy offering them to you.</p>
        <Link href="/shop" style={{ color: "#FF5894", fontWeight: 600 }}>Shop Now →</Link>
      </div>
    </div>
  )
}
