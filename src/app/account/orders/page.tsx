"use client"

import { useState } from "react"
import AdminPagination from "@/components/admin/admin-pagination"

const ITEMS_PER_PAGE = 6

const orders = [
  { id: "#ORD-010", date: "2026-05-15", total: 89.99, status: "Delivered", items: 2, payment: "Credit Card" },
  { id: "#ORD-009", date: "2026-05-10", total: 45.00, status: "Shipped", items: 1, payment: "PayPal" },
  { id: "#ORD-008", date: "2026-04-28", total: 120.00, status: "Delivered", items: 3, payment: "Credit Card" },
  { id: "#ORD-007", date: "2026-04-20", total: 65.00, status: "Processing", items: 1, payment: "Credit Card" },
  { id: "#ORD-006", date: "2026-04-15", total: 200.00, status: "Delivered", items: 4, payment: "PayPal" },
  { id: "#ORD-005", date: "2026-04-10", total: 35.50, status: "Cancelled", items: 1, payment: "Credit Card" },
  { id: "#ORD-004", date: "2026-04-05", total: 150.00, status: "Delivered", items: 2, payment: "Credit Card" },
  { id: "#ORD-003", date: "2026-03-28", total: 78.00, status: "Delivered", items: 2, payment: "PayPal" },
]

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE)
  const paginated = orders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">My Orders</h1>
          <p className="admin-page-subtitle">View and track all your orders</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select className="admin-input" style={{ width: 150 }}>
            <option value="">All Orders</option>
            <option value="delivered">Delivered</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Order History</h3>
            <p className="admin-card-desc">All your past and current orders</p>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600 }}>{o.id}</td>
                  <td style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>{o.date}</td>
                  <td>{o.items}</td>
                  <td style={{ fontWeight: 600 }}>${o.total.toFixed(2)}</td>
                  <td style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>{o.payment}</td>
                  <td>
                    <span className={`admin-badge ${o.status === "Delivered" ? "success" : o.status === "Shipped" ? "purple" : o.status === "Processing" ? "info" : "danger"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="admin-btn admin-btn-ghost admin-btn-xs">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-table-footer">
          <span>{paginated.length} of {orders.length} orders</span>
          <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  )
}
