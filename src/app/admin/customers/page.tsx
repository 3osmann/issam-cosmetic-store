"use client"

import { useState } from "react"
import AdminPagination from "@/components/admin/admin-pagination"

const ITEMS_PER_PAGE = 6

const customers = [
  { id: "CUS-001", name: "Alice Johnson", email: "alice@example.com", orders: 12, totalSpent: 1245.00, joinedDate: "2026-01-15", status: "Active", avatar: "AJ" },
  { id: "CUS-002", name: "Bob Smith", email: "bob@example.com", orders: 8, totalSpent: 678.50, joinedDate: "2026-02-20", status: "Active", avatar: "BS" },
  { id: "CUS-003", name: "Carol White", email: "carol@example.com", orders: 5, totalSpent: 340.00, joinedDate: "2026-03-10", status: "Active", avatar: "CW" },
  { id: "CUS-004", name: "David Brown", email: "david@example.com", orders: 15, totalSpent: 1890.00, joinedDate: "2025-11-05", status: "Active", avatar: "DB" },
  { id: "CUS-005", name: "Eve Davis", email: "eve@example.com", orders: 3, totalSpent: 210.00, joinedDate: "2026-04-22", status: "Inactive", avatar: "ED" },
  { id: "CUS-006", name: "Frank Miller", email: "frank@example.com", orders: 20, totalSpent: 2450.00, joinedDate: "2025-08-14", status: "Active", avatar: "FM" },
  { id: "CUS-007", name: "Grace Lee", email: "grace@example.com", orders: 7, totalSpent: 890.00, joinedDate: "2026-01-30", status: "Inactive", avatar: "GL" },
  { id: "CUS-008", name: "Henry Wilson", email: "henry@example.com", orders: 10, totalSpent: 1100.00, joinedDate: "2025-12-01", status: "Active", avatar: "HW" },
]

export default function CustomersPage() {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Customers</h1>
          <p className="admin-page-subtitle">View and manage your customers</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">All Customers</h3>
          <div className="admin-search-input-wrap" style={{ width: 260 }}>
            <svg className="admin-search-input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input className="admin-input" placeholder="Search customers..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }} />
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Joined</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="admin-topbar-avatar" style={{ width: 36, height: 36, fontSize: 12 }}>{c.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{c.orders}</td>
                  <td style={{ fontWeight: 600 }}>${c.totalSpent.toFixed(2)}</td>
                  <td style={{ color: "var(--admin-text-muted)" }}>{c.joinedDate}</td>
                  <td><span className={`admin-badge ${c.status === "Active" ? "success" : "danger"}`}>{c.status}</span></td>
                  <td style={{ textAlign: "right" }}>
                    <button className="admin-btn-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
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
          <span>Showing {paginated.length} of {filtered.length} customers</span>
          <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  )
}
