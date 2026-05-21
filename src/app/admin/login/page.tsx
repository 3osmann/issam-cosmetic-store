"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@beautycosmetic.com")
  const [password, setPassword] = useState("admin123")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [show, setShow] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.error || "Login failed")
        return
      }
      router.push("/admin/dashboard")
    } catch {
      setError("Connection error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-body" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute", top: "-40%", right: "-20%", width: "500px", height: "500px",
          borderRadius: "50%", background: "rgba(124, 58, 237, 0.08)", filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute", bottom: "-40%", left: "-20%", width: "500px", height: "500px",
          borderRadius: "50%", background: "rgba(236, 72, 153, 0.05)", filter: "blur(80px)",
        }} />
      </div>

      <div style={{
        width: "100%", maxWidth: 420, position: "relative", padding: 32,
        background: "var(--admin-card)", border: "1px solid var(--admin-border)",
        borderRadius: "var(--admin-radius)", boxShadow: "var(--admin-shadow)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, margin: "0 auto 16px",
            background: "linear-gradient(135deg, var(--admin-primary), var(--admin-accent))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 24px var(--admin-primary-glow)",
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--admin-text)", margin: 0 }}>Admin Login</h1>
          <p style={{ fontSize: 13, color: "var(--admin-text-muted)", marginTop: 4 }}>Sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
              borderRadius: 8, background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)", color: "#fca5a5",
              fontSize: 13, marginBottom: 16,
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <div className="admin-form-group">
            <label className="admin-label">Email</label>
            <input className="admin-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Password</label>
            <div style={{ position: "relative" }}>
              <input className="admin-input" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ paddingRight: 40 }} />
              <button type="button" onClick={() => setShow(!show)} style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "var(--admin-text-muted)",
                cursor: "pointer", padding: 4, display: "flex",
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {show ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                </svg>
              </button>
            </div>
          </div>

          <button className="admin-btn admin-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "11px 18px", marginTop: 8 }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p style={{ textAlign: "center", fontSize: 11, color: "var(--admin-text-muted)", marginTop: 16 }}>
            Demo: admin@beautycosmetic.com / admin123
          </p>
        </form>
      </div>
    </div>
  )
}
