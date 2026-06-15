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
      <style>{`
        #footer {
          color: #000 !important;
          background: #fff !important;
          padding: 60px 0 0 !important;
        }
        #footer h3 {
          color: #000 !important;
          font-family: Inter;
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 16px;
        }
        #footer ul {
          padding-left: 0;
          list-style: none;
        }
        #footer ul li {
          padding: 4px 0;
          text-align: left;
        }
        #footer ul li a {
          color: #555 !important;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        #footer ul li a:hover {
          color: #FF5894 !important;
        }
        #footer .foot-flex {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        #footer .foot-flex li p {
          margin: 0;
        }
        #footer .foot-flex li p a {
          color: #FF5894 !important;
          font-weight: 700;
        }
        #footer .text-muted {
          color: #666 !important;
          font-size: 14px;
          line-height: 1.6;
        }
        .copyright {
          background: #FFEBEF !important;
          padding: 20px 0;
          margin-top: 40px;
        }
        .copyright p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
        .payment-icons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .payment-icon-box {
          width: 48px;
          height: 32px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .payment-icon-box:hover {
          border-color: #FF5894;
          box-shadow: 0 2px 8px rgba(255,88,148,0.15);
          transform: translateY(-1px);
        }
        .payment-icon-box img {
          max-height: 20px;
          max-width: 100%;
          object-fit: contain;
        }
        .social_widget {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        .social_widget a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #fff;
          color: #FF5894 !important;
          border: 1px solid #FF5894;
          transition: all 0.2s;
        }
        .social_widget a:hover {
          background: #FF5894;
          color: #fff !important;
        }
        .social_widget a i {
          font-size: 15px;
        }
        @media (max-width: 768px) {
          #footer h3 { text-align: center; }
          #footer ul li { text-align: center; }
          #footer .foot-flex { justify-content: center; }
          #footer .text-center-mobile { text-align: center !important; }
          .copyright .row > div { text-align: center !important; margin-bottom: 8px; }
          .social_widget { justify-content: center; }
        }
      `}</style>
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
                <div className="payment-icons">
                  {paymentIcons.map((icon: string, i: number) => (
                    <div key={i} className="payment-icon-box">
                      <img src={icon} alt="Pay" />
                    </div>
                  ))}
                </div>
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
