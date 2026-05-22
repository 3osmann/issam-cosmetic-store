"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  salePrice: number;
  bgColor: string;
  category: string;
  rating: number;
}

interface CatItem {
  name: string;
  slug: string;
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

function getCalendarDays(month: number, year: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

export default function ShopPage() {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<CatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("menu_order");
  const [page, setPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ])
      .then(([productsData, catsData]) => {
        const prods = (Array.isArray(productsData) ? productsData : productsData.products || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          image: p.image,
          price: parseFloat(p.price) || 0,
          salePrice: p.salePrice ? parseFloat(p.salePrice) : parseFloat(p.price) || 0,
          bgColor: p.bgColor || "",
          category: p.slug || "",
          rating: Math.round(parseFloat(p.rating) || 4),
        }));
        setAllProducts(prods);
        const cats = (Array.isArray(catsData) ? catsData : catsData.categories || []).map((c: any) => ({
          name: c.name,
          slug: c.slug,
        }));
        setCategoriesList(cats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = allProducts
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((p) => selectedCategory === "all" || p.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "date") return b.id - a.id;
      if (sortBy === "popularity") return b.rating - a.rating;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const pagedProducts = filteredProducts.slice((page - 1) * perPage, page * perPage);

  
  const calendarDays = getCalendarDays(currentMonth, currentYear);

  const instagramImages = ["/images/insta1.png", "/images/insta2.png", "/images/insta3.png", "/images/insta4.png", "/images/insta5.png", "/images/insta6.png"];

  return (
    <div id="shop">
      <style>{`
        .shop-hero {
          background: linear-gradient(135deg, #FF5894 0%, #e83e8c 100%);
          padding: 50px 0;
          margin-top: 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .shop-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 70% 30%, rgba(255,255,255,0.12) 0%, transparent 50%);
          pointer-events: none;
        }
        .shop-hero h1 {
          font-family: 'Elsie', serif;
          font-size: 42px;
          font-weight: 400;
          color: #fff;
          margin: 0 0 6px;
          position: relative;
        }
        .shop-hero p {
          color: rgba(255,255,255,0.85);
          font-size: 15px;
          margin: 0;
          position: relative;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin: 24px 0 32px;
        }
        .product-item {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          position: relative;
        }
        .product-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        }
        .product-item .thumb {
          height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .product-item .thumb img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.4s ease;
        }
        .product-item:hover .thumb img {
          transform: scale(1.06);
        }
        .product-item .badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #FF5894;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
        }
        .product-item .wishlist-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 2;
        }
        .product-item .wishlist-btn:hover {
          background: #FF5894;
        }
        .product-item .wishlist-btn:hover svg {
          stroke: #fff;
        }
        .product-item .info {
          padding: 16px 20px 20px;
        }
        .product-item .info .cat {
          font-size: 11px;
          color: #aaa;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .product-item .info h3 {
          font-size: 16px;
          font-weight: 700;
          color: #222;
          margin: 0 0 6px;
          line-height: 1.3;
        }
        .product-item .info h3 a {
          color: inherit;
          text-decoration: none;
        }
        .product-item .info h3 a:hover {
          color: #FF5894;
        }
        .product-item .stars {
          display: flex;
          gap: 2px;
          margin-bottom: 8px;
        }
        .product-item .stars svg {
          width: 14px;
          height: 14px;
        }
        .product-item .price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .product-item .price-row .price {
          font-size: 18px;
          font-weight: 700;
          color: #FF5894;
        }
        .product-item .price-row .price del {
          font-size: 13px;
          font-weight: 400;
          color: #bbb;
          margin-right: 6px;
        }
        .product-item .price-row .add-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #FF5894;
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .product-item .price-row .add-btn:hover {
          background: #e04a7c;
          transform: scale(1.1);
        }

        .shop-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
        }
        .shop-toolbar .result-count {
          font-size: 13px;
          color: #888;
          margin: 0;
        }
        .shop-toolbar .order-select {
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          color: #555;
          outline: none;
          background: #fff;
          cursor: pointer;
        }
        .shop-toolbar .order-select:focus {
          border-color: #FF5894;
        }

        .sidebar-widget {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          margin-bottom: 20px;
        }
        .sidebar-widget h3 {
          font-size: 16px;
          font-weight: 700;
          color: #222;
          margin: 0 0 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f5f5f5;
        }
        .sidebar-widget .search-box {
          display: flex;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .sidebar-widget .search-box:focus-within {
          border-color: #FF5894;
        }
        .sidebar-widget .search-box input {
          flex: 1;
          border: none;
          padding: 10px 14px;
          font-size: 13px;
          outline: none;
          color: #333;
        }
        .sidebar-widget .search-box button {
          background: #FF5894;
          border: none;
          color: #fff;
          padding: 10px 16px;
          cursor: pointer;
        }
        .cat-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .cat-list li {
          border-bottom: 1px solid #f7f7f7;
        }
        .cat-list li:last-child {
          border-bottom: none;
        }
        .cat-list li a {
          display: block;
          padding: 8px 0;
          font-size: 13px;
          color: #666;
          text-decoration: none;
          transition: all 0.2s;
        }
        .cat-list li a:hover,
        .cat-list li.current-cat a {
          color: #FF5894;
          font-weight: 600;
        }

        .cal-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        .cal-table caption {
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          font-size: 13px;
        }
        .cal-table th {
          color: #999;
          font-weight: 500;
          padding: 4px;
          text-align: center;
        }
        .cal-table td {
          text-align: center;
          padding: 5px 4px;
          color: #555;
          border-radius: 4px;
        }
        .cal-table td.today {
          background: #FF5894;
          color: #fff;
          font-weight: 600;
        }

        .insta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }
        .insta-grid a {
          display: block;
          border-radius: 8px;
          overflow: hidden;
          transition: opacity 0.2s;
        }
        .insta-grid a:hover {
          opacity: 0.8;
        }
        .insta-grid img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
        }

        .arch-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .arch-list li {
          border-bottom: 1px solid #f7f7f7;
        }
        .arch-list li:last-child {
          border-bottom: none;
        }
        .arch-list li a {
          display: block;
          padding: 8px 0;
          font-size: 13px;
          color: #666;
          text-decoration: none;
          transition: color 0.2s;
        }
        .arch-list li a:hover {
          color: #FF5894;
        }

        .pagination-wrap {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 32px;
        }
        .pagination-wrap a,
        .pagination-wrap span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .pagination-wrap a {
          background: #fff;
          color: #555;
          border: 1px solid #e5e5e5;
        }
        .pagination-wrap a:hover {
          border-color: #FF5894;
          color: #FF5894;
        }
        .pagination-wrap span.current {
          background: #FF5894;
          color: #fff;
          border: 1px solid #FF5894;
        }
        .pagination-wrap .next {
          width: auto;
          padding: 0 14px;
        }

        @media (max-width: 992px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 576px) {
          .products-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="shop-hero">
        <div className="container">
          <h1>Shop</h1>
          <p>Discover our curated collection of beauty essentials</p>
        </div>
      </section>

      <div className="container" style={{ padding: "40px 0 80px" }}>
        {loading ? (
          <div className="text-center py-20">
            <p style={{ color: "#999" }}>Loading products...</p>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-9 col-md-12">
              <div className="shop-toolbar">
                <p className="result-count">
                  Showing {Math.min((page - 1) * perPage + 1, filteredProducts.length)}–{Math.min(page * perPage, filteredProducts.length)} of {filteredProducts.length} results
                </p>
                <select className="order-select" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
                  <option value="menu_order">Default sorting</option>
                  <option value="popularity">Sort by popularity</option>
                  <option value="rating">Sort by average rating</option>
                  <option value="date">Sort by latest</option>
                  <option value="price">Sort by price: low to high</option>
                  <option value="price-desc">Sort by price: high to low</option>
                </select>
              </div>

              {pagedProducts.length === 0 ? (
                <div className="text-center py-20">
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: "#333", marginBottom: 8 }}>{t("shop.no_products")}</h3>
                  <p style={{ color: "#999", fontSize: 14 }}>{t("shop.no_products_hint")}</p>
                </div>
              ) : (
                <div className="products-grid">
                  {pagedProducts.map((product) => (
                    <div key={product.id} className="product-item">
                      <div className="thumb" style={{ background: product.bgColor || "#fafafa" }}>
                        {product.salePrice < product.price && (
                          <span className="badge">Sale</span>
                        )}
                        <button className="wishlist-btn" onClick={() => toggleWishlist(product.id)} title="Add to wishlist">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlist.includes(product.id) ? "#FF5894" : "none"} stroke={wishlist.includes(product.id) ? "#FF5894" : "#888"} strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </button>
                        <Link href={`/product/${product.id}`}>
                          <img src={product.image} alt={product.name} />
                        </Link>
                      </div>
                      <div className="info">
                        <div className="cat">{product.category}</div>
                        <h3><Link href={`/product/${product.id}`}>{product.name}</Link></h3>
                        <div className="stars">
                          {[1,2,3,4,5].map((s) => (
                            <svg key={s} viewBox="0 0 20 20" fill={s <= product.rating ? "#FF5894" : "#e5e5e5"}>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                          ))}
                        </div>
                        <div className="price-row">
                          <span className="price">
                            {product.salePrice < product.price ? (
                              <>
                                <del>${product.price.toFixed(2)}</del>
                                ${product.salePrice.toFixed(2)}
                              </>
                            ) : (
                              <>${product.price.toFixed(2)}</>
                            )}
                          </span>
                          <button className="add-btn" onClick={() => addItem({ id: product.id, name: product.name, image: product.image, price: product.price, salePrice: product.salePrice, bgColor: product.bgColor })} title="Add to cart">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="12" y1="5" x2="12" y2="19"/>
                              <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="pagination-wrap">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    p === page ? (
                      <span key={p} className="current">{p}</span>
                    ) : (
                      <a key={p} href="#" onClick={(e) => { e.preventDefault(); setPage(p); }}>{p}</a>
                    )
                  ))}
                  {page < totalPages && (
                    <a className="next" href="#" onClick={(e) => { e.preventDefault(); setPage(page + 1); }}>Next →</a>
                  )}
                </div>
              )}
            </div>

            <div className="col-lg-3 col-md-12">
              <div className="sidebar-widget">
                <h3>Search</h3>
                <div className="search-box">
                  <input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <button>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="sidebar-widget">
                <h3>Categories</h3>
                <ul className="cat-list">
                  <li className={selectedCategory === "all" ? "current-cat" : ""}>
                    <a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory("all"); }}>All Products</a>
                  </li>
                  {categoriesList.map((cat) => (
                    <li key={cat.slug} className={selectedCategory === cat.slug ? "current-cat" : ""}>
                      <a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory(cat.slug); }}>{cat.name}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sidebar-widget">
                <h3>Calendar</h3>
                <table className="cal-table">
                  <caption>{months[currentMonth]} {currentYear}</caption>
                  <thead>
                    <tr>
                      <th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th><th>S</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const rows: React.JSX.Element[] = [];
                      let cells: (number | null)[] = [];
                      calendarDays.forEach((d, i) => {
                        if (d !== null) cells.push(d);
                        if (cells.length === 7 || i === calendarDays.length - 1) {
                          while (cells.length < 7) cells.push(null);
                          rows.push(
                            <tr key={rows.length}>
                              {cells.map((c, ci) => (
                                <td key={ci} className={c === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? "today" : ""}>
                                  {c || ""}
                                </td>
                              ))}
                            </tr>
                          );
                          cells = [];
                        }
                      });
                      return rows;
                    })()}
                  </tbody>
                </table>
              </div>

              <div className="sidebar-widget">
                <h3>Instagram</h3>
                <div className="insta-grid">
                  {instagramImages.map((img, i) => (
                    <a key={i} href="#">
                      <img src={img} alt="" loading="lazy" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="sidebar-widget">
                <h3>Archives</h3>
                <ul className="arch-list">
                  <li><a href="#">May 2026</a></li>
                  <li><a href="#">April 2026</a></li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
