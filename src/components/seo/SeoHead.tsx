"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface SeoData {
  page: string
  title: string | null
  description: string | null
  ogImage: string | null
  keywords: string | null
}

const defaultTitle = "Beauty Cosmetic Store"
const defaultDescription = "Your premium beauty and cosmetic products store"

export function SeoHead() {
  const pathname = usePathname()
  const [seo, setSeo] = useState<SeoData | null>(null)

  useEffect(() => {
    fetch("/api/seo")
      .then((res) => res.json())
      .then((data: SeoData[]) => {
        if (Array.isArray(data)) {
          const match = data.find((s) => s.page === pathname) || data.find((s) => pathname.startsWith(s.page) && s.page !== "/")
          setSeo(match || null)
        }
      })
      .catch(() => {})
  }, [pathname])

  useEffect(() => {
    const title = seo?.title || defaultTitle
    const description = seo?.description || defaultDescription
    const ogImage = seo?.ogImage || "/images/logo_light.png"
    const keywords = seo?.keywords || ""

    document.title = title

    function setMeta(name: string, content: string) {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement("meta")
        if (name.startsWith("og:")) el.setAttribute("property", name)
        else el.setAttribute("name", name)
        document.head.appendChild(el)
      }
      el.setAttribute("content", content)
    }

    setMeta("description", description)
    setMeta("keywords", keywords)
    setMeta("og:title", title)
    setMeta("og:description", description)
    setMeta("og:image", `${window.location.origin}${ogImage}`)
    setMeta("og:url", window.location.href)
    setMeta("twitter:card", "summary_large_image")
    setMeta("twitter:title", title)
    setMeta("twitter:description", description)
    setMeta("twitter:image", `${window.location.origin}${ogImage}`)
  }, [seo])

  return null
}
