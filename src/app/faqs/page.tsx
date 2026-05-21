"use client"
import { useState } from "react"
const faqs = [
  { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days." },
  { q: "What is your return policy?", a: "You can return items within 30 days of delivery for a full refund. Items must be unused and in original packaging." },
  { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries worldwide. Shipping costs vary by destination." },
  { q: "How can I track my order?", a: "Once your order ships, you will receive a tracking number via email. You can also track your order on our Order Tracking page." },
  { q: "Are your products cruelty-free?", a: "Yes, all our products are 100% cruelty-free and never tested on animals." },
  { q: "Can I change or cancel my order?", a: "Orders can be modified or canceled within 2 hours of placement. Please contact customer service immediately." },
]
export default function FAQsPage() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div style={{ padding: "150px 0 60px" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontFamily: "Elsie, serif", fontSize: 36, textAlign: "center", marginBottom: 40 }}>Frequently Asked Questions</h1>
        {faqs.map((faq, i) => (
          <div key={i} style={{ marginBottom: 12, border: "1px solid #eee", borderRadius: 8, overflow: "hidden" }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", padding: "16px 20px", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 16, fontWeight: 500, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {faq.q}<span style={{ transform: open === i ? "rotate(180deg)" : "", transition: "0.2s" }}>▼</span>
            </button>
            {open === i && <div style={{ padding: "0 20px 16px", color: "#666", lineHeight: 1.7 }}>{faq.a}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
