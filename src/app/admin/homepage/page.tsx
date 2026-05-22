"use client"

import { useState, useEffect, useRef } from "react"

interface SectionItem {
  id: number;
  [key: string]: any;
}

interface SectionConfig {
  key: string;
  label: string;
  api: string;
  fields: { key: string; label: string; type: "text" | "image" | "textarea" | "number" | "toggle" }[];
  displayFields: string[];
  imageField: string;
}

const sections: SectionConfig[] = [
  {
    key: "banners", label: "Hero Banners", api: "/api/banners",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
      { key: "image", label: "Image URL", type: "image" },
      { key: "link", label: "Link URL", type: "text" },
      { key: "btnText", label: "Button Text", type: "text" },
      { key: "order", label: "Order", type: "number" },
      { key: "active", label: "Active", type: "toggle" },
    ],
    displayFields: ["title", "subtitle", "link"],
    imageField: "image",
  },
  {
    key: "categories", label: "Popular Categories", api: "/api/categories",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "image", label: "Image URL", type: "image" },
      { key: "description", label: "Description", type: "text" },
    ],
    displayFields: ["name", "slug"],
    imageField: "image",
  },
  {
    key: "testimonials", label: "Testimonials", api: "/api/testimonials",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "text", label: "Quote", type: "textarea" },
      { key: "image", label: "Image URL", type: "image" },
      { key: "rating", label: "Rating", type: "number" },
      { key: "active", label: "Active", type: "toggle" },
    ],
    displayFields: ["name", "role"],
    imageField: "image",
  },
  {
    key: "brands", label: "Brands", api: "/api/brands",
    fields: [
      { key: "name", label: "Brand Name", type: "text" },
      { key: "image", label: "Logo URL", type: "image" },
      { key: "link", label: "Link URL", type: "text" },
      { key: "order", label: "Order", type: "number" },
      { key: "active", label: "Active", type: "toggle" },
    ],
    displayFields: ["name"],
    imageField: "image",
  },
  {
    key: "blogPosts", label: "Blog Posts", api: "/api/blog-posts",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "image", label: "Image URL", type: "image" },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "author", label: "Author", type: "text" },
    ],
    displayFields: ["title", "author"],
    imageField: "image",
  },
  {
    key: "products", label: "Products (Best Sellers / New Arrivals)", api: "/api/products",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "image", label: "Image URL", type: "image" },
      { key: "price", label: "Price", type: "number" },
      { key: "salePrice", label: "Sale Price", type: "number" },
      { key: "bgColor", label: "Background Color", type: "text" },
      { key: "isBestSeller", label: "Best Seller", type: "toggle" },
      { key: "isNewArrival", label: "New Arrival", type: "toggle" },
      { key: "isFeatured", label: "Featured", type: "toggle" },
    ],
    displayFields: ["name", "price"],
    imageField: "image",
  },
]

