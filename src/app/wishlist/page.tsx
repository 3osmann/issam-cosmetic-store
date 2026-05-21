"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface WishlistItem {
  id: number;
  name: string;
  image: string;
  price: number;
  salePrice: number;
  bgColor: string;
  rating: number;
  inStock: boolean;
}

const initialWishlist: WishlistItem[] = [
  { id: 1, name: "Nivea Cocoa Nourish", image: "/images/nivea-cocoa-nourish.png", price: 65.01, salePrice: 49.01, bgColor: "#AC5004", rating: 4, inStock: true },
  { id: 3, name: "Charmacy CMC matte Foundation", image: "/images/deal-pro4.png", price: 65.01, salePrice: 49.01, bgColor: "", rating: 4, inStock: true },
  { id: 5, name: "Maybelline BB Cream", image: "/images/maybelline-bb-cream-foundation.png", price: 65.01, salePrice: 49.01, bgColor: "#EFCAA2", rating: 5, inStock: true },
  { id: 7, name: "Chaiceness Herbal Extract", image: "/images/chaiceness-plant-herbal-extract.png", price: 65.01, salePrice: 49.01, bgColor: "#FFB2B2", rating: 4, inStock: false },
  { id: 10, name: "E.L.F putty blush caribbean", image: "/images/deal-pro5.png", price: 65.01, salePrice: 49.01, bgColor: "", rating: 4, inStock: true },
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

export default function WishlistPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<WishlistItem[]>(initialWishlist);

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const moveToCart = (id: number) => {
    removeItem(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#FF5894]">{t("nav.home")}</Link>
            <span>/</span>
            <span className="text-[#FF5894]">{t("wishlist.breadcrumb")}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {items.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">{items.length} {t("wishlist.items")}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-4" style={item.bgColor ? { backgroundColor: item.bgColor } : undefined}>
                    <Link href={`/product/${item.id}`}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain transition-transform group-hover:scale-105" />
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </button>
                    {item.salePrice < item.price && (
                      <Badge className="absolute top-2 left-2 bg-[#FF5894] text-white">{t("shop.sale")}</Badge>
                    )}
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="text-sm font-medium text-red-500 bg-white px-3 py-1 rounded-full">{t("product.out_of_stock")}</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-[#FF5894] transition-colors">{item.name}</h3>
                    </Link>
                    <StarRating rating={item.rating} />
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-[#FF5894]">${item.salePrice.toFixed(2)}</span>
                      {item.salePrice < item.price && (
                        <span className="text-xs text-gray-400 line-through">${item.price.toFixed(2)}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-2 h-8 text-xs"
                      disabled={!item.inStock}
                      onClick={() => moveToCart(item.id)}
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                      {item.inStock ? t("wishlist.move_to_cart") : t("product.out_of_stock")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Heart className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t("wishlist.empty")}</h2>
            <p className="text-gray-500 mb-6">{t("wishlist.empty_hint")}</p>
            <Link href="/shop">
              <Button>{t("wishlist.browse")}</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
