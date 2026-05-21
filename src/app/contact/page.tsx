"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const defaultContactInfo = [
  { icon: MapPin, label: "Our Address", value: "123 Beauty Street, Fashion District, New York, NY 10001" },
  { icon: Phone, label: "Phone Number", value: "+1 (555) 123-4567" },
  { icon: Mail, label: "Email Address", value: "hello@beautystore.com" },
  { icon: Clock, label: "Working Hours", value: "Mon - Sat: 9:00 AM - 9:00 PM, Sun: 10:00 AM - 6:00 PM" },
];

export default function ContactPage() {
  const { t } = useLanguage();
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.site_info) {
          const info = data.site_info;
          setContactInfo([
            { icon: MapPin, label: "Our Address", value: info.address || defaultContactInfo[0].value },
            { icon: Phone, label: "Phone Number", value: info.phone || defaultContactInfo[1].value },
            { icon: Mail, label: "Email Address", value: info.email || defaultContactInfo[2].value },
            { icon: Clock, label: "Working Hours", value: "Mon - Sat: 9:00 AM - 9:00 PM, Sun: 10:00 AM - 6:00 PM" },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t("contact.get_in_touch")}</h2>
            <p className="text-gray-500 mt-2">{t("contact.description")}</p>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {contactInfo.map((info) => (
                <Card key={info.label}>
                  <CardContent className="p-5">
                    <div className="w-10 h-10 rounded-lg bg-[#FF5894]/10 flex items-center justify-center mb-3">
                      <info.icon className="h-5 w-5 text-[#FF5894]" />
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm">{info.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">{info.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t("contact.sent")}</h3>
                  <p className="text-gray-500 mb-6">{t("contact.sent_hint")}</p>
                  <Button onClick={() => setSubmitted(false)}>{t("contact.send_another")}</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">{t("contact.send_message")}</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t("contact.full_name")}</label>
                      <Input name="name" value={formData.name} onChange={handleChange} placeholder={t("contact.full_name")} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t("contact.email")}</label>
                      <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t("contact.subject")}</label>
                      <Input name="subject" value={formData.subject} onChange={handleChange} placeholder={t("contact.subject")} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t("contact.message")}</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Write your message here..."
                        required
                        className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF5894] disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <Button type="submit" className="w-full" size="lg" disabled={sending}>
                      {sending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Send className="h-5 w-5 mr-2" />}
                      {sending ? t("contact.sending") : t("contact.send")}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
