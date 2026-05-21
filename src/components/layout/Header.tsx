"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage, type Locale } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { useCart } from "@/lib/CartContext";

export function Header() {
  const { t, locale, setLocale } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 50);
      if (current > lastScroll && current > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScroll = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    fetch("/api/header").then(r => r.json()).then(setSettings).catch(() => {});
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    "Blusher", "Body Care", "Cheeks", "Deal Of The Day", "Eyes",
    "Face Pack", "Hair care", "Lip stick", "Nails", "Natural",
    "Skin care", "Uncategorized",
  ];

  return (
    <div className="header-wrapper" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, transition: "transform 0.3s ease", transform: hidden ? "translateY(-100%)" : "translateY(0)" }}>
      <div id="topabr">
        <div className="container">
          <div className="row" style={{ alignItems: "center" }}>
            <div className="col-lg-6 col-md-7">
              <div className="topbar-contents">
                <h4 className="main_heading">{settings?.topbarText || t("topbar.free_shipping")}</h4>
                <div className="shop-btn">
                  <Link href={settings?.shopNowLink || "/shop"}>{t("topbar.shop_now")}</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-5">
              <div className="social-icons">
                <div className="socialbox">
                  {Object.entries(settings?.socialLinks || {}).filter(([, url]) => url).map(([platform, url]) => {
                    const iconMap: Record<string, string> = {
                      // Known platform icon mapping
                      twitter: "fab fa-twitter", instagram: "fab fa-instagram", facebook: "fab fa-facebook-f",
                      youtube: "fab fa-youtube", linkedin: "fab fa-linkedin-in", google: "fa-brands fa-google",
                      pinterest: "fab fa-pinterest", tiktok: "fab fa-tiktok", snapchat: "fab fa-snapchat-ghost",
                      whatsapp: "fab fa-whatsapp", telegram: "fab fa-telegram", discord: "fab fa-discord",
                      github: "fab fa-github", twitch: "fab fa-twitch", reddit: "fab fa-reddit",
                      tumblr: "fab fa-tumblr", vimeo: "fab fa-vimeo", dribbble: "fab fa-dribbble",
                    };
                    return (
                      <a key={platform} className={platform} href={url as string} target="_blank" rel="noopener noreferrer">
                        <i className={`${(iconMap as Record<string, string>)[platform as string] || "fas fa-link"} align-middle icons`}></i>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header id="masthead" className={`site-header close-sticky ${scrolled ? "scrolled" : ""}`}>
        <span id="sticky-onoff">no</span>
        <div className="container-fluid p-0">
          <div className="header-wrap">
            <div className="container nav_wrap">
              <div className="main-header-box">
                <div className="row bg-media">
                  <div className="col-lg-2 col-md-5 col-sm-4 col-12 align-self-center">
                    <div className="logo">
                      <Link href="/"><img src={theme === "dark" ? "/images/logo_dark.png" : "/images/logo_light.png"} alt="logo" /></Link>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-7 header-search-flex">
                    <div id="cat_toggle" onClick={() => setCategoriesOpen(!categoriesOpen)}>
                      {t("search.all_categories")} <i className="fas fa-angle-down mx-1"></i>
                    </div>
                    <div id="cart_animate" style={{ display: categoriesOpen ? "block" : "none" }}>
                      <div className="widget woocommerce widget_product_categories">
                        <ul className="product-categories">
                          {categories.map((cat) => (
                            <li key={cat} className="cat-item">
                              <Link href={`/shop?category=${cat.toLowerCase().replace(/\s+/g, "_")}`}>{cat}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div id="qnimate" className="off">
                      <div id="search" className="open">
                        <form role="search" className="search-form searchBox" action="/shop">
                          <label>
                            <span className="screen-reader-text">Search for:</span>
                            <input type="search" className="search-field" placeholder={t("search.placeholder")} name="s" />
                          </label>
                          <input type="submit" className="search-submit" value="" />
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-8 col-sm-4 col-12 quote-btn">
                    <button onClick={toggleTheme} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, marginRight: 10 }}>
                      {theme === "dark" ? <i className="fas fa-sun" style={{ color: "#f59e0b" }}></i> : <i className="fas fa-moon"></i>}
                    </button>
                    <div className="hotline-details">
                      <div className="number-icon">
                        <i className="fa-solid fa-phone-volume mx-1"></i>
                      </div>
                      <div className="hotline-number">
                        <h5>{settings?.hotlineText || t("nav.hotline")}</h5>
                        <h6><a href={`tel:${(settings?.phoneNumber || "(025) 3686 25 16").replace(/\s/g, "")}`}>{settings?.phoneNumber || "(025) 3686 25 16"}</a></h6>
                      </div>
                    </div>
                    <div className="product-details">
                      <div className="account">
                        <span className="account_icon">
                          <Link href="/account"><i className="fa-duotone fa-user search"></i></Link>
                        </span>
                      </div>
                      <div className="wishlist">
                        <Link className="wishlist_view" href="/wishlist">
                          <i className="far fa-heart search"></i>
                        </Link>
                      </div>
                      <div className="cart">
                        <Link className="cart-cust" href="/cart">
                          <i className="fal fa-shopping-cart search"></i>
                          <span className="cart-counter" id="cart-counter">{itemCount}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-4 col-sm-4 col-12 mt-4 text-center header-nav align-self-center">
                    <div className="menubar m-0 mt-md-0">
                      <div className="right_menu">
                        <div className="innermenubox">
                          <div className="toggle-nav mobile-menu">
                            <span onClick={() => {}}><i className="fas fa-bars"></i></span>
                          </div>
                          <div id="mySidenav" className="nav sidenav">
                            <nav id="site-navigation" className="main-navigation">
                              <div className="menu clearfix">
                                <ul id="menu-primary-menu" className="clearfix mobile_nav">
                                  {(settings?.navItems || [
                                    { label: "Home", href: "/", children: [] },
                                    { label: "Blog", href: "/blog", children: [] },
                                    { label: "Shop", href: "/shop", children: [] },
                                    { label: "Contact", href: "/contact", children: [] },
                                  ]).map((item: any, i: number) => (
                                    <li key={i} className={`menu-item ${item.children?.length ? "menu-item-has-children" : ""} ${i === 0 ? "current-menu-item" : ""}`}>
                                      <Link href={item.href}>{item.label}</Link>
                                      {item.children?.length > 0 && (
                                        <ul className="sub-menu">
                                          {item.children.map((child: any, ci: number) => (
                                            <li key={ci}><Link href={child.href}>{child.label}</Link></li>
                                          ))}
                                        </ul>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-7 col-md-12 mt-4">
                    <div className="track-main-box position-relative">
                      <div className="order-tracking-products">
                        <i className="fa-solid fa-bag-shopping search"></i>
                        <Link className="order-tracking" href="/order-tracking">
                          <span>{t("nav.order_tracking")}</span>
                        </Link>
                      </div>
                      <div className="recently-viewed-products">
                        <Link className="recently-view-menu" href="/recently-viewed">
                          <span>{t("nav.recently_viewed")}</span>
                        </Link>
                      </div>
                      <span className="currency">
                        <div className="woocommerce-currency-switcher-form" data-ver="1.4.3.1">
                          <select className="woocommerce-currency-switcher">
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                          </select>
                          <div className="woocs_display_none" style={{ display: "none" }}>FOX v.1.4.3.1</div>
                        </div>
                      </span>
                      <div className="language">
                        <select className="gt_selector notranslate" value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>
                          <option value="fr">{t("language.fr")}</option>
                          <option value="en">{t("language.en")}</option>
                          <option value="ar">{t("language.ar")}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
