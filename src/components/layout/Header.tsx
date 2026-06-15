"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, Menu, X, User, Heart } from "lucide-react";
import { useLanguage, type Locale } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";

export function Header() {
  const { t, locale, setLocale } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 50);
      setShowScrollTop(current > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    fetch("/api/header").then(r => r.json()).then(setSettings).catch(() => {});
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const wrapper = document.querySelector(".header-wrapper");
    if (!wrapper) return;
    const setHeight = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${wrapper.getBoundingClientRect().height}px`
      );
    };
    setHeight();
    const ro = new ResizeObserver(setHeight);
    ro.observe(wrapper);
    window.addEventListener("resize", setHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setHeight);
    };
  }, [mobileSearchOpen, mobileMenuOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle("mobile-menu-open", mobileMenuOpen);
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.documentElement.classList.remove("mobile-menu-open"); document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const categories = [
    "Blusher", "Body Care", "Cheeks", "Deal Of The Day", "Eyes",
    "Face Pack", "Hair care", "Lip stick", "Nails", "Natural",
    "Skin care", "Uncategorized",
  ];

  const navItems = settings?.navItems || [
    { label: "Home", href: "/", children: [] },
    { label: "Blog", href: "/blog", children: [] },
    { label: "Shop", href: "/shop", children: [] },
    { label: "Contact", href: "/contact", children: [] },
  ];

  const renderNavLinks = (onNavigate?: () => void) => (
    <ul id="menu-primary-menu" className="clearfix mobile_nav">
      {navItems.map((item: any, i: number) => (
        <li
          key={i}
          className={`menu-item ${item.children?.length ? "menu-item-has-children" : ""} ${pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "current-menu-item" : ""}`}
        >
          <Link href={item.href} onClick={() => { if (!item.children?.length) onNavigate?.(); }}>
            {item.label}
          </Link>
          {item.children?.length > 0 && (
            <>
              <button
                type="button"
                className={`sub-toggle ${openSubmenu === i ? "open" : ""}`}
                onClick={() => setOpenSubmenu(openSubmenu === i ? null : i)}
                aria-label="Toggle submenu"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <ul className={`sub-menu ${openSubmenu === i ? "open" : ""}`}>
                {item.children.map((child: any, ci: number) => (
                  <li key={ci}>
                    <Link href={child.href} onClick={() => onNavigate?.()}>{child.label}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </li>
      ))}
    </ul>
  );

  const headerStyles = `
    .header-wrapper { overflow: visible; transition: transform 0.35s ease; }
    .header-wrapper.hidden { transform: translateY(-100%); }
    #masthead { overflow: visible; transition: box-shadow 0.25s ease, background 0.25s ease; }
    #masthead.scrolled { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    div#topabr { padding: 6px 14px !important; background: #FF5894; }
    div#topabr h4 { font-size: 13px !important; line-height: 20px !important; font-weight: 600 !important; margin: 0 !important; color: #fff; }
    #topabr .topbar-contents { display: flex; align-items: center; gap: 12px; }
    #topabr .shop-btn a { font-size: 13px; font-weight: 700; color: #fff; text-decoration: none; padding: 2px 12px; border: 1.5px solid rgba(255,255,255,0.5); border-radius: 20px; transition: background 0.2s, border-color 0.2s; }
    #topabr .shop-btn a:hover { background: rgba(255,255,255,0.15); border-color: #fff; }
    #topabr .socialbox a { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; color: #fff; transition: background 0.2s; font-size: 13px; }
    #topabr .socialbox a:hover { background: rgba(255,255,255,0.2); }
    #topabr .socialbox { gap: 4px; }
    .wishlist_view, .cart-cust {
      position: relative; display: inline-flex; align-items: center; justify-content: center;
      width: 40px; height: 40px; border-radius: 50%;
      background: rgba(255,88,148,0.08); transition: background 0.3s, transform 0.3s;
    }
    .wishlist_view:hover, .cart-cust:hover { background: rgba(255,88,148,0.18); transform: scale(1.05); }
    .wishlist_view i, .cart-cust i { margin: 0 !important; width: auto !important; height: auto !important; border: none !important; display: inline !important; font-size: 18px !important; line-height: 1 !important; }
    .wishlist .cart-counter, .cart .cart-counter {
      position: absolute; top: -4px; right: -4px;
      background: linear-gradient(135deg, #FF5894, #FF2D7B); color: #fff;
      min-width: 18px; height: 18px; padding: 0 4px;
      border-radius: 50%; font-size: 10px; font-weight: 800;
      line-height: 18px; text-align: center; z-index: 2;
      box-shadow: 0 2px 6px rgba(255,88,148,0.35);
      border: 2px solid #fff;
    }
    .mobile-header-bar {
      display: none;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 16px;
      min-height: 60px;
    }
    .mobile-header-logo {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
    }
    .mobile-header-logo a {
      display: flex;
      align-items: center;
      max-width: 100%;
    }
    .mobile-header-logo img {
      max-height: 36px !important;
      width: auto !important;
      max-width: min(160px, 48vw);
      object-fit: contain;
    }
    .mobile-header-actions { display: none; }
    .mobile-header-tools {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }
    .mobile-search-panel { display: none; }
    .mobile-icon-btn {
      width: 44px; height: 44px; border: none; border-radius: 12px;
      background: transparent; color: #333; cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
      transition: background 0.2s, color 0.2s, transform 0.15s;
      position: relative; text-decoration: none; flex-shrink: 0;
      -webkit-tap-highlight-color: transparent;
    }
    .mobile-icon-btn:active { transform: scale(0.94); }
    .mobile-icon-btn:hover, .mobile-icon-btn.active {
      color: #FF5894;
      background: rgba(255, 88, 148, 0.1);
    }
    .mobile-icon-btn--primary {
      background: linear-gradient(135deg, #FF5894, #FF2D7B);
      color: #fff !important;
      box-shadow: 0 4px 14px rgba(255, 88, 148, 0.28);
    }
    .mobile-icon-btn--primary:hover,
    .mobile-icon-btn--primary.active {
      background: linear-gradient(135deg, #FF2D7B, #FF5894);
      color: #fff !important;
    }
    .mobile-icon-btn .mobile-badge {
      position: absolute; top: 4px; right: 4px;
      min-width: 17px; height: 17px; padding: 0 4px;
      background: #FF5894; color: #fff;
      font-size: 10px; font-weight: 700; line-height: 17px;
      text-align: center; border-radius: 999px;
      border: 2px solid #fff;
      pointer-events: none;
    }
    .mobile-icon-btn--primary .mobile-badge {
      background: #fff; color: #FF5894; border-color: #FF5894;
    }
    .sidenav-quick-links {
      display: none;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;
      background: #fafafa;
    }
    .sidenav-quick-link {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      padding: 12px 8px; border-radius: 12px; background: #fff;
      border: 1px solid #eee; color: #444; text-decoration: none;
      font-size: 11px; font-weight: 600; transition: border-color 0.2s, color 0.2s;
    }
    .sidenav-quick-link:hover { color: #FF5894; border-color: #FF5894; }
    .sidenav-quick-link svg { color: #FF5894; }
    .mobile-search-panel {
      padding: 12px 16px 16px; background: #fff;
      border-bottom: 1px solid #f0f0f0;
    }
    .mobile-search-panel .search-form { display: flex; width: 100%; position: relative; margin: 0; }
    .mobile-search-panel .search-field {
      flex: 1; width: 100% !important; height: 44px !important;
      padding: 0 48px 0 16px !important; font-size: 14px !important;
      border: 1px solid #e0e0e0 !important; border-radius: 12px !important;
      background: #f8f8f8 !important;
    }
    .mobile-search-panel .search-field:focus { border-color: #FF5894 !important; background: #fff !important; outline: none !important; }
    .mobile-search-panel .search-submit {
      position: absolute !important; right: 5px !important; top: 50% !important;
      transform: translateY(-50%) !important; width: 34px !important; height: 34px !important;
      border-radius: 8px !important; padding: 0 !important;
    }
    .sidenav-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.45);
      z-index: 9999999; backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @media (min-width: 1025px) {
      .mobile-search-panel.is-open { display: none !important; }
      #mySidenav.nav.sidenav { display: block !important; width: auto !important; position: static !important; height: auto !important; background: transparent !important; padding-top: 0 !important; box-shadow: none !important; }
      #mySidenav .main-navigation > .menu > ul { display: flex !important; flex-wrap: nowrap !important; gap: 2px; list-style: none !important; margin: 0 !important; padding: 0 !important; justify-content: center !important; }
      #mySidenav .main-navigation > .menu > ul > li { display: inline-block !important; position: relative !important; border-bottom: none !important; }
      #mySidenav .main-navigation > .menu > ul > li > a { color: #333 !important; padding: 8px 18px !important; text-decoration: none !important; font-size: 14px !important; font-weight: 600 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; white-space: nowrap !important; border-radius: 6px !important; transition: all 0.2s ease !important; }
      #mySidenav .main-navigation > .menu > ul > li > a:hover { color: #FF5894 !important; background: #fff5f8 !important; }
      #mySidenav .main-navigation > .menu > ul > li.current-menu-item > a { color: #FF5894 !important; background: #fff5f8 !important; }
      #mySidenav .main-navigation ul.sub-menu,
      #mySidenav .main-navigation ul ul { display: none !important; position: absolute !important; top: 100% !important; left: 0 !important; background: #fff !important; min-width: 200px !important; box-shadow: 0 8px 30px rgba(0,0,0,0.1) !important; border-radius: 10px !important; padding: 8px 0 !important; list-style: none !important; z-index: 999 !important; border: 1px solid #f0f0f0 !important; }
      #mySidenav .main-navigation ul li.menu-item-has-children:hover > ul.sub-menu,
      #mySidenav .main-navigation ul li.menu-item-has-children:hover > ul { display: block !important; }
      #mySidenav .main-navigation ul.sub-menu li a { display: block !important; padding: 10px 22px !important; color: #444 !important; font-size: 13px !important; font-weight: 500 !important; text-decoration: none !important; transition: all 0.2s ease !important; }
      #mySidenav .main-navigation ul.sub-menu li a:hover { color: #FF5894 !important; background: #fff5f8 !important; padding-left: 28px !important; }
      #mySidenav .main-navigation ul li.menu-item-has-children > a::after { content: " ▾"; font-size: 10px; margin-left: 4px; opacity: 0.6; }
      #mySidenav .sub-toggle { display: none !important; }
      #mySidenav .main-navigation ul.sub-menu { max-height: none !important; overflow: visible !important; }
      a.closebtn { display: none !important; }
      .toggle-nav { display: none !important; }
      .sidenav-header, .sidenav-footer { display: none !important; }
      .sidenav-quick-links { display: none !important; }
      .mobile-menu-drawer { display: none !important; }
      .desktop-header-nav-col { display: block !important; }
    }
    @media (max-width: 1024px) {
      #mobileMenuDrawer.nav.sidenav {
        width: 0; max-width: min(340px, 90vw); position: fixed; top: 0; right: 0;
        height: 100%; height: 100dvh; background: #fff !important; z-index: 10000000;
        overflow-x: hidden; overflow-y: auto;
        transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.35s;
        padding-top: 0; box-shadow: -4px 0 24px rgba(0,0,0,0.1);
        visibility: hidden;
      }
      #mobileMenuDrawer.nav.sidenav.is-open {
        width: min(340px, 90vw) !important;
        visibility: visible;
      }
      #mobileMenuDrawer.nav.sidenav a { color: #333 !important; padding: 0 !important; }
      #mobileMenuDrawer .sidenav-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 22px 24px 18px; border-bottom: 1px solid #f0f0f0;
        position: sticky; top: 0; background: #fff; z-index: 2;
      }
      #mobileMenuDrawer .sidenav-header span { font-weight: 700; font-size: 18px; color: #222; letter-spacing: -0.3px; }
      #mobileMenuDrawer a.closebtn {
        position: static !important; font-size: 28px !important;
        color: #999 !important; line-height: 1; width: 36px; height: 36px;
        display: flex !important; align-items: center; justify-content: center;
        border-radius: 50%; transition: background 0.2s;
      }
      #mobileMenuDrawer a.closebtn:hover { background: #f5f5f5 !important; color: #333 !important; }
      #mobileMenuDrawer .main-navigation > .menu > ul { display: block; list-style: none; margin: 0; padding: 8px 0 24px; }
      #mobileMenuDrawer .main-navigation > .menu > ul > li {
        border-bottom: 1px solid #f0f0f0;
        position: relative;
      }
      #mobileMenuDrawer .main-navigation > .menu > ul > li > a {
        display: block; padding: 16px 56px 16px 24px; font-size: 15px; font-weight: 600;
        color: #333; text-decoration: none; transition: color 0.2s, background 0.2s;
        letter-spacing: -0.2px;
      }
      #mobileMenuDrawer .main-navigation > .menu > ul > li .sub-toggle {
        position: absolute; right: 10px; top: 10px; z-index: 3;
        width: 36px; height: 36px; border: none; background: transparent;
        border-radius: 50%; cursor: pointer; display: flex;
        align-items: center; justify-content: center;
        color: #999; font-size: 14px; transition: transform 0.25s ease, background 0.2s;
      }
      #mobileMenuDrawer .main-navigation > .menu > ul > li .sub-toggle:hover { background: #f5f5f5; color: #FF5894; }
      #mobileMenuDrawer .main-navigation > .menu > ul > li .sub-toggle.open { transform: rotate(180deg); color: #FF5894; }
      #mobileMenuDrawer .main-navigation > .menu > ul > li > a:hover,
      #mobileMenuDrawer .main-navigation > .menu > ul > li.current-menu-item > a {
        color: #FF5894; background: #fff5f8;
      }
      #mobileMenuDrawer .main-navigation ul.sub-menu {
        display: block; list-style: none; padding: 0;
        background: #fafafa; max-height: 0; overflow: hidden;
        transition: max-height 0.35s ease, padding 0.35s ease;
      }
      #mobileMenuDrawer .main-navigation ul.sub-menu.open { max-height: 500px; padding: 6px 0; }
      #mobileMenuDrawer .main-navigation ul.sub-menu li { border-bottom: 1px solid #f5f5f5; }
      #mobileMenuDrawer .main-navigation ul.sub-menu li:last-child { border-bottom: none; }
      #mobileMenuDrawer .main-navigation ul.sub-menu li a {
        display: block; padding: 14px 24px 14px 36px; font-size: 14px;
        font-weight: 500; color: #555; text-decoration: none;
        transition: color 0.2s, background 0.2s;
      }
      #mobileMenuDrawer .main-navigation ul.sub-menu li a:hover { color: #FF5894; background: #fff5f8; }
      #mobileMenuDrawer .sidenav-footer {
        padding: 20px 24px calc(20px + var(--safe-bottom));
        border-top: 1px solid #f0f0f0; display: flex; flex-wrap: wrap; gap: 12px;
      }
      #mobileMenuDrawer .sidenav-footer select {
        flex: 1; min-width: 100px; padding: 10px 12px; border-radius: 10px;
        border: 1px solid #e0e0e0; font-size: 14px; background: #f8f8f8;
        color: #444; outline: none; cursor: pointer;
      }
      #mobileMenuDrawer .sidenav-footer select:focus { border-color: #FF5894; }
      .mobile-menu-drawer { display: none; }
      .toggle-nav { display: none !important; }
    }
    @media (max-width: 991px) {
      .desktop-header-search { display: none !important; }
      .desktop-header-nav-col { display: none !important; }
      .mobile-menu-drawer { display: block !important; }
      .desktop-track-row { display: none !important; }
      .desktop-quote-btn { display: none !important; }
      .main-header-box .row.bg-media { display: none !important; }
      .mobile-header-bar { display: flex !important; }
      .sidenav-quick-links { display: grid !important; }
      #topabr { display: none !important; }
      #masthead { padding: 0 !important; background: #fff !important; }
      .nav_wrap { padding: 0 !important; max-width: 100% !important; }
      .main-header-box { padding: 0 !important; }
      .mobile-search-panel.is-open { display: block !important; }
      #masthead { box-shadow: 0 1px 0 rgba(0,0,0,0.06); }
      #masthead.scrolled { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    }
    @media (max-width: 390px) {
      .mobile-header-bar { padding: 8px 12px; min-height: 56px; }
      .mobile-header-logo img { max-height: 32px !important; max-width: 130px; }
      .mobile-icon-btn { width: 40px; height: 40px; border-radius: 10px; }
      .mobile-header-tools { gap: 2px; }
    }
    .scroll-top-btn {
      position: fixed; bottom: 30px; right: 30px; z-index: 99999;
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(135deg, #FF5894, #FF2D7B);
      color: #fff; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; box-shadow: 0 4px 15px rgba(255,88,148,0.4);
      transition: opacity 0.3s, transform 0.3s, visibility 0.3s;
      opacity: 0; visibility: hidden; transform: translateY(10px);
    }
    .scroll-top-btn.visible { opacity: 1; visibility: visible; transform: translateY(0); }
    .scroll-top-btn:hover { transform: scale(1.1); box-shadow: 0 6px 20px rgba(255,88,148,0.6); }
    html.dark .mobile-header-bar { background: #1e1e1e; }
    html.dark .mobile-icon-btn { color: #e8e8e8; }
    html.dark .mobile-icon-btn:hover,
    html.dark .mobile-icon-btn.active { background: rgba(255, 88, 148, 0.15); color: #FF5894; }
    html.dark .sidenav-quick-links { background: #1a1a1a; border-color: #333; }
    html.dark .sidenav-quick-link { background: #252525; border-color: #333; color: #ddd; }
    html.dark #mobileMenuDrawer.nav.sidenav { background: #1e1e1e !important; }
    html.dark #mobileMenuDrawer .sidenav-header { background: #1e1e1e; border-color: #333; }
    html.dark #mobileMenuDrawer .sidenav-header span { color: #eee; }
    html.dark #mobileMenuDrawer .main-navigation > .menu > ul > li > a { color: #ddd !important; }
  `;

  return (
      <>
    <div className="header-wrapper" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }}>
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
                <div className="mobile-header-bar">
                  <div className="mobile-header-logo">
                    <Link href="/">
                      <img
                        src={theme === "dark" ? "/images/logo_dark.png" : "/images/logo_light.png"}
                        alt="Cosmetic Store"
                      />
                    </Link>
                  </div>
                  <div className="mobile-header-tools">
                    <button
                      type="button"
                      className={`mobile-icon-btn ${mobileSearchOpen ? "active" : ""}`}
                      onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setMobileMenuOpen(false); }}
                      aria-label={t("search.placeholder")}
                    >
                      <Search size={20} strokeWidth={2.2} />
                    </button>
                    <Link href="/cart" className="mobile-icon-btn mobile-icon-btn--primary" aria-label="Cart">
                      <ShoppingBag size={20} strokeWidth={2.2} />
                      {itemCount > 0 && <span className="mobile-badge">{itemCount > 9 ? "9+" : itemCount}</span>}
                    </Link>
                    <button
                      type="button"
                      className={`mobile-icon-btn ${mobileMenuOpen ? "active" : ""}`}
                      onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setMobileSearchOpen(false); setOpenSubmenu(null); }}
                      aria-label="Menu"
                      aria-expanded={mobileMenuOpen}
                    >
                      {mobileMenuOpen ? <X size={22} strokeWidth={2.2} /> : <Menu size={22} strokeWidth={2.2} />}
                    </button>
                  </div>
                </div>
                <div className="row bg-media">
                  <div className="col-lg-2 col-md-5 col-sm-4 col-12 align-self-center col-logo">
                    <div className="logo">
                      <Link href="/"><img src={theme === "dark" ? "/images/logo_dark.png" : "/images/logo_light.png"} alt="logo" /></Link>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-7 header-search-flex desktop-header-search">
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
                          <button type="submit" className="search-submit" style={{ fontFamily: "'FontAwesome', sans-serif", background: "#FF5894", border: "none", color: "#fff", padding: "8px 11px", borderRadius: 70, fontSize: 12, cursor: "pointer", position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="11" cy="11" r="8"/>
                              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 col-md-8 col-sm-4 col-12 quote-btn desktop-quote-btn">
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
                          {wishlistCount > 0 && <span className="cart-counter">{wishlistCount}</span>}
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
                  <div className="col-lg-5 col-md-4 col-sm-4 col-12 mt-4 text-center header-nav align-self-center desktop-header-nav-col">
                    <div className="menubar m-0 mt-md-0">
                      <div className="right_menu">
                        <div className="innermenubox">
                          <div id="mySidenav" className="nav sidenav">
                            <nav id="site-navigation" className="main-navigation">
                              <div className="menu clearfix">{renderNavLinks()}</div>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-7 col-md-12 mt-4 desktop-track-row">
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
        <div className={`mobile-search-panel ${mobileSearchOpen ? "is-open" : ""}`}>
          <form role="search" className="search-form searchBox" action="/shop">
            <label className="w-100">
              <span className="screen-reader-text">Search for:</span>
              <input type="search" className="search-field" placeholder={t("search.placeholder")} name="s" />
            </label>
            <button type="submit" className="search-submit" style={{ fontFamily: "'FontAwesome', sans-serif", background: "#FF5894", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </form>
        </div>
      </header>

      <div
        id="mobileMenuDrawer"
        className={`nav sidenav mobile-menu-drawer ${mobileMenuOpen ? "is-open" : ""}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="sidenav-header">
          <span>Menu</span>
          <button
            type="button"
            className="closebtn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            &times;
          </button>
        </div>
        <div className="sidenav-quick-links">
          <Link href="/account" className="sidenav-quick-link" onClick={() => setMobileMenuOpen(false)}>
            <User size={20} strokeWidth={2} />
            Account
          </Link>
          <Link href="/wishlist" className="sidenav-quick-link" onClick={() => setMobileMenuOpen(false)}>
            <Heart size={20} strokeWidth={2} />
            Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
          </Link>
          <button
            type="button"
            className="sidenav-quick-link"
            style={{ border: "1px solid #eee", cursor: "pointer", fontFamily: "inherit" }}
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
        <nav className="main-navigation">
          <div className="menu clearfix">{renderNavLinks(() => setMobileMenuOpen(false))}</div>
        </nav>
        <div className="sidenav-footer">
          <select className="woocommerce-currency-switcher" defaultValue="USD" aria-label="Currency">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <select
            className="gt_selector notranslate"
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            aria-label="Language"
          >
            <option value="fr">{t("language.fr")}</option>
            <option value="en">{t("language.en")}</option>
            <option value="ar">{t("language.ar")}</option>
          </select>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sidenav-overlay" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
      )}
    </div>
      <button className={`scroll-top-btn${showScrollTop ? " visible" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
      </button>
    </>
  );
}
