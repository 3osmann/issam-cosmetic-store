"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const weekRevenue = [4800, 6200, 5100, 7800, 9200, 8500, 6631]
const weekOrders = [42, 55, 48, 62, 78, 71, 58]

const categoryData = [
  { name: "Skincare", value: 35, color: "#ec4899" },
  { name: "Makeup", value: 28, color: "#8b5cf6" },
  { name: "Haircare", value: 18, color: "#06b6d4" },
  { name: "Fragrance", value: 12, color: "#f59e0b" },
  { name: "Tools", value: 7, color: "#10b981" },
]

const recentOrders = [
  { id: "#ORD-001", customer: "Alice Johnson", product: "Rose Serum", total: 89.99, status: "Delivered", items: 2 },
  { id: "#ORD-002", customer: "Bob Smith", product: "Lipstick Set", total: 45.00, status: "Processing", items: 1 },
  { id: "#ORD-003", customer: "Carol White", product: "Face Cream", total: 120.00, status: "Shipped", items: 3 },
  { id: "#ORD-004", customer: "David Brown", product: "Eye Shadow Palette", total: 65.00, status: "Pending", items: 1 },
  { id: "#ORD-005", customer: "Eve Davis", product: "Perfume", total: 150.00, status: "Delivered", items: 2 },
]

