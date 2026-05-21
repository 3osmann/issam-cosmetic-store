"use client"

import { useState } from "react"

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 890",
    address: "123 Beauty Street",
    city: "New York",
    country: "United States",
    zip: "10001",
  })
  const [saved, setSaved] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Account Settings</h1>
          <p className="admin-page-subtitle">Manage your personal information and address</p>
        </div>
        {saved && <span className="admin-badge success">Saved!</span>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Personal Information</h3>
            <p className="admin-card-desc">Update your name, email, and phone number</p>
          </div>
          <div className="admin-card-body">
            <form onSubmit={handleSave}>
              <div className="admin-form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="admin-form-group">
                  <label className="admin-label">Full Name</label>
                  <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Email Address</label>
                  <input className="admin-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Phone Number</label>
                  <input className="admin-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <button className="admin-btn admin-btn-primary admin-btn-sm" type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Shipping Address</h3>
            <p className="admin-card-desc">Your default delivery address</p>
          </div>
          <div className="admin-card-body">
            <form onSubmit={handleSave}>
              <div className="admin-form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="admin-label">Address</label>
                  <input className="admin-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">City</label>
                  <input className="admin-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Country</label>
                  <input className="admin-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">ZIP / Postal Code</label>
                  <input className="admin-input" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <button className="admin-btn admin-btn-primary admin-btn-sm" type="submit">Update Address</button>
              </div>
            </form>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Password</h3>
            <p className="admin-card-desc">Change your account password</p>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div className="admin-form-group">
                <label className="admin-label">Current Password</label>
                <input className="admin-input" type="password" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">New Password</label>
                <input className="admin-input" type="password" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Confirm New Password</label>
                <input className="admin-input" type="password" />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <button className="admin-btn admin-btn-primary admin-btn-sm">Change Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
