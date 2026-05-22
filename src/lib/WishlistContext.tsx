"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface WishlistContextType {
  wishlist: number[]
  toggleWishlist: (id: number) => void
  isInWishlist: (id: number) => boolean
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wishlist_items")
      if (saved) setWishlist(JSON.parse(saved))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("wishlist_items", JSON.stringify(wishlist))
    }
  }, [wishlist, hydrated])

  function toggleWishlist(id: number) {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  function isInWishlist(id: number) {
    return wishlist.includes(id)
  }

  const wishlistCount = wishlist.length

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}
