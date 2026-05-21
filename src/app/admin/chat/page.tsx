"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

interface ChatMessage {
  id: number
  customerId: string
  customerName: string
  customerEmail: string | null
  message: string
  isAdmin: boolean
  read: boolean
  createdAt: string
}

interface Conversation {
  customer_id: string
  customer_name: string
  customer_email: string
  total_messages: number
  unread: number
  last_message_at: string
  last_message: string
}

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [reply, setReply] = useState("")
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 15000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedCustomer) {
      fetchMessages(selectedCustomer)
      const interval = setInterval(() => fetchMessages(selectedCustomer), 5000)
      return () => clearInterval(interval)
    }
  }, [selectedCustomer])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function fetchConversations() {
    try {
      const res = await fetch("/api/chat/conversations")
      const data = await res.json()
      if (Array.isArray(data)) setConversations(data)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  async function fetchMessages(customerId: string) {
    try {
      const res = await fetch(`/api/chat?customerId=${customerId}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setMessages(data)
        data.filter((m: ChatMessage) => !m.isAdmin && !m.read).forEach((m: ChatMessage) => {
          fetch(`/api/chat/${m.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ read: true }),
          }).catch(() => {})
        })
      }
    } catch { /* ignore */ }
  }

  async function sendReply() {
    if (!reply.trim() || !selectedCustomer) return
    setSending(true)
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomer,
          customerName: "Support",
          message: reply.trim(),
          isAdmin: true,
        }),
      })
      setReply("")
      await fetchMessages(selectedCustomer)
      await fetchConversations()
    } catch { /* ignore */ }
    setSending(false)
  }

  function formatTime(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Chat</h1>
          <p className="admin-page-subtitle">Customer conversations — reply in real time</p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--admin-text-muted)" }}>Loading conversations...</p>
      ) : (
        <div style={{ display: "flex", gap: 20, minHeight: "calc(100vh - 200px)" }}>
          <div style={{ width: 320, flexShrink: 0 }}>
            <div className="admin-card" style={{ height: "100%" }}>
              <div className="admin-card-header">
                <h3 className="admin-card-title">Conversations ({conversations.length})</h3>
              </div>
              <div className="admin-card-body" style={{ padding: 8, overflowY: "auto", maxHeight: "calc(100vh - 300px)" }}>
                {conversations.length === 0 && (
                  <p style={{ textAlign: "center", color: "var(--admin-text-muted)", padding: 32, fontSize: 13 }}>No conversations yet</p>
                )}
                {conversations.map((conv) => (
                  <button
                    key={conv.customer_id}
                    onClick={() => setSelectedCustomer(conv.customer_id)}
                    style={{
                      width: "100%", textAlign: "left", padding: "10px 12px",
                      border: "none", borderRadius: 8, cursor: "pointer", marginBottom: 4,
                      background: selectedCustomer === conv.customer_id ? "rgba(124,58,237,0.1)" : "transparent",
                      color: "var(--admin-text)", transition: "background 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{conv.customer_name}</span>
                      <span style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>{new Date(conv.last_message_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--admin-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 4 }}>
                      {conv.last_message}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {parseInt(conv.unread.toString()) > 0 && (
                        <span className="admin-badge danger" style={{ fontSize: 10 }}>{conv.unread} unread</span>
                      )}
                      <span style={{ fontSize: 11, color: "var(--admin-text-muted)" }}>{conv.total_messages} msgs</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {!selectedCustomer ? (
              <div className="admin-card" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "var(--admin-text-muted)", fontSize: 14 }}>Select a conversation on the left</p>
              </div>
            ) : (
              <div className="admin-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <div className="admin-card-header">
                  <div>
                    <h3 className="admin-card-title">{messages[0]?.customerName || "Customer"}</h3>
                    {messages[0]?.customerEmail && (
                      <p className="admin-card-desc">{messages[0].customerEmail}</p>
                    )}
                  </div>
                  <Link href={`/api/chat?customerId=${selectedCustomer}`} className="admin-btn admin-btn-ghost admin-btn-xs">Refresh</Link>
                </div>
                <div className="admin-card-body" style={{ flex: 1, overflowY: "auto", maxHeight: "calc(100vh - 420px)", padding: "12px 16px" }}>
                  {messages.map((msg) => (
                    <div key={msg.id} style={{
                      display: "flex", justifyContent: msg.isAdmin ? "flex-end" : "flex-start",
                      marginBottom: 12,
                    }}>
                      <div style={{
                        maxWidth: "75%", padding: "10px 14px", borderRadius: msg.isAdmin ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                        background: msg.isAdmin ? "var(--admin-primary)" : "var(--admin-card)",
                        border: msg.isAdmin ? "none" : "1px solid var(--admin-border)",
                        color: msg.isAdmin ? "#fff" : "var(--admin-text)",
                        fontSize: 13, lineHeight: 1.5,
                      }}>
                        {!msg.isAdmin && <div style={{ fontSize: 11, fontWeight: 600, color: "var(--admin-accent)", marginBottom: 2 }}>{msg.customerName}</div>}
                        {msg.message}
                        <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6, textAlign: "right" }}>
                          {formatTime(msg.createdAt)}
                          {msg.read && msg.isAdmin && <span style={{ marginLeft: 6 }}>✓</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <div style={{ padding: "12px 16px", borderTop: "1px solid var(--admin-border)", display: "flex", gap: 8 }}>
                  <input
                    className="admin-input"
                    placeholder="Type your reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply() } }}
                    style={{ flex: 1 }}
                  />
                  <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={sendReply} disabled={sending || !reply.trim()}>
                    {sending ? "..." : "Send"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
