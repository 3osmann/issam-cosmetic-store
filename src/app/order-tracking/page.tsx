"use client";

import Link from "next/link";
import { useState } from "react";
import { Package, Search, Truck, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const orderStatuses = [
  { step: "Order Placed", icon: Package, date: "May 15, 2024", completed: true },
  { step: "Processing", icon: Clock, date: "May 16, 2024", completed: true },
  { step: "Shipped", icon: Truck, date: "May 18, 2024", completed: true },
  { step: "Delivered", icon: CheckCircle2, date: "Expected May 22, 2024", completed: false },
];

export default function OrderTrackingPage() {
  const { t } = useLanguage();
  const [orderId, setOrderId] = useState("");
  const [tracked, setTracked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTracked(true);
    }, 1500);
  };

  const handleReset = () => {
    setOrderId("");
    setTracked(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#FF5894]">{t("nav.home")}</Link>
            <span>/</span>
            <span className="text-[#FF5894]">{t("tracking.breadcrumb")}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {!tracked ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Package className="h-16 w-16 text-[#FF5894] mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900">{t("tracking.track")}</h2>
                <p className="text-gray-500 text-sm mt-1">{t("tracking.hint")}</p>
              </div>
              <form onSubmit={handleTrack} className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <Input
                    placeholder={t("tracking.placeholder")}
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </form>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 text-center">
                  {t("tracking.tip")}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{t("tracking.order_number").replace("{id}", orderId)}</h2>
                    <p className="text-sm text-gray-500">{t("tracking.placed_on").replace("{date}", "May 15, 2024")}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-none text-sm px-3 py-1">{t("tracking.in_transit")}</Badge>
                </div>

                <div className="space-y-0">
                  {orderStatuses.map((status, index) => (
                    <div key={status.step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                          status.completed ? "bg-green-100" : "bg-gray-100"
                        )}>
                          <status.icon className={cn("h-5 w-5", status.completed ? "text-green-600" : "text-gray-400")} />
                        </div>
                        {index < orderStatuses.length - 1 && (
                          <div className={cn("w-0.5 h-12", status.completed ? "bg-green-300" : "bg-gray-200")} />
                        )}
                      </div>
                      <div className={cn("pb-8", index === orderStatuses.length - 1 && "pb-0")}>
                        <h3 className={cn("font-medium", status.completed ? "text-gray-900" : "text-gray-400")}>{status.step}</h3>
                        <p className="text-sm text-gray-500">{status.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-3">{t("tracking.delivery_details")}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("tracking.shipping_address")}</span>
                    <span className="text-gray-900 text-right max-w-[250px]">123 Beauty Street, Fashion District, New York, NY 10001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("tracking.shipping_method")}</span>
                    <span className="text-gray-900">{t("tracking.standard_shipping")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("tracking.estimated_delivery")}</span>
                    <span className="text-gray-900">May 22, 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleReset} className="flex-1">{t("tracking.track_another")}</Button>
              <Link href="/shop" className="flex-1">
                <Button className="w-full">{t("cart.continue_shopping")}</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