const topProducts = [
  { name: "Rose Glow Serum", sales: 234, revenue: 20999, trend: "up", rank: 1 },
  { name: "Matte Lipstick Set", sales: 189, revenue: 8505, trend: "up", rank: 2 },
  { name: "Hydrating Face Cream", sales: 156, revenue: 18720, trend: "down", rank: 3 },
  { name: "Eye Shadow Palette", sales: 142, revenue: 9230, trend: "up", rank: 4 },
  { name: "Silk Perfume", sales: 98, revenue: 14700, trend: "down", rank: 5 },
]

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Good Morning")
  const [activeBar, setActiveBar] = useState<number | null>(null)

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 12) setGreeting("Good Morning")
    else if (h < 18) setGreeting("Good Afternoon")
    else setGreeting("Good Evening")
  }, [])

  const maxRev = Math.max(...weekRevenue)

  // Pie chart arc calculation
  const totalCategory = categoryData.reduce((s, c) => s + c.value, 0)
  let cumulative = 0

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{greeting}, Admin  👋</h1>
          <p className="admin-page-subtitle">Here&apos;s what&apos;s happening with your store today.</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-ghost admin-btn-sm">Last 7 days</button>
          <button className="admin-btn admin-btn-primary admin-btn-sm">Download Report</button>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {[
          { label: "Total Revenue", value: "$45,231", change: "+20.1%", up: true, color: "pink" },
          { label: "Total Orders", value: "2,350", change: "+12.5%", up: true, color: "blue" },
          { label: "Conversion Rate", value: "3.24%", change: "+2.1%", up: true, color: "emerald" },
          { label: "Avg. Order Value", value: "$84.50", change: "+5.7%", up: true, color: "amber" },
          { label: "Active Customers", value: "1,280", change: "+8.4%", up: true, color: "green" },
          { label: "Total Products", value: "1,423", change: "-3.2%", up: false, color: "rose" },
        ].map((s) => (
          <div key={s.label} className={`admin-stat-card ${s.color}`}>
            <div className="admin-stat-top">
              <div className={`admin-stat-icon ${s.color}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {s.label === "Total Revenue" && <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>}
                  {s.label === "Total Orders" && <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></>}
                  {s.label === "Conversion Rate" && <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>}
                  {s.label === "Avg. Order Value" && <><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></>}
                  {s.label === "Active Customers" && <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}
                  {s.label === "Total Products" && <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>}
                </svg>
              </div>
              <span className={`admin-stat-change ${s.up ? "up" : "down"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {s.up ? <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></> : <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>}
                </svg>
                {s.change}
              </span>
            </div>
            <p className="admin-stat-label">{s.label}</p>
            <p className="admin-stat-value">{s.value}</p>
            <p className="admin-stat-period">from last month</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="admin-chart-grid">
        {/* Revenue Sparkline */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Revenue Overview</h3>
              <p className="admin-card-desc">Weekly revenue for the last 7 days</p>
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--admin-text-muted)" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--admin-primary)" }} />
                Revenue
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--admin-text-muted)" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--admin-info)" }} />
                Orders
              </span>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="admin-sparkline">
              <div className="admin-sparkline-bars">
                {weekDays.map((day, i) => (
                  <div key={day} className="admin-sparkline-bar-group">
                    <div
                      className="admin-sparkline-bar revenue"
                      style={{ height: `${(weekRevenue[i] / maxRev) * 180}px` }}
                      onMouseEnter={() => setActiveBar(i)}
                      onMouseLeave={() => setActiveBar(null)}
                    >
                      <div className="admin-sparkline-tooltip" style={{ opacity: activeBar === i ? 1 : 0 }}>
                        ${weekRevenue[i].toLocaleString()}
                      </div>
                    </div>
                    <div
                      className="admin-sparkline-bar orders"
                      style={{ height: `${(weekOrders[i] / maxRev) * 140}px` }}
                    />
                    <span className="admin-sparkline-label">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Category Pie */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Sales by Category</h3>
              <p className="admin-card-desc">Product distribution</p>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="admin-donut-container">
              <div className="admin-donut-ring">
                <svg width="180" height="180" viewBox="0 0 180 180">
                  {categoryData.map((cat, i) => {
                    const r = 72
                    const circ = 2 * Math.PI * r
                    const offset = cumulative
                    const len = (cat.value / totalCategory) * circ
                    cumulative += len
                    const dash = `${len} ${circ - len}`
                    const rotate = offset - 90
                    return (
                      <circle
                        key={cat.name}
                        cx="90"
                        cy="90"
                        r={r}
                        fill="none"
                        stroke={cat.color}
                        strokeWidth="20"
                        strokeDasharray={dash}
                        strokeLinecap="butt"
                        transform={`rotate(${rotate} 90 90)`}
                        style={{ transition: "stroke-dasharray 0.8s ease" }}
                      />
                    )
                  })}
                  <circle cx="90" cy="90" r="50" fill="var(--admin-card)" />
                </svg>
                <div className="admin-donut-center">
                  <span className="admin-donut-center-value">{totalCategory}</span>
                  <span className="admin-donut-center-label">Categories</span>
                </div>
              </div>
              <div className="admin-donut-legend">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="admin-donut-item">
                    <div className="admin-donut-item-left">
                      <div className="admin-donut-dot" style={{ background: cat.color }} />
                      <span className="admin-donut-item-name">{cat.name}</span>
                    </div>
                    <div className="admin-donut-item-bar">
                      <div className="admin-donut-item-fill" style={{ width: `${cat.value}%`, background: cat.color }} />
                    </div>
                    <span className="admin-donut-item-value">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Recent Orders</h3>
              <p className="admin-card-desc">Latest orders from your store</p>
            </div>
            <Link href="/admin/orders" className="admin-btn admin-btn-ghost admin-btn-sm">View All</Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 600 }}>{o.id}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{o.customer}</div>
                      <div style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>{o.product}</div>
                    </td>
                    <td>{o.items}</td>
                    <td style={{ fontWeight: 600 }}>${o.total.toFixed(2)}</td>
                    <td>
                      <span className={`admin-badge ${o.status === "Delivered" ? "success" : o.status === "Processing" ? "info" : o.status === "Shipped" ? "purple" : "warning"}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-table-footer">
            <span>Showing 5 of 10 orders</span>
            <div className="admin-pagination">
              <button className="admin-page-btn" disabled>Previous</button>
              <button className="admin-page-btn active">1</button>
              <button className="admin-page-btn">2</button>
              <button className="admin-page-btn">Next</button>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Top Selling Products</h3>
              <p className="admin-card-desc">Best performers this month</p>
            </div>
            <Link href="/admin/products" className="admin-btn admin-btn-ghost admin-btn-sm">View All</Link>
          </div>
          <div className="admin-card-body" style={{ paddingTop: 8 }}>
            {topProducts.map((p) => (
              <div key={p.name} className="admin-ranking-item">
                <div className="admin-ranking-left">
                  <div className={`admin-ranking-number ${p.rank === 1 ? "gold" : p.rank === 2 ? "silver" : p.rank === 3 ? "bronze" : "default"}`}>
                    {p.rank}
                  </div>
                  <div>
                    <p className="admin-ranking-name">{p.name}</p>
                    <p className="admin-ranking-sales">{p.sales} sales</p>
                  </div>
                </div>
                <div className="admin-ranking-right">
                  <p className="admin-ranking-revenue">${p.revenue.toLocaleString()}</p>
                  <div className={`admin-ranking-trend ${p.trend}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {p.trend === "up" ? <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></> : <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>}
                    </svg>
                    {p.trend === "up" ? "+12%" : "-4%"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
