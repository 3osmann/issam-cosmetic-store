"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const defaultContactInfo = [
  { icon: "fa-solid fa-location-dot", label: "Our Address", value: "123 Beauty Street, Fashion District, New York, NY 10001" },
  { icon: "fa-solid fa-phone", label: "Phone Number", value: "+1 (555) 123-4567" },
  { icon: "fa-solid fa-envelope", label: "Email Address", value: "hello@beautystore.com" },
  { icon: "fa-solid fa-clock", label: "Working Hours", value: "Mon - Sat: 9:00 AM - 9:00 PM" },
]

export default function ContactPage() {
  const { t } = useLanguage()
  const [contactInfo, setContactInfo] = useState(defaultContactInfo)
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.site_info) {
          const info = data.site_info
          setContactInfo([
            { icon: "fa-solid fa-location-dot", label: "Our Address", value: info.address || defaultContactInfo[0].value },
            { icon: "fa-solid fa-phone", label: "Phone Number", value: info.phone || defaultContactInfo[1].value },
            { icon: "fa-solid fa-envelope", label: "Email Address", value: info.email || defaultContactInfo[2].value },
            { icon: "fa-solid fa-clock", label: "Working Hours", value: "Mon - Sat: 9:00 AM - 9:00 PM" },
          ])
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Failed to send")
      setSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ padding: "150px 0 80px" }}>
      <div className="container">
        <div className="row" style={{ marginBottom: 60 }}>
          <div className="col-12 text-center">
            <h1 style={{ fontFamily: "Elsie, serif", fontSize: 36, marginBottom: 12 }}>{t("contact.get_in_touch")}</h1>
            <p style={{ color: "#666", maxWidth: 500, margin: "0 auto" }}>{t("contact.description")}</p>
          </div>
        </div>

        <div className="row">
          {contactInfo.map((info, i) => (
            <div key={i} className="col-lg-3 col-md-6 mb-4">
              <div style={{ textAlign: "center", padding: "30px 20px", border: "1px solid #eee", borderRadius: 12, height: "100%", transition: "0.3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FF5894"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,88,148,0.1)" }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.boxShadow = "none" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,88,148,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <i className={info.icon} style={{ fontSize: 22, color: "#FF5894" }}></i>
                </div>
                <h5 style={{ fontFamily: "Elsie, serif", fontSize: 16, marginBottom: 8 }}>{info.label}</h5>
                <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{info.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="row" style={{ marginTop: 20 }}>
          <div className="col-lg-8 mx-auto">
            <div style={{ padding: "40px", border: "1px solid #eee", borderRadius: 16, background: "#fff" }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#d4edda", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <i className="fa-solid fa-check" style={{ fontSize: 28, color: "#28a745" }}></i>
                  </div>
                  <h3 style={{ fontFamily: "Elsie, serif", fontSize: 22, marginBottom: 8 }}>{t("contact.sent")}</h3>
                  <p style={{ color: "#666", marginBottom: 24 }}>{t("contact.sent_hint")}</p>
                  <button className="btn" style={{ background: "#FF5894", color: "#fff", padding: "10px 28px", borderRadius: 8, border: "none", cursor: "pointer" }} onClick={() => setSubmitted(false)}>
                    {t("contact.send_another")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontFamily: "Elsie, serif", fontSize: 22, marginBottom: 24, textAlign: "center" }}>{t("contact.send_message")}</h3>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6, color: "#333" }}>{t("contact.full_name")} *</label>
                      <input name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
                        style={{ width: "100%", padding: "12px 16px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" }}
                        onFocus={(e) => e.target.style.borderColor = "#FF5894"}
                        onBlur={(e) => e.target.style.borderColor = "#ddd"}
                        placeholder={t("contact.full_name")} />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6, color: "#333" }}>{t("contact.email")} *</label>
                      <input name="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required
                        style={{ width: "100%", padding: "12px 16px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" }}
                        onFocus={(e) => e.target.style.borderColor = "#FF5894"}
                        onBlur={(e) => e.target.style.borderColor = "#ddd"}
                        placeholder="email@example.com" />
                    </div>
                    <div className="col-12 mb-4">
                      <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6, color: "#333" }}>{t("contact.subject")} *</label>
                      <input name="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required
                        style={{ width: "100%", padding: "12px 16px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none" }}
                        onFocus={(e) => e.target.style.borderColor = "#FF5894"}
                        onBlur={(e) => e.target.style.borderColor = "#ddd"}
                        placeholder={t("contact.subject")} />
                    </div>
                    <div className="col-12 mb-4">
                      <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6, color: "#333" }}>{t("contact.message")} *</label>
                      <textarea name="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={5} required
                        style={{ width: "100%", padding: "12px 16px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit" }}
                        onFocus={(e) => e.target.style.borderColor = "#FF5894"}
                        onBlur={(e) => e.target.style.borderColor = "#ddd"}
                        placeholder="Write your message here..." />
                    </div>
                    {error && <div className="col-12 mb-3"><p style={{ color: "#dc3545", fontSize: 14 }}>{error}</p></div>}
                    <div className="col-12 text-center">
                      <button type="submit" disabled={sending}
                        style={{ background: "#FF5894", color: "#fff", padding: "12px 40px", borderRadius: 8, border: "none", cursor: sending ? "not-allowed" : "pointer", fontSize: 16, fontWeight: 500, opacity: sending ? 0.7 : 1, transition: "0.2s" }}>
                        {sending ? <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }}></i> Sending...</> : <><i className="fa-solid fa-paper-plane" style={{ marginRight: 8 }}></i> {t("contact.send")}</>}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
