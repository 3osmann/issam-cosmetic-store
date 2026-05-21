"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface HomepageSettings {
  heroTitle: string
  heroSubtitle: string
  dealsHeading: string
  featuredCategories: string[]
}

const emptySettings: HomepageSettings = { heroTitle: "", heroSubtitle: "", dealsHeading: "", featuredCategories: [] }

export default function HomepagePage() {
  const [activeTab, setActiveTab] = useState("sections")
  const [settings, setSettings] = useState<HomepageSettings>(emptySettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { fetchSettings() }, [])

  async function fetchSettings() {
    try {
      setLoading(true)
      const res = await fetch("/api/homepage-settings")
      const data = await res.json()
      if (data) setSettings({ heroTitle: data.heroTitle || "", heroSubtitle: data.heroSubtitle || "", dealsHeading: data.dealsHeading || "", featuredCategories: data.featuredCategories || [] })
    } catch (err) {
      console.error("Failed to fetch homepage settings", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveSettings() {
    try {
      setSaving(true)
      await fetch("/api/homepage-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error("Failed to save homepage settings", err)
    } finally {
      setSaving(false)
    }
  }

  const sections = [
    { key: "banners", label: "Banners", desc: "Hero banners shown at the top of the homepage", href: "/admin/banners" },
    { key: "categories", label: "Categories", desc: "Featured category cards", href: "/admin/categories" },
    { key: "deals", label: "Best Sellers / Deals", desc: "Product deals and best-selling items", href: "/admin/products" },
    { key: "newArrivals", label: "New Arrivals", desc: "Recently added products", href: "/admin/products" },
    { key: "testimonials", label: "Testimonials", desc: "Customer reviews and ratings", href: "/admin/testimonials" },
    { key: "brands", label: "Brands", desc: "Partner brand logos", href: "/admin/brands" },
  ]

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Homepage</h1>
          <p className="admin-page-subtitle">Configure your homepage layout and content</p>
        </div>
      </div>

      <div className="admin-tabs" style={{ marginBottom: 24 }}>
        <button className={`admin-tab ${activeTab === "sections" ? "active" : ""}`} onClick={() => setActiveTab("sections")}>Sections</button>
        <button className={`admin-tab ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>Settings</button>
      </div>

      {activeTab === "sections" && (
        <div>
          <p className="admin-page-subtitle" style={{ marginBottom: 16 }}>
            The homepage displays sections in the order below. Click "Manage" to edit the content for each section.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {sections.map((section) => (
              <div className="admin-card" key={section.key}>
                <div className="admin-card-body">
                  <h3 className="admin-card-title" style={{ marginBottom: 4 }}>{section.label}</h3>
                  <p style={{ fontSize: 12, color: "var(--admin-text-muted)", marginBottom: 16 }}>{section.desc}</p>
                  <Link href={section.href} className="admin-btn admin-btn-primary admin-btn-sm" style={{ textDecoration: "none", display: "inline-block" }}>
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Homepage Text Settings</h3>
            {saved && <span className="admin-badge success" style={{ fontSize: 11 }}>Saved!</span>}
          </div>
          <div className="admin-card-body">
            {loading ? (
              <p style={{ color: "var(--admin-text-muted)" }}>Loading settings...</p>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Hero Title</label>
                    <input className="admin-input" value={settings.heroTitle} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} placeholder="e.g. Discover Your Beauty" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Hero Subtitle</label>
                    <input className="admin-input" value={settings.heroSubtitle} onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })} placeholder="e.g. Premium cosmetics for every skin type" />
                  </div>
                </div>
                <div className="admin-form-group" style={{ marginBottom: 16 }}>
                  <label className="admin-label">Deals / Best Sellers Heading</label>
                  <input className="admin-input" value={settings.dealsHeading} onChange={(e) => setSettings({ ...settings, dealsHeading: e.target.value })} placeholder="e.g. Best Sellers" />
                </div>
                <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleSaveSettings} disabled={saving}>
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
