"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "@/components/ui/image-upload"

interface NavItem {
  label: string
  href: string
  children: { label: string; href: string }[]
}

interface HeaderData {
  logo: string
  topbarText: string
  shopNowLink: string
  hotlineText: string
  phoneNumber: string
  email: string
  navItems: NavItem[]
  socialLinks: Record<string, string>
}

const emptyHeader: HeaderData = {
  logo: "",
  topbarText: "",
  shopNowLink: "",
  hotlineText: "",
  phoneNumber: "",
  email: "",
  navItems: [],
  socialLinks: { twitter: "", instagram: "", facebook: "", youtube: "", linkedin: "", google: "" },
}

export default function HeaderPage() {
  const [data, setData] = useState<HeaderData>(emptyHeader)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const res = await fetch("/api/header")
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error("Failed to fetch header settings", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      setSaving(true)
      await fetch("/api/header", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error("Failed to save header settings", err)
    } finally {
      setSaving(false)
    }
  }

  function updateNav(index: number, field: keyof NavItem, value: string) {
    const items = [...data.navItems]
    items[index] = { ...items[index], [field]: value }
    setData({ ...data, navItems: items })
  }

  function updateChild(navIndex: number, childIndex: number, field: string, value: string) {
    const items = [...data.navItems]
    const children = [...items[navIndex].children]
    children[childIndex] = { ...children[childIndex], [field]: value }
    items[navIndex] = { ...items[navIndex], children }
    setData({ ...data, navItems: items })
  }

  function addChild(navIndex: number) {
    const items = [...data.navItems]
    items[navIndex] = { ...items[navIndex], children: [...items[navIndex].children, { label: "", href: "" }] }
    setData({ ...data, navItems: items })
  }

  function removeChild(navIndex: number, childIndex: number) {
    const items = [...data.navItems]
    items[navIndex] = { ...items[navIndex], children: items[navIndex].children.filter((_, i) => i !== childIndex) }
    setData({ ...data, navItems: items })
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Header Settings</h1>
          <p className="admin-page-subtitle">Manage your site header content and navigation</p>
        </div>
        <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Header"}
        </button>
      </div>

      {loading ? (
        <p style={{ color: "var(--admin-text-muted)" }}>Loading header settings...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Top Bar</h3>
                <p className="admin-card-desc">Top announcement bar and branding text</p>
              </div>
              {saved && <span className="admin-badge success" style={{ fontSize: 11 }}>Saved!</span>}
            </div>
            <div className="admin-card-body">
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-label">Topbar Text</label>
                  <input className="admin-input" value={data.topbarText} onChange={(e) => setData({ ...data, topbarText: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Shop Now Link</label>
                  <input className="admin-input" value={data.shopNowLink} onChange={(e) => setData({ ...data, shopNowLink: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-label">Hotline Text</label>
                  <input className="admin-input" value={data.hotlineText} onChange={(e) => setData({ ...data, hotlineText: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Phone Number</label>
                  <input className="admin-input" value={data.phoneNumber} onChange={(e) => setData({ ...data, phoneNumber: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-label">Email</label>
                  <input className="admin-input" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <ImageUpload value={data.logo} onChange={(url) => setData({ ...data, logo: url })} label="Logo" />
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Social Links</h3>
              <p className="admin-card-desc">Social media URLs in the top bar — add or remove platforms</p>
              <button className="admin-btn admin-btn-ghost admin-btn-xs" onClick={() => setData({ ...data, socialLinks: { ...data.socialLinks, [`new_${Date.now()}`]: "" } })}>
                + Add Social Link
              </button>
            </div>
            <div className="admin-card-body">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(data.socialLinks).map(([key, val], idx) => (
                  <div key={idx} className="admin-form-grid" style={{ gridTemplateColumns: "1fr 2fr auto" }}>
                    <div className="admin-form-group">
                      <label className="admin-label" style={{ fontSize: 11 }}>Platform</label>
                      <input className="admin-input" style={{ fontSize: 12 }} placeholder="e.g. twitter" value={key} onChange={(e) => {
                        const { [key]: _, ...rest } = data.socialLinks;
                        setData({ ...data, socialLinks: { ...rest, [e.target.value]: val } });
                      }} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label" style={{ fontSize: 11 }}>URL</label>
                      <input className="admin-input" style={{ fontSize: 12 }} placeholder="https://..." value={val} onChange={(e) => setData({ ...data, socialLinks: { ...data.socialLinks, [key]: e.target.value } })} />
                    </div>
                    <div style={{ alignSelf: "flex-end", paddingBottom: 4 }}>
                      <button className="admin-btn admin-btn-ghost admin-btn-xs" style={{ color: "var(--admin-danger)" }} onClick={() => {
                        const { [key]: _, ...rest } = data.socialLinks;
                        setData({ ...data, socialLinks: rest });
                      }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Navigation Menu</h3>
              <p className="admin-card-desc">Main navigation items and submenus</p>
            </div>
            <div className="admin-card-body">
              {data.navItems.map((item, i) => (
                <div key={i} style={{ marginBottom: 16, padding: 12, border: "1px solid var(--admin-border)", borderRadius: 8 }}>
                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label className="admin-label">Nav Label</label>
                      <input className="admin-input" value={item.label} onChange={(e) => updateNav(i, "label", e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Nav URL</label>
                      <input className="admin-input" value={item.href} onChange={(e) => updateNav(i, "href", e.target.value)} />
                    </div>
                  </div>
                  {item.children.length > 0 && (
                    <div style={{ marginTop: 8, paddingLeft: 16, borderLeft: "2px solid var(--admin-border)" }}>
                      <p style={{ fontSize: 12, color: "var(--admin-text-muted)", marginBottom: 8 }}>Sub-items:</p>
                      {item.children.map((child, ci) => (
                        <div key={ci} className="admin-form-grid" style={{ marginBottom: 8 }}>
                          <div className="admin-form-group">
                            <label className="admin-label" style={{ fontSize: 11 }}>Label</label>
                            <input className="admin-input" style={{ fontSize: 12 }} value={child.label} onChange={(e) => updateChild(i, ci, "label", e.target.value)} />
                          </div>
                          <div className="admin-form-group">
                            <label className="admin-label" style={{ fontSize: 11 }}>URL</label>
                            <input className="admin-input" style={{ fontSize: 12 }} value={child.href} onChange={(e) => updateChild(i, ci, "href", e.target.value)} />
                          </div>
                          <div style={{ alignSelf: "flex-end", paddingBottom: 4 }}>
                            <button className="admin-btn admin-btn-ghost admin-btn-xs" onClick={() => removeChild(i, ci)} style={{ color: "var(--admin-danger)" }}>Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button className="admin-btn admin-btn-ghost admin-btn-xs" onClick={() => addChild(i)} style={{ marginTop: 8 }}>
                    + Add Sub-item
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
