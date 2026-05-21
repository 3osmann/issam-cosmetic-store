"use client"

import { useState } from "react"

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"

const orders = [
  { id: "#ORD-001", customer: "Alice Johnson", email: "alice@example.com", date: "2026-05-20", total: 89.99, status: "Delivered" as OrderStatus, items: 2 },
  { id: "#ORD-002", customer: "Bob Smith", email: "bob@example.com", date: "2026-05-20", total: 45.00, status: "Processing" as OrderStatus, items: 1 },
  { id: "#ORD-003", customer: "Carol White", email: "carol@example.com", date: "2026-05-19", total: 120.00, status: "Shipped" as OrderStatus, items: 3 },
  { id: "#ORD-004", customer: "David Brown", email: "david@example.com", date: "2026-05-19", total: 65.00, status: "Pending" as OrderStatus, items: 1 },
  { id: "#ORD-005", customer: "Eve Davis", email: "eve@example.com", date: "2026-05-18", total: 150.00, status: "Delivered" as OrderStatus, items: 2 },
  { id: "#ORD-006", customer: "Frank Miller", email: "frank@example.com", date: "2026-05-18", total: 210.00, status: "Cancelled" as OrderStatus, items: 4 },
  { id: "#ORD-007", customer: "Grace Lee", email: "grace@example.com", date: "2026-05-17", total: 55.00, status: "Processing" as OrderStatus, items: 1 },
  { id: "#ORD-008", customer: "Henry Wilson", email: "henry@example.com", date: "2026-05-17", total: 175.00, status: "Pending" as OrderStatus, items: 3 },
  { id: "#ORD-009", customer: "Ivy Chen", email: "ivy@example.com", date: "2026-05-16", total: 88.00, status: "Shipped" as OrderStatus, items: 2 },
  { id: "#ORD-010", customer: "Jack Taylor", email: "jack@example.com", date: "2026-05-16", total: 132.00, status: "Delivered" as OrderStatus, items: 3 },
]

const statuses: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]

const badgeMap: Record<OrderStatus, string> = {
  Pending: "warning",
  Processing: "info",
  Shipped: "purple",
  Delivered: "success",
  Cancelled: "danger",
}

export default function OrdersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All")

  const filtered = orders.filter((o) => {
    const ms = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase())
    const ss = statusFilter === "All" || o.status === statusFilter
    return ms && ss
  })

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-subtitle">Manage customer orders</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">All Orders</h3>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div className="admin-search-input-wrap" style={{ width: 220 }}>
              <svg className="admin-search-input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input className="admin-input" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="admin-filter-group">
              <button className={`admin-filter-btn ${statusFilter === "All" ? "active" : ""}`} onClick={() => setStatusFilter("All")}>All</button>
              {statuses.map((s) => (
                <button key={s} className={`admin-filter-btn ${statusFilter === s ? "active" : ""}`} onClick={() => setStatusFilter(s)}>{s}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600 }}>{o.id}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{o.customer}</div>
                    <div style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>{o.email}</div>
                  </td>
                  <td style={{ color: "var(--admin-text-muted)" }}>{o.date}</td>
                  <td>{o.items} items</td>
                  <td style={{ fontWeight: 600 }}>${o.total.toFixed(2)}</td>
                  <td><span className={`admin-badge ${badgeMap[o.status]}`}>{o.status}</span></td>
                  <td style={{ textAlign: "right" }}>
                    <button className="admin-btn-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button className="admin-btn-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-table-footer">
          <span>Showing {filtered.length} of {orders.length} orders</span>
          <div className="admin-pagination">
            <button className="admin-page-btn" disabled>Previous</button>
            <button className="admin-page-btn active">1</button>
            <button className="admin-page-btn">2</button>
            <button className="admin-page-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
