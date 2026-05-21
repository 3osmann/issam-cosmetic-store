"use client"
import Link from "next/link"
export default function SitemapPage() {
  const links = [
    { group: "Main", items: [
      { label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Blog", href: "/blog" }, { label: "Contact", href: "/contact" },
    ]},
    { group: "Account", items: [
      { label: "My Account", href: "/account" }, { label: "Orders", href: "/account/orders" }, { label: "Wishlist", href: "/account/wishlist" }, { label: "Cart", href: "/cart" },
      { label: "Order Tracking", href: "/order-tracking" }, { label: "Recently Viewed", href: "/recently-viewed" },
    ]},
    { group: "Information", items: [
      { label: "About Us", href: "/about" }, { label: "FAQs", href: "/faqs" }, { label: "Terms & Conditions", href: "/terms" }, { label: "Privacy Policy", href: "/policy" },
      { label: "Careers", href: "/career" }, { label: "Store Locations", href: "/store-locations" }, { label: "Customer Service", href: "/customer-service" },
    ]},
    { group: "Partner", items: [
      { label: "Become a Seller", href: "/become-seller" }, { label: "Affiliate Program", href: "/affiliate" }, { label: "Advertise", href: "/advertise" },
      { label: "Partnerships", href: "/partnership" }, { label: "Product Support", href: "/product-support" },
    ]},
  ]
  return (
    <div style={{ padding: "150px 0 60px" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontFamily: "Elsie, serif", fontSize: 36, textAlign: "center", marginBottom: 40 }}>Sitemap</h1>
        {links.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 12, color: "#FF5894" }}>{group.group}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {group.items.map((link, li) => (
                <Link key={li} href={link.href} style={{ padding: "8px 12px", color: "#666", borderRadius: 4, transition: "0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f5f5f5"; e.currentTarget.style.color = "#FF5894" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#666" }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
