"use client"

import { useState } from "react"

type Tab = "general" | "shipping" | "payment" | "email"

const tabs: { id: Tab; label: string }[] = [
  { id: "general", label: "General" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "email", label: "Email" },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general")

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-subtitle">Manage your store settings</p>
        </div>
      </div>

      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button key={tab.id} className={`admin-tab ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {tab.id === "general" && <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>}
              {tab.id === "shipping" && <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>}
              {tab.id === "payment" && <><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></>}
              {tab.id === "email" && <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>}
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === "general" && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">General Information</h3>
              <p className="admin-card-desc">Basic store information</p>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-label">Store Name</label>
                <input className="admin-input" defaultValue="Beauty Cosmetic Store" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Store Email</label>
                <input className="admin-input" type="email" defaultValue="hello@beautycosmetic.com" />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Store Description</label>
              <textarea className="admin-textarea" defaultValue="Your premium destination for beauty and cosmetic products." />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Store Logo</label>
              <div className="admin-logo-upload">
                <div className="admin-logo-placeholder">B</div>
                <button className="admin-btn admin-btn-ghost admin-btn-sm">Upload Logo</button>
                <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: "var(--admin-danger)" }}>Remove</button>
              </div>
            </div>
            <div style={{ paddingTop: 16, borderTop: "1px solid var(--admin-border)" }}>
              <button className="admin-btn admin-btn-primary admin-btn-sm">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping */}
      {activeTab === "shipping" && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Shipping Zones</h3>
              <p className="admin-card-desc">Manage your shipping regions and rates</p>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="admin-zone">
              <div className="admin-zone-row">
                <div>
                  <p className="admin-zone-title">United States</p>
                  <p className="admin-zone-desc">Standard delivery 5-7 business days</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="admin-zone-price">$5.99</span>
                  <button className="admin-btn admin-btn-ghost admin-btn-xs">Edit</button>
                </div>
              </div>
              <div className="admin-zone-row" style={{ paddingTop: 12, marginTop: 12, borderTop: "1px solid var(--admin-border)" }}>
                <div>
                  <p className="admin-zone-title">Express Delivery</p>
                  <p className="admin-zone-desc">2-3 business days</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="admin-zone-price">$15.99</span>
                  <button className="admin-btn admin-btn-ghost admin-btn-xs">Edit</button>
                </div>
              </div>
            </div>
            <div className="admin-zone">
              <div className="admin-zone-row">
                <div>
                  <p className="admin-zone-title">International</p>
                  <p className="admin-zone-desc">Worldwide delivery 10-14 business days</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="admin-zone-price">$25.99</span>
                  <button className="admin-btn admin-btn-ghost admin-btn-xs">Edit</button>
                </div>
              </div>
            </div>
            <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ marginBottom: 16 }}>+ Add Shipping Zone</button>
            <div style={{ paddingTop: 16, borderTop: "1px solid var(--admin-border)" }}>
              <button className="admin-btn admin-btn-primary admin-btn-sm">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment */}
      {activeTab === "payment" && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Payment Methods</h3>
              <p className="admin-card-desc">Configure your payment gateways</p>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="admin-payment-item">
              <div className="admin-payment-left">
                <div className="admin-payment-icon blue">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </div>
                <div>
                  <p className="admin-payment-name">Stripe</p>
                  <p className="admin-payment-desc">Credit &amp; debit card payments</p>
                </div>
              </div>
              <div className="admin-payment-right">
                <span className="admin-badge success">Connected</span>
                <button className="admin-btn admin-btn-ghost admin-btn-xs">Configure</button>
              </div>
            </div>
            <div className="admin-payment-item">
              <div className="admin-payment-left">
                <div className="admin-payment-icon amber">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div>
                  <p className="admin-payment-name">PayPal</p>
                  <p className="admin-payment-desc">PayPal express checkout</p>
                </div>
              </div>
              <div className="admin-payment-right">
                <span className="admin-badge warning">Pending</span>
                <button className="admin-btn admin-btn-ghost admin-btn-xs">Setup</button>
              </div>
            </div>
            <div className="admin-payment-item">
              <div className="admin-payment-left">
                <div className="admin-payment-icon green">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <p className="admin-payment-name">Cash on Delivery</p>
                  <p className="admin-payment-desc">Pay when order arrives</p>
                </div>
              </div>
              <div className="admin-payment-right">
                <span className="admin-badge success">Active</span>
                <button className="admin-btn admin-btn-ghost admin-btn-xs">Configure</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email */}
      {activeTab === "email" && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Email Configuration</h3>
              <p className="admin-card-desc">Configure your email settings for transactional emails</p>
            </div>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-label">SMTP Host</label>
                <input className="admin-input" placeholder="smtp.example.com" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">SMTP Port</label>
                <input className="admin-input" placeholder="587" />
              </div>
            </div>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-label">SMTP Username</label>
                <input className="admin-input" placeholder="your@email.com" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">SMTP Password</label>
                <input className="admin-input" type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">From Email</label>
              <input className="admin-input" placeholder="noreply@beautycosmetic.com" />
            </div>
            <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid var(--admin-border)" }}>
              <button className="admin-btn admin-btn-primary admin-btn-sm">Save Changes</button>
              <button className="admin-btn admin-btn-ghost admin-btn-sm">Test Email</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
