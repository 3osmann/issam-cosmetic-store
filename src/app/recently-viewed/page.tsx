"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingCart, Star, Clock, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";

interface RecentlyViewedItem {
  id: number;
  name: string;
  image: string;
  price: number;
  salePrice: number;
  bgColor: string;
  rating: number;
  viewedAt: string;
}

const initialItems: RecentlyViewedItem[] = [
  { id: 12, name: "Loreal Hairstyling product", image: "/images/loreal-hairstyling-product.png", price: 65.01, salePrice: 49.01, bgColor: "#7A4A2C", rating: 5, viewedAt: "2 minutes ago" },
  { id: 2, name: "Pantene Pro-V shampoo", image: "/images/pantene-pro-v-shampoo.png", price: 65.01, salePrice: 49.01, bgColor: "#D44C64", rating: 5, viewedAt: "15 minutes ago" },
  { id: 9, name: "Cocooil Organic coconut Oil", image: "/images/deal-pro6.png", price: 65.01, salePrice: 49.01, bgColor: "", rating: 5, viewedAt: "1 hour ago" },
  { id: 5, name: "Maybelline BB Cream", image: "/images/maybelline-bb-cream-foundation.png", price: 65.01, salePrice: 49.01, bgColor: "#EFCAA2", rating: 5, viewedAt: "3 hours ago" },
  { id: 16, name: "Ponds White Beauty face wash", image: "/images/ponds-white-beauty-face-wash.png", price: 65.01, salePrice: 49.01, bgColor: "#FFC9D9", rating: 5, viewedAt: "Yesterday" },
  { id: 14, name: "Laneige Sunscreen Toner", image: "/images/laneige-sunscreen-skin-toner.png", price: 65.01, salePrice: 49.01, bgColor: "#D68A8F", rating: 4, viewedAt: "Yesterday" },
  { id: 7, name: "Chaiceness Herbal Extract", image: "/images/chaiceness-plant-herbal-extract.png", price: 65.01, salePrice: 49.01, bgColor: "#FFB2B2", rating: 4, viewedAt: "2 days ago" },
  { id: 1, name: "Nivea Cocoa Nourish", image: "/images/nivea-cocoa-nourish.png", price: 65.01, salePrice: 49.01, bgColor: "#AC5004", rating: 4, viewedAt: "3 days ago" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("h-3.5 w-3.5", i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
      ))}
    </div>
  );
}

export default function RecentlyViewedPage() {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [items, setItems] = useState<RecentlyViewedItem[]>(initialItems);

  const clearAll = () => setItems([]);

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#FF5894]">{t("nav.home")}</Link>
            <span>/</span>
            <span className="text-[#FF5894]">{t("recently_viewed.breadcrumb")}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {items.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">{items.length} {t("recently_viewed.items")}</p>
              <Button variant="outline" size="sm" onClick={clearAll}>
                <Trash2 className="h-4 w-4 mr-1" />
                {t("recently_viewed.clear")}
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-4" style={item.bgColor ? { backgroundColor: item.bgColor } : undefined}>
                    <Link href={`/product/${item.id}`}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain transition-transform group-hover:scale-105" />
                    </Link>
                    <button
                      onClick={() => toggleWishlist(item.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                    >
                      <Heart className={cn("h-4 w-4", wishlist.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-400")} />
                    </button>
                    {item.salePrice < item.price && (
                      <Badge className="absolute top-2 left-2 bg-[#FF5894] text-white">{t("shop.sale")}</Badge>
                    )}
                    <div className="absolute bottom-2 left-2 bg-white/90 rounded-full px-2 py-0.5 text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.viewedAt}
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <Link href={`/product/${item.id}`} className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-[#FF5894] transition-colors">{item.name}</h3>
                      </Link>
                      <button onClick={() => removeItem(item.id)} className="p-0.5 text-gray-300 hover:text-red-500 transition-colors ml-1 shrink-0">
                        <XCircle className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <StarRating rating={item.rating} />
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-[#FF5894]">${item.salePrice.toFixed(2)}</span>
                      {item.salePrice < item.price && (
                        <span className="text-xs text-gray-400 line-through">${item.price.toFixed(2)}</span>
                      )}
                    </div>
                    <Button size="sm" className="w-full mt-2 h-8 text-xs" onClick={() => addItem({ id: item.id, name: item.name, image: item.image, price: item.price, salePrice: item.salePrice, bgColor: item.bgColor || "" })}>
                      <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                      {t("recently_viewed.add_to_cart")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Clock className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t("recently_viewed.empty")}</h2>
            <p className="text-gray-500 mb-6">{t("recently_viewed.empty_hint")}</p>
            <Link href="/shop">
              <Button>{t("recently_viewed.browse")}</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
