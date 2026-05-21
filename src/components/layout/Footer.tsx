"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Truck, RotateCcw, Shield, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";

const icons = [<Truck size={30} />, <RotateCcw size={30} />, <Shield size={30} />, <MessageCircle size={30} />];

export function Footer() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/footer").then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  const s = settings || {};
  const features = s.featureBoxes || [
    { title: "FREE SHIPPING OVER $99" },
    { title: "30 DAYS MONEY BACK" },
    { title: "100% SECURE PAYMENT" },
    { title: "24/7 DEDICATED SUPPORT" },
  ];
  const linkGroups = s.linkGroups || [];
  const social = s.socialLinks || {};
  const paymentIcons = s.paymentIcons || ["/images/pay1.png", "/images/pay2.png", "/images/pay3.png", "/images/pay4.png", "/images/pay5.png"];

  return (
    <>
      <section className="options-footer">
        <div className="container">
          <div className="row">
            {features.map((feat: any, i: number) => (
              <div key={i} className="col-lg-3 col-md-6 mb-3">
                <div className="option-images">
                  {icons[i] || icons[0]}
                  <h2>{feat.title}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 mb-4">
              <img src={theme === "dark" ? "/images/logo_dark.png" : "/images/logo_light.png"} alt="Beauty Cosmetic Store" className="mb-3" style={{ maxHeight: "40px" }} />
              <p className="text-muted small">{s.aboutText || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo."}</p>
              <div className="phone">
                <ul className="foot-flex">
                  <li><p><a href={`tel:${(s.phoneNumber || "(025) 3686 25 16").replace(/\s/g, "")}`}>{s.phoneNumber || "(025) 3686 25 16"}</a></p></li>
                </ul>
              </div>
              <div className="email">
                <ul className="foot-flex">
                  <li><p><a href={`mailto:${s.email || "info@beautycosmetic.com"}`}>{s.email || "info@beautycosmetic.com"}</a></p></li>
                </ul>
              </div>
              <div className="location">
                <ul className="foot-flex">
                  <li><p><a>{s.address || "123 Beauty Street, New York, NY 10001"}</a></p></li>
                </ul>
              </div>
            </div>
            {linkGroups.map((group: any, gi: number) => (
              <div key={gi} className={`${gi < 2 ? "col-lg-3" : "col-lg-2"} col-md-6 mb-4`}>
                <h3>{group.heading}</h3>
                <ul>
                  {group.links?.map((link: any, li: number) => (
                    <li key={li}><Link href={link.href || "#"}>{link.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="copyright">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-4">
                <p>{s.copyright || `© 2026 Cosmetic Store. ${t("footer.rights")}`}</p>
              </div>
              <div className="col-lg-4 text-center">
                {paymentIcons.map((icon: string, i: number) => (
                  <img key={i} src={icon} alt="Pay" className="me-2" />
                ))}
              </div>
              <div className="col-lg-4 text-end">
                <div className="social_widget">
                  {Object.entries(social).map(([key, val]) => (
                    <a key={key} href={(val as string) || "#"}><i className={`fab fa-${key}`}></i></a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
