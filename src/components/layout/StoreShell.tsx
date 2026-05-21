"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { LanguageProvider } from "@/lib/i18n/LanguageContext"
import { Header } from "./Header"
import { Footer } from "./Footer"

export function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")
  const isHome = pathname === "/"
  const [stuck, setStuck] = useState(false)
  const [hHeight, setHHeight] = useState(0)

  useEffect(() => {
    const masthead = document.getElementById("masthead")
    if (masthead) setHHeight(masthead.offsetHeight)
    const onScroll = () => setStuck(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    const onResize = () => {
      const m = document.getElementById("masthead")
      if (m) setHHeight(m.offsetHeight)
    }
    window.addEventListener("resize", onResize)
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize) }
  }, [])

  if (isAdmin) return <LanguageProvider>{children}</LanguageProvider>

  return (
    <LanguageProvider>
      <Header />
      {!isHome && stuck && <div style={{ height: hHeight }} />}
      <main style={{ paddingTop: isHome ? 0 : 150 }}>{children}</main>
      <Footer />
    </LanguageProvider>
  )
}
