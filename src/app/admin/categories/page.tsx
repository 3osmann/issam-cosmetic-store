"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "@/components/ui/image-upload"

interface Category {
  id: number
  name: string
  slug: string
  image: string
}

const emptyForm = { name: "", slug: "", image: "" }

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    try {
      setLoading(true)
      const res = await fetch("/api/categories")
      const data = await res.json()
      setItems(Array.isArray(data) ? data : data.categories || [])
    } catch (err) {
      console.error("Failed to fetch categories", err)
    } finally {
      setLoading(false)
    }
  }

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(item: Category) {
    setEditing(item)
    setForm({ name: item.name, slug: item.slug, image: item.image })
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditing(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.slug) return
    try {
      setSubmitting(true)
      if (editing) {
        await fetch(`/api/categories/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      } else {
        await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      }
      cancelForm()
      await fetchItems()
    } catch (err) {
      console.error("Failed to save category", err)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this category?")) return
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" })
      await fetchItems()
    } catch (err) {
      console.error("Failed to delete category", err)
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categories</h1>
          <p className="admin-page-subtitle">Manage product categories</p>
        </div>
        <div className="admin-page-actions">
          {!showForm && (
            <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={openAdd}>+ Add Category</button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">{editing ? "Edit Category" : "Add Category"}</h3>
          </div>
          <div className="admin-card-body">
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div className="admin-form-group">
                  <label className="admin-label">Name</label>
                  <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Slug</label>
                  <input className="admin-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
                </div>
                <div className="admin-form-group">
                  <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} label="Image" />
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
          <h3 className="admin-card-title">All Categories</h3>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Image</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ textAlign: "center", padding: 32, color: "var(--admin-text-muted)" }}>Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: "center", padding: 32, color: "var(--admin-text-muted)" }}>No categories found</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td style={{ color: "var(--admin-text-muted)" }}>{item.slug}</td>
                    <td>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }} />
                      ) : (
                        <span style={{ color: "var(--admin-text-muted)" }}>—</span>
                      )}
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
          <span>{items.length} categor{items.length === 1 ? "y" : "ies"}</span>
        </div>
      </div>
    </div>
  )
}
