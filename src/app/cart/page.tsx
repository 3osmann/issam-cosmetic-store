"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingCart, Minus, Plus, Trash2, ArrowLeft, Tag, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/lib/CartContext";

export default function CartPage() {
  const { t } = useLanguage();
  const { items, updateQuantity, removeItem, subtotal, shipping, total, itemCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const discount = couponApplied ? subtotal * 0.1 : 0;
  const finalTotal = total - discount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-12">

          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#FF5894]">{t("nav.home")}</Link>
            <span>/</span>
            <span className="text-[#FF5894]">{t("cart.breadcrumb")}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {items.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg bg-gray-50 flex items-center justify-center p-2 shrink-0" style={item.bgColor ? { backgroundColor: item.bgColor } : undefined}>
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link href={`/product/${item.id}`}>
                              <h3 className="font-medium text-gray-900 hover:text-[#FF5894] transition-colors">{item.name}</h3>
                            </Link>
                            <p className="text-sm text-gray-500 mt-0.5">${item.salePrice.toFixed(2)} {t("cart.each")}</p>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:bg-gray-100 transition-colors">
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-3 py-1.5 font-medium text-sm min-w-[32px] text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:bg-gray-100 transition-colors">
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="font-bold text-[#FF5894]">${(item.salePrice * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">{t("cart.order_summary")}</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t("cart.subtotal")}</span>
                      <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t("cart.shipping")}</span>
                      <span className={cn("font-medium", shipping === 0 ? "text-green-600" : "text-gray-900")}>
                        {shipping === 0 ? t("cart.free") : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    {couponApplied && (
                      <div className="flex items-center justify-between text-green-600">
                        <span>{t("cart.discount")} (10%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between text-base">
                        <span className="font-bold text-gray-900">{t("cart.total")}</span>
                        <span className="font-bold text-[#FF5894]">${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2 text-sm text-green-700">
                    <Truck className="h-4 w-4 shrink-0" />
                    {shipping === 0 ? t("cart.free_shipping_note") : `${t("cart.free_shipping_needed")}$${(50 - subtotal).toFixed(2)}${t("cart.free_shipping_needed_end")}`}
                  </div>

                  <div className="mt-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder={t("cart.coupon")}
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={() => setCouponApplied(true)}
                        disabled={!couponCode || couponApplied}
                      >
                        <Tag className="h-4 w-4 mr-1" />
                        {t("cart.apply")}
                      </Button>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full mt-4" size="lg">
                      {t("cart.checkout")}
                    </Button>
                  </Link>

                  <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 justify-center">
                    <Shield className="h-3.5 w-3.5" />
                    {t("cart.secure_checkout")}
                  </div>
                </CardContent>
              </Card>

              <Link href="/shop">
                <Button variant="ghost" className="mt-4 w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("cart.continue_shopping")}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <ShoppingCart className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t("cart.empty")}</h2>
            <p className="text-gray-500 mb-6">{t("cart.empty_hint")}</p>
            <Link href="/shop">
              <Button><ArrowLeft className="h-4 w-4 mr-2" /> {t("cart.continue_shopping")}</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
