"use client"

import { useState } from "react"
import { useCart } from "@/lib/CartContext"

interface WishlistItem {
  name: string
  price: number
  inStock: boolean
}

const initialItems: WishlistItem[] = [
  { name: "Rose Glow Serum", price: 49.99, inStock: true },
  { name: "Matte Lipstick Set", price: 29.99, inStock: true },
  { name: "Hydrating Face Cream", price: 59.99, inStock: true },
  { name: "Eye Shadow Palette", price: 45.00, inStock: false },
  { name: "Silk Perfume", price: 89.00, inStock: true },
  { name: "Nail Art Kit", price: 24.99, inStock: true },
  { name: "Hair Repair Oil", price: 34.99, inStock: false },
  { name: "Body Lotion Set", price: 39.99, inStock: true },
]

export default function WishlistPage() {
  const { addItem } = useCart()
  const [items, setItems] = useState(initialItems)

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">My Wishlist</h1>
          <p className="admin-page-subtitle">Products you saved for later</p>
        </div>
        <span style={{ color: "var(--admin-text-muted)", fontSize: 14 }}>{items.length} items</span>
      </div>

      {items.length === 0 ? (
        <div className="admin-card">
          <div className="admin-card-body" style={{ textAlign: "center", padding: "60px 20px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--admin-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <p style={{ color: "var(--admin-text-muted)" }}>Your wishlist is empty</p>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Saved Products</h3>
              <p className="admin-card-desc">Click add to cart or remove items</p>
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td style={{ fontWeight: 600 }}>${item.price.toFixed(2)}</td>
                    <td>
                      <span className={`admin-badge ${item.inStock ? "success" : "danger"}`}>
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="admin-btn admin-btn-primary admin-btn-xs" style={{ marginRight: 8 }} disabled={!item.inStock} onClick={() => addItem({ id: item.id, name: item.name, image: item.image, price: item.price, salePrice: item.salePrice, bgColor: "" })}>
                        Add to Cart
                      </button>
                      <button className="admin-btn admin-btn-ghost admin-btn-xs" onClick={() => removeItem(i)} style={{ color: "var(--admin-danger)" }}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-table-footer">
            <span>{items.length} item{items.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      )}
    </div>
  )
}
