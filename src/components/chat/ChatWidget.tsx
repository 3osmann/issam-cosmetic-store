"use client"

import { useState, useEffect, useRef } from "react"

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

function generateId(): string {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem("chat_customer_id")
  if (!id) {
    id = "cust_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
    localStorage.setItem("chat_customer_id", id)
  }
  return id
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [showForm, setShowForm] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const customerId = useRef("")

  useEffect(() => {
    customerId.current = generateId()
    const saved = localStorage.getItem("chat_user_info")
    if (saved) {
      const info = JSON.parse(saved)
      setName(info.name || "")
      setEmail(info.email || "")
      setShowForm(false)
    }
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function fetchMessages() {
    try {
      const res = await fetch(`/api/chat?customerId=${customerId.current}`)
      const data = await res.json()
      if (Array.isArray(data)) setMessages(data)
    } catch { /* ignore */ }
  }

  async function sendMessage() {
    if (!text.trim()) return
    if (!name.trim()) return
    setSending(true)
    try {
      localStorage.setItem("chat_user_info", JSON.stringify({ name, email }))
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customerId.current, customerName: name, customerEmail: email || null, message: text.trim() }),
      })
      setText("")
      setShowForm(false)
      await fetchMessages()
    } catch { /* ignore */ }
    setSending(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 99999,
      fontFamily: "'Segoe UI', Arial, sans-serif",
    }}>
      {open && (
        <div style={{
          width: 350, maxHeight: 500, background: "#fff", borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,0.15)", marginBottom: 12,
          display: "flex", flexDirection: "column", overflow: "hidden",
          border: "1px solid #e2e8f0",
        }}>
          <div style={{
            background: "linear-gradient(135deg,#d63384,#e83e8c)", padding: "16px 20px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>Chat with us</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>We reply in minutes</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 18, padding: 0 }}>✕</button>
          </div>

          <div style={{ flex: 1, padding: 16, overflowY: "auto", background: "#f8f9fa", minHeight: 300, maxHeight: 350 }}>
            {showForm && (
              <div style={{ background: "#fff", padding: 16, borderRadius: 12, marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "#333" }}>Hi! Leave your info and message below:</p>
                <input placeholder="Your name *" value={name} onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ddd", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                <input placeholder="Your email (optional)" value={email} onChange={(e) => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ddd", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                <textarea placeholder="Type your message..." value={text} onChange={(e) => setText(e.target.value)} rows={3}
                  style={{ width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ddd", borderRadius: 8, fontSize: 13, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                <button onClick={sendMessage} disabled={sending || !name.trim() || !text.trim()}
                  style={{ width: "100%", padding: "10px", background: "#d63384", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: sending || !name.trim() || !text.trim() ? 0.6 : 1 }}>
                  {sending ? "Sending..." : "Start Chat"}
                </button>
              </div>
            )}

            {messages.length === 0 && !showForm && (
              <div style={{ textAlign: "center", padding: 40, color: "#999", fontSize: 13 }}>
                No messages yet. Send us a message!
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} style={{
                display: "flex", justifyContent: msg.isAdmin ? "flex-start" : "flex-end",
                marginBottom: 10,
              }}>
                <div style={{
                  maxWidth: "80%", padding: "10px 14px", borderRadius: msg.isAdmin ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                  background: msg.isAdmin ? "#fff" : "#d63384",
                  color: msg.isAdmin ? "#333" : "#fff",
                  fontSize: 13, lineHeight: 1.5, boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}>
                  {msg.isAdmin && <div style={{ fontSize: 11, fontWeight: 600, color: "#d63384", marginBottom: 2 }}>Support</div>}
                  {msg.message}
                  <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6, textAlign: "right" }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {!showForm && (
            <div style={{ padding: "10px 16px", borderTop: "1px solid #eee", display: "flex", gap: 8, background: "#fff" }}>
              <input placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown}
                style={{ flex: 1, padding: "10px 14px", border: "1px solid #ddd", borderRadius: 24, fontSize: 13, outline: "none" }} />
              <button onClick={sendMessage} disabled={sending || !text.trim()}
                style={{ width: 40, height: 40, borderRadius: "50%", background: "#d63384", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: sending || !text.trim() ? 0.5 : 1 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          )}
        </div>
      )}

      <button onClick={() => setOpen(!open)} style={{
        width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#d63384,#e83e8c)",
        color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(214,51,132,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s",
        transform: open ? "rotate(45deg)" : "rotate(0deg)",
      }}>
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>
    </div>
  )
}
