"use client"

import { useState, useEffect } from "react"

interface SeoEntry {
  id: number
  page: string
  title: string | null
  description: string | null
  ogImage: string | null
  keywords: string | null
  updatedAt: string | null
}

const defaultPages = [
  { page: "/", label: "Home" },
  { page: "/shop", label: "Shop" },
  { page: "/about", label: "About" },
  { page: "/contact", label: "Contact" },
  { page: "/blog", label: "Blog" },
  { page: "/faqs", label: "FAQs" },
  { page: "/terms", label: "Terms & Conditions" },
  { page: "/policy", label: "Privacy Policy" },
  { page: "/career", label: "Career" },
  { page: "/store-locations", label: "Store Locations" },
  { page: "/customer-service", label: "Customer Service" },
  { page: "/become-seller", label: "Become a Seller" },
  { page: "/affiliate", label: "Affiliate" },
  { page: "/advertise", label: "Advertise" },
  { page: "/partnership", label: "Partnership" },
  { page: "/product-support", label: "Product Support" },
  { page: "/sitemap", label: "Sitemap" },
]

export default function SeoPage() {
  const [entries, setEntries] = useState<SeoEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ page: "", title: "", description: "", ogImage: "", keywords: "" })

  useEffect(() => { fetchSeo() }, [])

  async function fetchSeo() {
    try {
      setLoading(true)
      const res = await fetch("/api/seo")
      const data = await res.json()
      setEntries(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to fetch SEO settings", err)
    } finally {
      setLoading(false)
    }
  }

  function getEntry(page: string) {
    return entries.find((e) => e.page === page)
  }

  function startEdit(entry: SeoEntry | null, page: string) {
    setEditingId(entry?.id || -1)
    setEditForm({
      page,
      title: entry?.title || "",
      description: entry?.description || "",
      ogImage: entry?.ogImage || "",
      keywords: entry?.keywords || "",
    })
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function saveEdit() {
    if (!editForm.page) return
    try {
      setSaving(true)
      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      if (res.ok) {
        setSaved(editForm.page)
        setTimeout(() => setSaved(""), 2000)
        setEditingId(null)
        await fetchSeo()
      }
    } catch (err) {
      console.error("Failed to save SEO", err)
    } finally {
      setSaving(false)
    }
  }

  function getPageLabel(page: string) {
    return defaultPages.find((p) => p.page === page)?.label || page
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">SEO Settings</h1>
          <p className="admin-page-subtitle">Manage meta titles, descriptions, OG images, and keywords for every page</p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--admin-text-muted)" }}>Loading SEO settings...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {defaultPages.map(({ page, label }) => {
            const entry = getEntry(page)
            const isEditing = editingId !== null && (editingId === entry?.id || (entry === null || editingId === -1))
            const isSaving = saved === page

            if (isEditing) {
              return (
                <div className="admin-card" key={page}>
                  <div className="admin-card-header">
                    <h3 className="admin-card-title">{label}</h3>
                    <span style={{ fontSize: 11, color: "var(--admin-text-muted)", fontFamily: "monospace" }}>{page}</span>
                  </div>
                  <div className="admin-card-body">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div className="admin-form-group">
                        <label className="admin-label">Meta Title</label>
                        <input className="admin-input" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder={`${label} - Beauty Cosmetic Store`} />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label">Meta Keywords</label>
                        <input className="admin-input" value={editForm.keywords} onChange={(e) => setEditForm({ ...editForm, keywords: e.target.value })} placeholder="cosmetics, beauty, skincare" />
                      </div>
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 12 }}>
                      <label className="admin-label">Meta Description</label>
                      <textarea className="admin-input" rows={2} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Brief description for search engines..." />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 16 }}>
                      <label className="admin-label">OG Image URL</label>
                      <input className="admin-input" value={editForm.ogImage} onChange={(e) => setEditForm({ ...editForm, ogImage: e.target.value })} placeholder="/images/og-default.jpg" />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={saveEdit} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div className="admin-card" key={page} style={{ cursor: "pointer" }} onClick={() => startEdit(entry || null, page)}>
                <div className="admin-card-body" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <h3 className="admin-card-title" style={{ margin: 0 }}>{label}</h3>
                      <span style={{ fontSize: 11, color: "var(--admin-text-muted)", fontFamily: "monospace" }}>{page}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--admin-text-muted)", margin: 0 }}>
                      {entry?.title || entry?.description ? (
                        <span>{entry.title || "No title"} &mdash; {entry.description ? (entry.description.length > 80 ? entry.description.slice(0, 80) + "..." : entry.description) : "No description"}</span>
                      ) : (
                        <span style={{ fontStyle: "italic" }}>Not configured &mdash; click to edit</span>
                      )}
                    </p>
                  </div>
                  {isSaving && <span className="admin-badge success" style={{ fontSize: 11 }}>Saved!</span>}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--admin-text-muted)", flexShrink: 0 }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
