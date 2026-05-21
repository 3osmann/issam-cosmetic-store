"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Order {
  id: string
  date: string
  total: number
  status: string
  items: number
}

const sampleOrders: Order[] = [
  { id: "#ORD-010", date: "2026-05-15", total: 89.99, status: "Delivered", items: 2 },
  { id: "#ORD-009", date: "2026-05-10", total: 45.00, status: "Shipped", items: 1 },
  { id: "#ORD-008", date: "2026-04-28", total: 120.00, status: "Delivered", items: 3 },
  { id: "#ORD-007", date: "2026-04-20", total: 65.00, status: "Processing", items: 1 },
]

const wishlistItems = [
  { name: "Rose Glow Serum", price: 49.99, image: "/images/placeholder.png" },
  { name: "Matte Lipstick Set", price: 29.99, image: "/images/placeholder.png" },
  { name: "Hydrating Face Cream", price: 59.99, image: "/images/placeholder.png" },
]

export default function CustomerDashboardPage() {
  const [greeting, setGreeting] = useState("Welcome")

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 12) setGreeting("Good Morning")
    else if (h < 18) setGreeting("Good Afternoon")
    else setGreeting("Good Evening")
  }, [])

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{greeting}!</h1>
          <p className="admin-page-subtitle">Welcome to your account dashboard.</p>
        </div>
      </div>

      <div className="admin-stats">
        {[
          { label: "Total Orders", value: "12", change: "+2 this month", up: true, color: "pink" },
          { label: "Wishlist Items", value: "8", change: "3 new", up: true, color: "blue" },
          { label: "Total Spent", value: "$845.00", change: "+$120", up: true, color: "emerald" },
          { label: "Reward Points", value: "1,250", change: "+350", up: true, color: "amber" },
        ].map((s) => (
          <div key={s.label} className={`admin-stat-card ${s.color}`}>
            <div className="admin-stat-top">
              <div className={`admin-stat-icon ${s.color}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {s.label === "Total Orders" && <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></>}
                  {s.label === "Wishlist Items" && <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>}
                  {s.label === "Total Spent" && <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>}
                  {s.label === "Reward Points" && <><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></>}
                </svg>
              </div>
              <span className={`admin-stat-change ${s.up ? "up" : "down"}`}>
                {s.change}
              </span>
            </div>
            <p className="admin-stat-label">{s.label}</p>
            <p className="admin-stat-value">{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Recent Orders</h3>
              <p className="admin-card-desc">Your latest orders</p>
            </div>
            <Link href="/account/orders" className="admin-btn admin-btn-ghost admin-btn-sm">View All</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleOrders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 600 }}>{o.id}</td>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>{o.date}</td>
                    <td>{o.items}</td>
                    <td style={{ fontWeight: 600 }}>${o.total.toFixed(2)}</td>
                    <td>
                      <span className={`admin-badge ${o.status === "Delivered" ? "success" : o.status === "Shipped" ? "purple" : "info"}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-table-footer">
            <span>{sampleOrders.length} orders</span>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Wishlist</h3>
              <p className="admin-card-desc">Items you saved for later</p>
            </div>
            <Link href="/account/wishlist" className="admin-btn admin-btn-ghost admin-btn-sm">View All</Link>
          </div>
          <div className="admin-card-body">
            {wishlistItems.map((item, i) => (
              <div key={i} className="admin-ranking-item">
                <div className="admin-ranking-left">
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--admin-bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--admin-text-muted)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </div>
                  <div>
                    <p className="admin-ranking-name">{item.name}</p>
                    <p className="admin-ranking-sales">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <button className="admin-btn admin-btn-primary admin-btn-xs">Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
