"use client"

import { useState, useEffect } from "react"

interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string | null
  message: string
  answered: boolean
  reply: string | null
  answeredAt: string | null
  createdAt: string
}

export default function ContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [reply, setReply] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => { fetchMessages() }, [])

  async function fetchMessages() {
    try {
      setLoading(true)
      const res = await fetch("/api/contact/messages")
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to fetch messages", err)
    } finally {
      setLoading(false)
    }
  }

  function openReply(msg: ContactMessage) {
    setSelected(msg)
    setReply(msg.reply || "")
  }

  function closeReply() {
    setSelected(null)
    setReply("")
  }

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault()
    if (!selected || !reply.trim()) return
    try {
      setSending(true)
      const res = await fetch(`/api/contact/messages/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: reply.trim() }),
      })
      if (!res.ok) throw new Error("Failed to send reply")
      closeReply()
      await fetchMessages()
    } catch (err) {
      console.error("Failed to send reply", err)
    } finally {
      setSending(false)
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Contact Messages</h1>
          <p className="admin-page-subtitle">View and reply to customer inquiries</p>
        </div>
      </div>

      {selected && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <h3 className="admin-card-title">Reply to {selected.name}</h3>
          </div>
          <div className="admin-card-body">
            <div style={{ marginBottom: 16, padding: 12, background: "var(--admin-bg-secondary)", borderRadius: 8 }}>
              <p><strong>From:</strong> {selected.name} ({selected.email})</p>
              <p><strong>Subject:</strong> {selected.subject || "N/A"}</p>
              <p><strong>Date:</strong> {formatDate(selected.createdAt)}</p>
              <div style={{ marginTop: 8, padding: 8, borderLeft: "3px solid var(--admin-primary)", background: "var(--admin-bg)" }}>
                <p>{selected.message}</p>
              </div>
            </div>
            <form onSubmit={handleSendReply}>
              <div className="admin-form-group" style={{ marginBottom: 16 }}>
                <label className="admin-label">Your Reply</label>
                <textarea
                  className="admin-textarea"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={6}
                  required
                  placeholder="Write your reply..."
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="admin-btn admin-btn-primary admin-btn-sm" type="submit" disabled={sending || !reply.trim()}>
                  {sending ? "Sending..." : "Send Reply"}
                </button>
                <button className="admin-btn admin-btn-ghost admin-btn-sm" type="button" onClick={closeReply}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <h3 className="admin-card-title">All Messages</h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="admin-badge success" style={{ fontSize: 12 }}>{messages.filter(m => m.answered).length} Answered</span>
              <span className="admin-badge danger" style={{ fontSize: 12 }}>{messages.filter(m => !m.answered).length} Unanswered</span>
            </div>
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "var(--admin-text-muted)" }}>Loading...</td></tr>
              ) : messages.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "var(--admin-text-muted)" }}>No messages found</td></tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id}>
                    <td style={{ fontWeight: 500 }}>{msg.name}</td>
                    <td style={{ color: "var(--admin-text-muted)" }}>{msg.email}</td>
                    <td>{msg.subject || "—"}</td>
                    <td>
                      <span style={{ color: "var(--admin-text-muted)", maxWidth: 200, display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {msg.message}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${msg.answered ? "success" : "danger"}`}>
                        {msg.answered ? "Answered" : "Pending"}
                      </span>
                    </td>
                    <td style={{ color: "var(--admin-text-muted)", fontSize: 13 }}>{formatDate(msg.createdAt)}</td>
                    <td style={{ textAlign: "right" }}>
                      <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => openReply(msg)}>
                        {msg.answered ? "Reply Again" : "Reply"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="admin-table-footer">
          <span>{messages.length} message{messages.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  )
}
