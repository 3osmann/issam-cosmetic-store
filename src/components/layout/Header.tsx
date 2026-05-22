"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage, type Locale } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { useCart } from "@/lib/CartContext";

export function Header() {
  const { t, locale, setLocale } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [mastheadHeight, setMastheadHeight] = useState(120);

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
    const el = document.getElementById("masthead");
    if (el) setMastheadHeight(el.offsetHeight);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    "Blusher", "Body Care", "Cheeks", "Deal Of The Day", "Eyes",
    "Face Pack", "Hair care", "Lip stick", "Nails", "Natural",
    "Skin care", "Uncategorized",
  ];

  const headerStyles = `
    .header-wrapper { overflow: visible; }
    #masthead { overflow: visible; }
    @media (min-width: 1025px) {
      #mySidenav.nav.sidenav { display: block !important; width: auto !important; position: static !important; height: auto !important; background: transparent !important; }
      #mySidenav .main-navigation > .menu > ul { display: flex !important; flex-wrap: wrap !important; gap: 4px; list-style: none !important; margin: 0 !important; padding: 0 !important; }
      #mySidenav .main-navigation > .menu > ul > li { display: inline-block !important; position: relative !important; }
      #mySidenav .main-navigation > .menu > ul > li > a { color: inherit !important; padding: 6px 14px !important; text-decoration: none !important; font-size: 14px !important; white-space: nowrap !important; }
      #mySidenav .main-navigation > .menu > ul > li > a:hover { color: #FF5894 !important; }
      #mySidenav .main-navigation > .menu > ul > li.current-menu-item > a { color: #FF5894 !important; font-weight: 600 !important; }
      #mySidenav .main-navigation ul.sub-menu,
      #mySidenav .main-navigation ul ul { display: none !important; position: absolute !important; top: 100% !important; left: 0 !important; background: #fff !important; min-width: 180px !important; box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; border-radius: 8px !important; padding: 8px 0 !important; list-style: none !important; z-index: 999 !important; }
      #mySidenav .main-navigation ul li.menu-item-has-children:hover > ul.sub-menu,
      #mySidenav .main-navigation ul li.menu-item-has-children:hover > ul { display: block !important; }
      #mySidenav .main-navigation ul.sub-menu li { display: block !important; }
      #mySidenav .main-navigation ul.sub-menu li a { display: block !important; padding: 8px 20px !important; color: #444 !important; font-size: 13px !important; text-decoration: none !important; }
      #mySidenav .main-navigation ul.sub-menu li a:hover { color: #FF5894 !important; background: #fff5f8 !important; }
    }
    @media (max-width: 1024px) {
      #mySidenav.nav.sidenav { width: 0; position: fixed; }
      #mySidenav .main-navigation > .menu > ul { display: block; }
      #mySidenav .main-navigation > .menu > ul > li { display: block; }
      #mySidenav .main-navigation > .menu > ul > li > a { display: block; padding: 10px 20px; font-size: 14px; color: #333; text-decoration: none; border-bottom: 1px solid #f0f0f0; }
      #mySidenav .main-navigation > .menu > ul > li > a:hover { color: #FF5894; }
      #mySidenav .main-navigation ul.sub-menu { padding-left: 20px; }
      #mySidenav .main-navigation ul.sub-menu li a { display: block; padding: 8px 20px; font-size: 13px; color: #666; text-decoration: none; }
      .logo img { max-height: 28px; }
      #topabr .topbar-contents h4 { font-size: 10px; }
      #topabr .shop-btn a { font-size: 10px; padding: 2px 6px; }

      .toggle-nav { display: block !important; }
      a.closebtn { display: block !important; }
    }

    @media (max-width: 768px) {
      .main-header-box .row.bg-media { display: flex !important; flex-wrap: wrap !important; align-items: center !important; gap: 0; }
      .main-header-box .row.bg-media > .col-lg-2 { flex: 0 0 auto !important; width: auto !important; max-width: none !important; padding: 2px 6px !important; margin: 0 !important; }
      .main-header-box .row.bg-media > .col-lg-5.header-search-flex { flex: 1 1 auto !important; width: auto !important; max-width: none !important; padding: 2px 4px !important; margin: 0 !important; min-width: 0 !important; }
      .main-header-box .row.bg-media > .col-lg-5.quote-btn { flex: 0 0 auto !important; width: auto !important; max-width: none !important; padding: 2px 4px !important; margin: 0 !important; }
      .main-header-box .row.bg-media > .col-lg-5.header-nav { flex: 0 0 auto !important; width: auto !important; max-width: none !important; padding: 2px 4px !important; margin: 0 !important; }
      .main-header-box .row.bg-media > .col-lg-7 { flex: 0 0 100% !important; width: 100% !important; max-width: 100% !important; padding: 2px 8px 4px !important; margin: 0 !important; }
      .main-header-box .row.bg-media > .col-lg-7.mt-4 { margin-top: 0 !important; }
      .logo img { max-height: 24px !important; }
      .quote-btn .hotline-details { display: none !important; }
      .quote-btn .product-details { display: flex !important; align-items: center !important; gap: 2px !important; }
      .quote-btn .product-details .account,
      .quote-btn .product-details .wishlist { display: none !important; }
      .quote-btn .product-details .cart { display: flex !important; }
      .quote-btn .product-details .cart a i { font-size: 16px !important; }
      .cart-counter { top: -6px !important; right: -6px !important; width: 14px !important; height: 14px !important; font-size: 8px !important; line-height: 14px !important; }
      .header-nav .toggle-nav { display: block !important; float: none !important; position: static !important; width: auto !important; height: auto !important; margin: 0 !important; text-align: center !important; }
      .header-nav .toggle-nav span i { font-size: 20px !important; color: #333; }
      .header-search-flex { display: flex !important; flex-direction: row !important; align-items: center !important; }
      #cat_toggle { display: none !important; }
      #qnimate.off { display: block !important; }
      .search-form.searchBox { display: flex !important; align-items: center !important; margin: 0 !important; }
      .search-form .search-field { font-size: 11px !important; padding: 4px 6px !important; width: 70px !important; height: 24px !important; border: 1px solid #ddd !important; border-radius: 4px 0 0 4px !important; }
      .search-submit { font-size: 10px !important; padding: 4px 6px !important; height: 24px !important; border-radius: 0 4px 4px 0 !important; }
      .order-tracking-products, .recently-viewed-products { display: none !important; }
      .track-main-box { display: flex !important; flex-wrap: wrap !important; gap: 4px !important; justify-content: center !important; }
      .currency select, .language select { font-size: 10px !important; padding: 1px 3px !important; max-width: 55px !important; height: 20px !important; }
      #topabr { display: none !important; }
      .quote-btn > button { font-size: 13px !important; margin-right: 0 !important; padding: 0 2px !important; }
      .menubar { margin: 0 !important; }
      .innermenubox { padding-bottom: 0 !important; }
      #masthead { padding: 0 !important; }
      .main-header-box { padding: 0 !important; }
    }

    @media (max-width: 576px) {
      .main-header-box .row.bg-media > .col-lg-5.header-search-flex { display: none !important; }
      .main-header-box .row.bg-media > .col-lg-7 { display: none !important; }
      .main-header-box .row.bg-media { padding: 2px 0 !important; }
    }
  `;

  return (
    <div className="header-wrapper" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, transition: "transform 0.35s ease", transform: hidden ? "translateY(-100%)" : "translateY(0)" }}>
      <style dangerouslySetInnerHTML={{ __html: headerStyles }} />
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
                            <span onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><i className="fas fa-bars"></i></span>
                          </div>
                          <div id="mySidenav" className="nav sidenav" style={mobileMenuOpen ? { width: 260, position: "fixed", right: 0, top: 0, height: "100%", background: "#fff", zIndex: 9999999, paddingTop: 60, boxShadow: "-4px 0 30px rgba(0,0,0,0.15)", overflowY: "auto" } : {}}>
                            <a href="#" className="closebtn" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); }} style={{ position: "absolute", top: 10, right: 20, fontSize: 36, color: "#999", textDecoration: "none" }}>&times;</a>
                            <nav id="site-navigation" className="main-navigation">
                              <div className="menu clearfix">
                                <ul id="menu-primary-menu" className="clearfix mobile_nav">
                                  {(settings?.navItems || [
                                    { label: "Home", href: "/", children: [] },
                                    { label: "Blog", href: "/blog", children: [] },
                                    { label: "Shop", href: "/shop", children: [] },
                                    { label: "Contact", href: "/contact", children: [] },
                                  ]).map((item: any, i: number) => (
                                    <li key={i} className={`menu-item ${item.children?.length ? "menu-item-has-children" : ""} ${pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "current-menu-item" : ""}`}>
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
      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 9999998 }} />
      )}
    </div>
  );
}
