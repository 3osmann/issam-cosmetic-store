"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Star, Minus, Plus, ChevronDown, Truck, Shield, RotateCcw, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/lib/CartContext";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn(size === "md" ? "h-5 w-5" : "h-3.5 w-3.5", i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
      ))}
    </div>
  );
}

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  salePrice: number;
  bgColor: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export default function ProductDetailPage() {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const id = Number(params.id);
    if (!id) { setLoading(false); return; }
    Promise.all([
      fetch(`/api/products/${id}`).then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ])
      .then(([prodData, allData]) => {
        const p = prodData.product || prodData;
        if (p && p.id) {
          setProduct({
            id: p.id,
            name: p.name,
            image: p.image,
            price: parseFloat(p.price) || 0,
            salePrice: p.salePrice ? parseFloat(p.salePrice) : parseFloat(p.price) || 0,
            bgColor: p.bgColor || "",
            category: p.categoryName || "",
            description: p.description || "",
            rating: Math.round(parseFloat(p.rating) || 4),
            reviews: p.reviews || 0,
            inStock: p.stock > 0,
          });
        }
        const all = Array.isArray(allData) ? allData : allData.products || [];
        setRelatedProducts(all.filter((rp: any) => rp.id !== id).slice(0, 4).map((rp: any) => ({
          id: rp.id,
          name: rp.name,
          image: rp.image,
          price: parseFloat(rp.price) || 0,
          salePrice: rp.salePrice ? parseFloat(rp.salePrice) : parseFloat(rp.price) || 0,
          bgColor: rp.bgColor || "",
          category: "",
          description: "",
          rating: Math.round(parseFloat(rp.rating) || 4),
          reviews: 0,
          inStock: true,
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><Package className="h-20 w-20 text-gray-300 mx-auto mb-4 animate-pulse" />            <p className="text-gray-500">{t("shop.filters")}...</p></div></div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("product.not_found")}</h1>
          <p className="text-gray-500 mb-6">{t("product.not_found_hint")}</p>
          <Link href="/shop">
            <Button>{t("product.continue_shopping")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = [product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#FF5894]">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#FF5894]">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category.toLowerCase().replace(" ", "_")}`} className="hover:text-[#FF5894]">{product.category}</Link>
            <span>/</span>
            <span className="text-[#FF5894] truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="aspect-square rounded-xl bg-white border overflow-hidden flex items-center justify-center p-8 mb-4" style={product.bgColor ? { backgroundColor: product.bgColor } : undefined}>
              <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-20 h-20 rounded-lg border-2 overflow-hidden flex items-center justify-center p-2 transition-colors",
                    selectedImage === i ? "border-[#FF5894]" : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Badge className="bg-[#FF5894]/10 text-[#FF5894] border-none">{product.category}</Badge>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-3">{product.name}</h1>

            <div className="flex items-center gap-3 mt-3">
              <StarRating rating={product.rating} size="md" />
              <span className="text-sm text-gray-500">({product.reviews} {t("product.reviews")})</span>
            </div>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold text-[#FF5894]">${product.salePrice.toFixed(2)}</span>
              {product.salePrice < product.price && (
                <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
              )}
              {product.salePrice < product.price && (
                <Badge className="bg-green-100 text-green-700 border-none">
                  {t("product.save")} ${(product.price - product.salePrice).toFixed(2)}
                </Badge>
              )}
            </div>

            <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-2 mt-3">
              <div className={cn("w-2.5 h-2.5 rounded-full", product.inStock ? "bg-green-500" : "bg-red-500")} />
              <span className={cn("text-sm font-medium", product.inStock ? "text-green-600" : "text-red-600")}>
                {product.inStock ? t("product.in_stock") : t("product.out_of_stock")}
              </span>
            </div>

            {product.inStock && (
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[40px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button size="lg" className="flex-1" onClick={() => {
                  if (product) addItem({ id: product.id, name: product.name, image: product.image, price: product.price, salePrice: product.salePrice, bgColor: product.bgColor }, quantity)
                }}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {t("product.add_to_cart")}
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => setIsWishlisted(!isWishlisted)}>
                  <Heart className={cn("h-5 w-5", isWishlisted && "fill-red-500 text-red-500")} />
                </Button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mt-8 p-4 bg-white rounded-xl border">
              <div className="text-center">
                <Truck className="h-5 w-5 text-[#FF5894] mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-900">{t("product.free_shipping")}</p>
                <p className="text-xs text-gray-500">{t("product.free_shipping_hint")}</p>
              </div>
              <div className="text-center">
                <Shield className="h-5 w-5 text-[#FF5894] mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-900">{t("product.secure_payment")}</p>
                <p className="text-xs text-gray-500">{t("product.secure_payment_hint")}</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-5 w-5 text-[#FF5894] mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-900">{t("product.easy_returns")}</p>
                <p className="text-xs text-gray-500">{t("product.easy_returns_hint")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t("product.customer_reviews")}</h2>
          <div className="space-y-4">
            {[
              { id: 1, author: "Sarah M.", rating: 5, text: "Absolutely love this product! My skin has never felt better. Will definitely purchase again.", date: "2 weeks ago" },
              { id: 2, author: "Jessica K.", rating: 4, text: "Great quality for the price. Fast shipping too. Would recommend to friends.", date: "1 month ago" },
              { id: 3, author: "Emily R.", rating: 5, text: "This is my third time buying. Consistent quality every time. A staple in my beauty routine.", date: "1 month ago" },
            ].map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{review.author}</span>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <StarRating rating={review.rating} />
                  <p className="text-sm text-gray-600 mt-2">{review.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t("product.you_may_also_like")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-50 flex items-center justify-center p-4" style={p.bgColor ? { backgroundColor: p.bgColor } : undefined}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain transition-transform group-hover:scale-105" />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-[#FF5894]">${p.salePrice.toFixed(2)}</span>
                      {p.salePrice < p.price && (
                        <span className="text-xs text-gray-400 line-through">${p.price.toFixed(2)}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
