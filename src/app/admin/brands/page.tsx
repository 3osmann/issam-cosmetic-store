"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "@/components/ui/image-upload"

interface Brand {
  id: number
  name: string
  image: string
  link: string
  order: number
  active: boolean
}

const emptyForm = { name: "", image: "", link: "", order: 0, active: true }

export default function BrandsPage() {
  const [items, setItems] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Brand | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    try {
      setLoading(true)
      const res = await fetch("/api/brands")
      const data = await res.json()
      setItems(Array.isArray(data) ? data : data.brands || [])
    } catch (err) {
      console.error("Failed to fetch brands", err)
    } finally {
      setLoading(false)
    }
  }

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(item: Brand) {
    setEditing(item)
    setForm({ name: item.name, image: item.image, link: item.link, order: item.order, active: item.active })
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditing(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) return
    try {
      setSubmitting(true)
      if (editing) {
        await fetch(`/api/brands/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      } else {
        await fetch("/api/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      }
      cancelForm()
      await fetchItems()
    } catch (err) {
      console.error("Failed to save brand", err)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this brand?")) return
    try {
      await fetch(`/api/brands/${id}`, { method: "DELETE" })
      await fetchItems()
    } catch (err) {
      console.error("Failed to delete brand", err)
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Brands</h1>
          <p className="admin-page-subtitle">Manage partner brands</p>
        </div>
        <div className="admin-page-actions">
          {!showForm && (
            <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={openAdd}>+ Add Brand</button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">{editing ? "Edit Brand" : "Add Brand"}</h3>
          </div>
          <div className="admin-card-body">
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div className="admin-form-group">
                  <label className="admin-label">Name</label>
                  <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="admin-form-group">
                  <ImageUpload value={form.image} onChange={(url) => setForm((prev) => ({ ...prev, image: url }))} label="Image" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Link URL</label>
                  <input className="admin-input" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Order</label>
                  <input className="admin-input" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className={`admin-toggle ${form.active ? "active" : ""}`} onClick={() => setForm({ ...form, active: !form.active })}>
                      <span className="admin-toggle-knob" />
                    </span>
                    Active
                  </label>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="admin-btn admin-btn-primary admin-btn-sm" type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : editing ? "Update" : "Create"}
                </button>
                <button className="admin-btn admin-btn-ghost admin-btn-sm" type="button" onClick={cancelForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">All Brands</h3>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Image</th>
                <th>Link</th>
                <th>Order</th>
                <th>Active</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--admin-text-muted)" }}>Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--admin-text-muted)" }}>No brands found</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: 60, height: 30, objectFit: "contain", borderRadius: 4 }} />
                      ) : (
                        <span style={{ color: "var(--admin-text-muted)" }}>—</span>
                      )}
                    </td>
                    <td style={{ color: "var(--admin-text-muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.link || "—"}
                    </td>
                    <td>{item.order}</td>
                    <td>
                      <span className={`admin-badge ${item.active ? "success" : "danger"}`}>{item.active ? "Active" : "Inactive"}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="admin-btn-icon" onClick={() => openEdit(item)} title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="admin-btn-icon" onClick={() => handleDelete(item.id)} title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="admin-table-footer">
          <span>{items.length} brand{items.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  )
}
