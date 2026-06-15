"use client"

import { useState, useEffect, useRef } from "react"
import { ImageUpload } from "@/components/ui/image-upload"
import AdminPagination from "@/components/admin/admin-pagination"

const ITEMS_PER_PAGE = 10

interface Story {
  id: number
  type: "image" | "text" | "video"
  content: string
  caption?: string
  duration: number
  link: string
  active: boolean
  createdAt: string
  expiresAt: string
  expired?: boolean
}

interface FormState { type: "image" | "text" | "video"; content: string; caption: string; duration: number; link: string; active: boolean }

const emptyForm: FormState = { type: "image", content: "", caption: "", duration: 1, link: "", active: true }

export default function AdminStoriesPage() {
  const [items, setItems] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Story | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [videoUploading, setVideoUploading] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)

  async function handleVideoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setVideoUploading(true)
    try {
      const reader = new FileReader()
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
      })
      setForm((prev) => ({ ...prev, content: dataUrl }))
    } catch (err) {
      console.error("Failed to read video", err)
      setFormError("Failed to read video file")
    } finally {
      setVideoUploading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  async function fetchItems() {
    try {
      setLoading(true)
      const res = await fetch("/api/stories")
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to fetch stories", err)
    } finally {
      setLoading(false)
    }
  }

  function openAdd() {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
    setFormError("")
  }

  function openEdit(item: Story) {
    setEditing(item)
    setForm({ type: item.type, content: item.content, caption: item.caption || "", duration: item.duration, link: item.link || "", active: item.active })
    setShowForm(true)
    setFormError("")
  }

  function cancelForm() {
    setShowForm(false)
    setEditing(null)
    setForm(emptyForm)
    setFormError("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.content) { setFormError("Content is required"); return }
    try {
      setSubmitting(true)
      setFormError("")
      let res
      if (editing) {
        res = await fetch(`/api/stories/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      } else {
        res = await fetch("/api/stories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Server error (${res.status})`)
      }
      cancelForm()
      await fetchItems()
    } catch (err) {
      setFormError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeactivate(id: number) {
    if (!confirm("Deactivate this story? It will be hidden from the frontend.")) return
    try {
      await fetch(`/api/stories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: false }),
      })
      await fetchItems()
    } catch (err) {
      console.error("Failed to deactivate story", err)
    }
  }

  async function handleRepost(id: number) {
    try {
      await fetch(`/api/stories/${id}`, { method: "POST" })
      await fetchItems()
    } catch (err) {
      console.error("Failed to repost story", err)
    }
  }

  async function handleReactivate(id: number) {
    try {
      await fetch(`/api/stories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: true }),
      })
      await fetchItems()
    } catch (err) {
      console.error("Failed to reactivate story", err)
    }
  }

  const filtered = items
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Stories</h1>
          <p className="admin-page-subtitle">Manage stories visible on the homepage</p>
        </div>
        <div className="admin-page-actions">
          {!showForm && (
            <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={openAdd}>+ Add Story</button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">{editing ? "Edit Story" : "Add Story"}</h3>
          </div>
          <div className="admin-card-body">
            <form onSubmit={handleSubmit}>
              {formError && (
                <div style={{ background: "#fef2f2", color: "#b91c1c", padding: "8px 12px", borderRadius: 8, marginBottom: 12, fontSize: 14 }}>
                  {formError}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div className="admin-form-group">
                  <label className="admin-label">Type</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(["image", "text", "video"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`admin-filter-btn ${form.type === t ? "active" : ""}`}
                        onClick={() => setForm({ ...form, type: t, content: "" })}
                        style={{ textTransform: "capitalize" }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Duration</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[1, 2, 3].map((d) => (
                      <button
                        key={d}
                        type="button"
                        className={`admin-filter-btn ${form.duration === d ? "active" : ""}`}
                        onClick={() => setForm({ ...form, duration: d })}
                      >
                        {d} Day{d > 1 ? "s" : ""}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {form.type === "image" && (
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <ImageUpload value={form.content.startsWith("data:") || form.content.startsWith("/") || form.content.startsWith("http") ? form.content : ""} onChange={(url) => setForm((prev) => ({ ...prev, content: url }))} label="Image" />
                </div>
              )}

              {form.type === "text" && (
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <label className="admin-label">Text Content</label>
                  <textarea
                    className="admin-input"
                    rows={4}
                    placeholder="Enter story text..."
                    value={form.content.startsWith("data:") || form.content.startsWith("/") || form.content.startsWith("http") ? "" : form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    style={{ resize: "vertical" }}
                  />
                </div>
              )}

              {form.type === "video" && (
                <>
                  <div className="admin-form-group" style={{ marginBottom: 12 }}>
                    <label className="admin-label">Video URL</label>
                    <input
                      className="admin-input"
                      placeholder="https://example.com/video.mp4"
                      value={form.content.startsWith("http") && !form.content.startsWith("data:") ? form.content : ""}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 12 }}>
                    <label className="admin-label">Or upload video file</label>
                    <div>
                      <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => videoInputRef.current?.click()}>
                        {videoUploading ? "Uploading..." : "Choose Video File"}
                      </button>
                      <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoFile} style={{ display: "none" }} />
                    </div>
                  </div>
                </>
              )}

              {(form.type === "image" || form.type === "video") && (
                <div className="admin-form-group" style={{ marginBottom: 12 }}>
                  <label className="admin-label">Caption (text overlay)</label>
                  <textarea
                    className="admin-input"
                    rows={2}
                    placeholder="Optional text to show over the image/video..."
                    value={form.caption}
                    onChange={(e) => setForm({ ...form, caption: e.target.value })}
                    style={{ resize: "vertical" }}
                  />
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div className="admin-form-group">
                  <label className="admin-label">Link URL (optional)</label>
                  <input className="admin-input" placeholder="https://..." value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
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
          <h3 className="admin-card-title">All Stories</h3>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Expires</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--admin-text-muted)" }}>Loading...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--admin-text-muted)" }}>No stories found</td></tr>
              ) : (
                paginated.map((item) => {
                  const expired = item.expired || new Date(item.expiresAt) < new Date()
                  return (
                    <tr key={item.id}>
                      <td>
                        {item.type === "image" ? (
                          <img src={item.content} alt="Story" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
                        ) : item.type === "video" ? (
                          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--admin-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18 }}>▶</div>
                        ) : (
                          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--admin-warning)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>T</div>
                        )}
                      </td>
                      <td style={{ textTransform: "capitalize" }}>{item.type}</td>
                      <td>{item.duration} day{item.duration > 1 ? "s" : ""}</td>
                      <td style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>
                        {new Date(item.expiresAt).toLocaleDateString()} {new Date(item.expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td>
                        {expired ? (
                          <span className="admin-badge danger">Expired</span>
                        ) : (
                          <span className={`admin-badge ${item.active ? "success" : "warning"}`}>
                            {item.active ? "Active" : "Inactive"}
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button className="admin-btn-icon" onClick={() => openEdit(item)} title="Edit">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        {!item.active && !expired && (
                          <button className="admin-btn-icon" onClick={() => handleReactivate(item.id)} title="Reactivate">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                          </button>
                        )}
                        {expired && (
                          <button className="admin-btn-icon" onClick={() => handleRepost(item.id)} title="Repost (renew)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="22 12 18 12 18 16"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L22 10"/></svg>
                          </button>
                        )}
                        <button className="admin-btn-icon" onClick={() => handleDeactivate(item.id)} title="Deactivate">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="admin-table-footer">
          <span>{items.length} stor{items.length === 1 ? "y" : "ies"}</span>
          <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  )
}