export default function HomepageAdminPage() {
  const [sectionData, setSectionData] = useState<Record<string, SectionItem[]>>({})
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<{ section: string; item: SectionItem | null } | null>(null)
  const [form, setForm] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState("")
  const [activeSection, setActiveSection] = useState("banners")
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      const results = await Promise.all(
        sections.map(async (sec) => {
          try {
            const res = await fetch(sec.api)
            const data = await res.json()
            return { key: sec.key, data: Array.isArray(data) ? data : data[sec.key] || data.items || [] }
          } catch {
            return { key: sec.key, data: [] }
          }
        })
      )
      const map: Record<string, SectionItem[]> = {}
      results.forEach((r) => { map[r.key] = r.data })
      setSectionData(map)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  async function handleImageUpload(file: File): Promise<string> {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      return data.url || ""
    } catch {
      return ""
    } finally {
      setUploading(false)
    }
  }

  function openEdit(section: string, item: SectionItem | null) {
    setEditing({ section, item })
    if (item) {
      const f: Record<string, any> = {}
      const sec = sections.find((s) => s.key === section)
      sec?.fields.forEach((field) => {
        f[field.key] = item[field.key] !== undefined ? item[field.key] : ""
      })
      setForm(f)
    } else {
      const f: Record<string, any> = {}
      const sec = sections.find((s) => s.key === section)
      sec?.fields.forEach((field) => {
        f[field.key] = field.type === "toggle" ? false : field.type === "number" ? 0 : ""
      })
      setForm(f)
    }
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    try {
      const sec = sections.find((s) => s.key === editing.section)!
      const method = editing.item ? "PUT" : "POST"
      const url = editing.item ? `${sec.api}/${editing.item.id}` : sec.api
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Save failed")
      const saved = await res.json()
      showToast(editing.item ? "Item updated" : "Item created")
      setEditing(null)
      fetchAll()
    } catch (e) {
      showToast("Save failed")
    }
    setSaving(false)
  }

  async function handleDelete(section: string, item: SectionItem) {
    if (!confirm(`Delete this item?`)) return
    try {
      const sec = sections.find((s) => s.key === section)!
      await fetch(`${sec.api}/${item.id}`, { method: "DELETE" })
      showToast("Item deleted")
      fetchAll()
    } catch {
      showToast("Delete failed")
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await handleImageUpload(file)
    if (url) setForm({ ...form, image: url })
    if (fileRef.current) fileRef.current.value = ""
  }

  const editors = sections.find((s) => s.key === activeSection)

  return (
    <div>
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 99999, background: "#10b981", color: "#fff", padding: "12px 24px", borderRadius: 8, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
          {toast}
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Homepage Builder</h1>
          <p className="admin-page-subtitle">Manage all homepage sections — add, edit, delete items with images & links</p>
        </div>
      </div>

      <div className="admin-tabs" style={{ marginBottom: 24, flexWrap: "wrap" }}>
        {sections.map((sec) => (
          <button key={sec.key} className={`admin-tab ${activeSection === sec.key ? "active" : ""}`} onClick={() => setActiveSection(sec.key)}>
            {sec.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-card" style={{ padding: 40, textAlign: "center" }}>
          <p style={{ color: "var(--admin-text-muted)" }}>Loading sections...</p>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--admin-text)" }}>
              {editors?.label} ({sectionData[activeSection]?.length || 0})
            </h3>
            <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => openEdit(activeSection, null)}>
              + Add New
            </button>
          </div>

          {(!sectionData[activeSection] || sectionData[activeSection].length === 0) ? (
            <div className="admin-card" style={{ padding: 40, textAlign: "center" }}>
              <p style={{ color: "var(--admin-text-muted)" }}>No items yet. Click "Add New" to create one.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {sectionData[activeSection].map((item) => (
                <div key={item.id} className="admin-card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px" }}>
                  {editors?.imageField && item[editors.imageField] && (
                    <img src={item[editors.imageField]} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover", flexShrink: 0, background: "#f0f0f0" }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--admin-text)", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {editors!.displayFields.map((f) => item[f]).filter(Boolean).join(" — ") || `#${item.id}`}
                    </div>
                    {editors!.displayFields.some((f) => item[f] && f !== editors!.displayFields[0]) && (
                      <div style={{ fontSize: 12, color: "var(--admin-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {editors!.displayFields.slice(1).map((f) => item[f]).filter(Boolean).join(" | ")}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openEdit(activeSection, item)}>Edit</button>
                    <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: "#ef4444" }} onClick={() => handleDelete(activeSection, item)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {editing && editors && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99998, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}
          onClick={(e) => { if (e.target === e.currentTarget) setEditing(null) }}
        >
          <div className="admin-card" style={{ width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto" }}>
            <div className="admin-card-header">
              <h3 className="admin-card-title">{editing.item ? "Edit" : "Add"} {editors.label}</h3>
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setEditing(null)} style={{ fontSize: 18 }}>✕</button>
            </div>
            <div className="admin-card-body">
              {editors.fields.map((field) => (
                <div className="admin-form-group" key={field.key}>
                  <label className="admin-label">{field.label}</label>
                  {field.type === "toggle" ? (
                    <label className="admin-toggle">
                      <input type="checkbox" checked={!!form[field.key]} onChange={(e) => setForm({ ...form, [field.key]: e.target.checked })} />
                      <span className="admin-toggle-slider"></span>
                    </label>
                  ) : field.type === "image" ? (
                    <div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input className="admin-input" style={{ flex: 1 }} placeholder="Paste image URL..." value={form[field.key] || ""} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} />
                        <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => fileRef.current?.click()}>
                          {uploading ? "..." : "Upload"}
                        </button>
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileSelect} />
                      {form[field.key] && (
                        <div style={{ marginTop: 8, borderRadius: 8, overflow: "hidden", width: 120, height: 80, background: "#f0f0f0" }}>
                          <img src={form[field.key]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                        </div>
                      )}
                    </div>
                  ) : field.type === "textarea" ? (
                    <textarea className="admin-textarea" value={form[field.key] || ""} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} />
                  ) : field.type === "number" ? (
                    <input className="admin-input" type="number" step="0.01" value={form[field.key] ?? ""} onChange={(e) => setForm({ ...form, [field.key]: e.target.value ? Number(e.target.value) : "" })} />
                  ) : (
                    <input className="admin-input" value={form[field.key] || ""} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} />
                  )}
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : editing.item ? "Update" : "Create"}
                </button>
                <button className="admin-btn admin-btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
