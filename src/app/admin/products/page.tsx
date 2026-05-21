"use client"

import { useState } from "react"

const products = [
  { id: "PRD-001", name: "Rose Glow Serum", category: "Skincare", price: 89.99, stock: 45, status: "Active" },
  { id: "PRD-002", name: "Matte Lipstick Set", category: "Makeup", price: 45.00, stock: 120, status: "Active" },
  { id: "PRD-003", name: "Hydrating Face Cream", category: "Skincare", price: 120.00, stock: 30, status: "Active" },
  { id: "PRD-004", name: "Eye Shadow Palette", category: "Makeup", price: 65.00, stock: 78, status: "Active" },
  { id: "PRD-005", name: "Silk Perfume", category: "Fragrance", price: 150.00, stock: 22, status: "Active" },
  { id: "PRD-006", name: "Hair Repair Oil", category: "Haircare", price: 55.00, stock: 60, status: "Draft" },
  { id: "PRD-007", name: "Nail Polish Set", category: "Makeup", price: 25.00, stock: 0, status: "Draft" },
  { id: "PRD-008", name: "Body Lotion", category: "Skincare", price: 35.00, stock: 90, status: "Active" },
]

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">Manage your product catalog</p>
        </div>
        <div className="admin-page-actions">
          <button className="admin-btn admin-btn-primary admin-btn-sm">+ Add Product</button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">All Products</h3>
          <div className="admin-search-input-wrap" style={{ width: 260 }}>
            <svg className="admin-search-input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input className="admin-input" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="admin-product-item">
                      <div className="admin-product-thumb">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                      </div>
                      <div>
                        <p className="admin-product-name">{p.name}</p>
                        <p className="admin-product-id">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className={`admin-cat-badge ${p.category.toLowerCase()}`}>{p.category}</span></td>
                  <td style={{ fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                  <td>
                    <span style={p.stock === 0 ? { color: "var(--admin-danger)", fontWeight: 600 } : { color: "var(--admin-text-muted)" }}>
                      {p.stock === 0 ? "Out of stock" : p.stock}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${p.status === "Active" ? "success" : "warning"}`}>{p.status}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="admin-btn-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button className="admin-btn-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button className="admin-btn-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-table-footer">
          <span>Showing {filtered.length} of {products.length} products</span>
          <div className="admin-pagination">
            <button className="admin-page-btn" disabled>Previous</button>
            <button className="admin-page-btn active">1</button>
            <button className="admin-page-btn">2</button>
            <button className="admin-page-btn">3</button>
            <button className="admin-page-btn">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
