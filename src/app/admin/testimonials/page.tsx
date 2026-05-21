"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "@/components/ui/image-upload"

interface Testimonial {
  id: number
  name: string
  role: string
  text: string
  image: string
  rating: number
  active: boolean
}

const emptyForm = { name: "", role: "", text: "", image: "", rating: 5, active: true }

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    try {
      setLoading(true)
      const res = await fetch("/api/testimonials")
      const data = await res.json()
      setItems(Array.isArray(data) ? data : data.testimonials || [])
    } catch (err) {
      console.error("Failed to fetch testimonials", err)
    } finally {
      setLoading(false)
    }
  }

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEdit(item: Testimonial) {
    setEditing(item)
    setForm({ name: item.name, role: item.role, text: item.text, image: item.image, rating: item.rating, active: item.active })
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditing(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.text) return
    try {
      setSubmitting(true)
      if (editing) {
        await fetch(`/api/testimonials/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      } else {
        await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      }
      cancelForm()
      await fetchItems()
    } catch (err) {
      console.error("Failed to save testimonial", err)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this testimonial?")) return
    try {
      await fetch(`/api/testimonials/${id}`, { method: "DELETE" })
      await fetchItems()
    } catch (err) {
      console.error("Failed to delete testimonial", err)
    }
  }

  function renderStars(rating: number) {
    return (
      <span style={{ color: "#f59e0b", fontSize: 13 }}>
        {"★".repeat(rating)}{"☆".repeat(5 - rating)}
      </span>
    )
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Testimonials</h1>
          <p className="admin-page-subtitle">Manage customer testimonials</p>
        </div>
        <div className="admin-page-actions">
          {!showForm && (
            <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={openAdd}>+ Add Testimonial</button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">{editing ? "Edit Testimonial" : "Add Testimonial"}</h3>
          </div>
          <div className="admin-card-body">
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div className="admin-form-group">
                  <label className="admin-label">Name</label>
                  <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Role</label>
                  <input className="admin-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} label="Image" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Rating (1-5)</label>
                  <input className="admin-input" type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Math.min(5, Math.max(1, parseInt(e.target.value) || 1)) })} />
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
              <div className="admin-form-group" style={{ marginBottom: 16 }}>
                <label className="admin-label">Testimonial Text</label>
                <textarea className="admin-textarea" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={4} required />
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
          <h3 className="admin-card-title">All Testimonials</h3>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Text</th>
                <th>Rating</th>
                <th>Active</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--admin-text-muted)" }}>Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--admin-text-muted)" }}>No testimonials found</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td style={{ color: "var(--admin-text-muted)" }}>{item.role || "—"}</td>
                    <td>
                      <span style={{ color: "var(--admin-text-muted)", maxWidth: 250, display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.text.length > 80 ? item.text.substring(0, 80) + "..." : item.text}
                      </span>
                    </td>
                    <td>{renderStars(item.rating)}</td>
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
          <span>{items.length} testimonial{items.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  )
}
