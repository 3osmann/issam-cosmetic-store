"use client"

import { useState, useEffect } from "react"
import { ImageUpload } from "@/components/ui/image-upload"

interface LinkItem {
  label: string
  href: string
}

interface LinkGroup {
  heading: string
  links: LinkItem[]
}

interface FooterData {
  logo: string
  aboutText: string
  phoneNumber: string
  email: string
  address: string
  featureBoxes: { title: string }[]
  linkGroups: LinkGroup[]
  socialLinks: Record<string, string>
  copyright: string
  paymentIcons: string[]
}

const emptyFooter: FooterData = {
  logo: "",
  aboutText: "",
  phoneNumber: "",
  email: "",
  address: "",
  featureBoxes: [],
  linkGroups: [],
  socialLinks: { twitter: "", instagram: "", facebook: "", youtube: "", linkedin: "" },
  copyright: "",
  paymentIcons: [],
}

export default function FooterPage() {
  const [data, setData] = useState<FooterData>(emptyFooter)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const res = await fetch("/api/footer")
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error("Failed to fetch footer settings", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      setSaving(true)
      await fetch("/api/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error("Failed to save footer settings", err)
    } finally {
      setSaving(false)
    }
  }

  function addFeature() {
    setData({ ...data, featureBoxes: [...data.featureBoxes, { title: "" }] })
  }

  function updateFeature(i: number, val: string) {
    const boxes = [...data.featureBoxes]
    boxes[i] = { title: val }
    setData({ ...data, featureBoxes: boxes })
  }

  function removeFeature(i: number) {
    setData({ ...data, featureBoxes: data.featureBoxes.filter((_, idx) => idx !== i) })
  }

  function addLinkGroup() {
    setData({ ...data, linkGroups: [...data.linkGroups, { heading: "", links: [] }] })
  }

  function updateLinkGroup(i: number, heading: string) {
    const groups = [...data.linkGroups]
    groups[i] = { ...groups[i], heading }
    setData({ ...data, linkGroups: groups })
  }

  function addLinkToGroup(gi: number) {
    const groups = [...data.linkGroups]
    groups[gi] = { ...groups[gi], links: [...groups[gi].links, { label: "", href: "" }] }
    setData({ ...data, linkGroups: groups })
  }

  function updateLinkInGroup(gi: number, li: number, field: string, val: string) {
    const groups = [...data.linkGroups]
    const links = [...groups[gi].links]
    links[li] = { ...links[li], [field]: val }
    groups[gi] = { ...groups[gi], links }
    setData({ ...data, linkGroups: groups })
  }

  function removeLinkFromGroup(gi: number, li: number) {
    const groups = [...data.linkGroups]
    groups[gi] = { ...groups[gi], links: groups[gi].links.filter((_, idx) => idx !== li) }
    setData({ ...data, linkGroups: groups })
  }

  function removeLinkGroup(i: number) {
    setData({ ...data, linkGroups: data.linkGroups.filter((_, idx) => idx !== i) })
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Footer Settings</h1>
          <p className="admin-page-subtitle">Manage your site footer content and links</p>
        </div>
        <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Footer"}
        </button>
      </div>

      {loading ? (
        <p style={{ color: "var(--admin-text-muted)" }}>Loading footer settings...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">General Info</h3>
                <p className="admin-card-desc">Logo, about text, contact details</p>
              </div>
              {saved && <span className="admin-badge success" style={{ fontSize: 11 }}>Saved!</span>}
            </div>
            <div className="admin-card-body">
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <ImageUpload value={data.logo} onChange={(url) => setData({ ...data, logo: url })} label="Logo" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Copyright Text</label>
                  <input className="admin-input" value={data.copyright} onChange={(e) => setData({ ...data, copyright: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">About Text</label>
                <textarea className="admin-textarea" rows={3} value={data.aboutText} onChange={(e) => setData({ ...data, aboutText: e.target.value })} />
              </div>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-label">Phone Number</label>
                  <input className="admin-input" value={data.phoneNumber} onChange={(e) => setData({ ...data, phoneNumber: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Email</label>
                  <input className="admin-input" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Address</label>
                <input className="admin-input" value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Feature Boxes</h3>
              <p className="admin-card-desc">Feature icons shown above the footer</p>
            </div>
            <div className="admin-card-body">
              {data.featureBoxes.map((box, i) => (
                <div key={i} className="admin-form-grid" style={{ marginBottom: 8 }}>
                  <div className="admin-form-group">
                    <label className="admin-label" style={{ fontSize: 11 }}>Feature Title</label>
                    <input className="admin-input" style={{ fontSize: 12 }} value={box.title} onChange={(e) => updateFeature(i, e.target.value)} />
                  </div>
                  <div style={{ alignSelf: "flex-end", paddingBottom: 4 }}>
                    <button className="admin-btn admin-btn-ghost admin-btn-xs" onClick={() => removeFeature(i)} style={{ color: "var(--admin-danger)" }}>Remove</button>
                  </div>
                </div>
              ))}
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={addFeature}>+ Add Feature Box</button>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Social Links</h3>
              <p className="admin-card-desc">Social media URLs in the footer</p>
            </div>
            <div className="admin-card-body">
              <div className="admin-form-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {Object.entries(data.socialLinks).map(([key, val]) => (
                  <div className="admin-form-group" key={key}>
                    <label className="admin-label" style={{ textTransform: "capitalize" }}>{key}</label>
                    <input className="admin-input" value={val} onChange={(e) => setData({ ...data, socialLinks: { ...data.socialLinks, [key]: e.target.value } })} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Link Groups</h3>
              <p className="admin-card-desc">Footer link columns (Top Categories, Company, etc.)</p>
            </div>
            <div className="admin-card-body">
              {data.linkGroups.map((group, gi) => (
                <div key={gi} style={{ marginBottom: 16, padding: 12, border: "1px solid var(--admin-border)", borderRadius: 8 }}>
                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label className="admin-label">Group Heading</label>
                      <input className="admin-input" value={group.heading} onChange={(e) => updateLinkGroup(gi, e.target.value)} />
                    </div>
                    <div style={{ alignSelf: "flex-end", paddingBottom: 4 }}>
                      <button className="admin-btn admin-btn-ghost admin-btn-xs" onClick={() => removeLinkGroup(gi)} style={{ color: "var(--admin-danger)" }}>Remove Group</button>
                    </div>
                  </div>
                  {group.links.map((link, li) => (
                    <div key={li} className="admin-form-grid" style={{ marginTop: 8 }}>
                      <div className="admin-form-group">
                        <label className="admin-label" style={{ fontSize: 11 }}>Label</label>
                        <input className="admin-input" style={{ fontSize: 12 }} value={link.label} onChange={(e) => updateLinkInGroup(gi, li, "label", e.target.value)} />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-label" style={{ fontSize: 11 }}>URL</label>
                        <input className="admin-input" style={{ fontSize: 12 }} value={link.href} onChange={(e) => updateLinkInGroup(gi, li, "href", e.target.value)} />
                      </div>
                      <div style={{ alignSelf: "flex-end", paddingBottom: 4 }}>
                        <button className="admin-btn admin-btn-ghost admin-btn-xs" onClick={() => removeLinkFromGroup(gi, li)} style={{ color: "var(--admin-danger)" }}>Remove</button>
                      </div>
                    </div>
                  ))}
                  <button className="admin-btn admin-btn-ghost admin-btn-xs" onClick={() => addLinkToGroup(gi)} style={{ marginTop: 8 }}>
                    + Add Link
                  </button>
                </div>
              ))}
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={addLinkGroup}>+ Add Link Group</button>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Payment Icons</h3>
              <p className="admin-card-desc">Image URLs shown in the copyright bar</p>
            </div>
            <div className="admin-card-body">
              {data.paymentIcons.map((icon, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <ImageUpload value={icon} onChange={(url) => {
                    const icons = [...data.paymentIcons]
                    icons[i] = url
                    setData({ ...data, paymentIcons: icons })
                  }} label={`Payment Icon ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
