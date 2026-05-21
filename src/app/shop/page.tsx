"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart, Star } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";

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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<CatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("menu_order");
  const [wishlist, setWishlist] = useState<number[]>([]);
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

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const calendarDays = getCalendarDays(currentMonth, currentYear);

  const instagramImages = ["/images/insta1.png", "/images/insta2.png", "/images/insta3.png", "/images/insta4.png", "/images/insta5.png", "/images/insta6.png"];

  return (
    <div id="shop">
      <style>{`
        .woocommerce ul.products li.product .star-rating { display: block !important; }
        .woocommerce ul.products li.product .button.add_to_cart_button {
          display: inline-block;
          background: #FF5894;
          color: #fff;
          font-family: Inter;
          font-size: 14px;
          font-weight: 600;
          padding: 10px 20px;
          border-radius: 6px;
          text-decoration: none;
          margin-top: 10px;
          transition: background 0.3s;
        }
        .woocommerce ul.products li.product .button.add_to_cart_button:hover {
          background: #e04a7c;
        }
        .woocommerce ul.products {
          display: flex;
          flex-wrap: wrap;
        }
        .woocommerce ul.products li.product {
          position: relative;
          width: 30.75% !important;
          margin-right: 3.8% !important;
          margin-bottom: 2.992em;
          float: none !important;
          display: flex;
          flex-direction: column;
        }
        .woocommerce ul.products li.product:nth-child(3n) {
          margin-right: 0 !important;
        }
        .woocommerce ul.products li.product .woocommerce-LoopProduct-link {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .woocommerce ul.products li.product .button.add_to_cart_button {
          margin-top: auto;
        }
        .woocommerce ul.products li.product .product-image-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 180px;
        }
        .woocommerce ul.products li.product a img {
          object-fit: contain;
        }
        .yith-wcwl-add-button svg {
          width: 20px;
          height: 20px;
        }
        .shop nav.woocommerce-breadcrumb { display: block !important; }
        #shop ul.products li.product .star-rating { display: block !important; }
      `}</style>
      <div className="container">
        <div className="shop">
          <div id="container">
            <div id="content" role="main">
              <nav className="woocommerce-breadcrumb" aria-label="Breadcrumb">
                <Link href="/">Home</Link>&nbsp;/&nbsp;Shop
              </nav>
              <div className="woocommerce">
              <div className="row">
                <div className="col-lg-9 col-md-12">
                  <header className="woocommerce-products-header">
                    <h1 className="woocommerce-products-header__title page-title">Shop</h1>
                  </header>

                  {loading ? (
                    <div className="text-center py-20">
                      <p style={{ color: "var(--admin-text-muted)" }}>Loading products...</p>
                    </div>
                  ) : (
                    <>
                      <div className="woocommerce-notices-wrapper"></div>
                      <p className="woocommerce-result-count" role="alert" aria-relevant="all">
                        Showing {Math.min((page - 1) * perPage + 1, filteredProducts.length)}–{Math.min(page * perPage, filteredProducts.length)} of {filteredProducts.length} results
                      </p>
                      <form className="woocommerce-ordering" method="get">
                        <select name="orderby" className="orderby" aria-label="Shop order" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
                          <option value="menu_order">Default sorting</option>
                          <option value="popularity">Sort by popularity</option>
                          <option value="rating">Sort by average rating</option>
                          <option value="date">Sort by latest</option>
                          <option value="price">Sort by price: low to high</option>
                          <option value="price-desc">Sort by price: high to low</option>
                        </select>
                      </form>

                      {pagedProducts.length === 0 ? (
                        <div className="text-center py-20">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{t("shop.no_products")}</h3>
                          <p className="text-gray-500 text-sm">{t("shop.no_products_hint")}</p>
                        </div>
                      ) : (
                        <ul className="products columns-3">
                          {pagedProducts.map((product) => (
                            <li key={product.id} className={`product type-product post-${product.id} status-publish instock product_cat-${product.category} has-post-thumbnail shipping-taxable purchasable product-type-simple`}>
                              <Link href={`/product/${product.id}`} className="woocommerce-LoopProduct-link woocommerce-loop-product__link">
                                <span className="product-image-wrapper">
                                  <img width="132" height="214" src={product.image} className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" alt={product.name} decoding="async" />
                                </span>
                                <h2 className="woocommerce-loop-product__title">{product.name}</h2>
                                <div className="star-rating" role="img" aria-label={`Rated ${product.rating}.00 out of 5`}>
                                  <span style={{ width: `${(product.rating / 5) * 100}%` }}>Rated <strong className="rating">{product.rating}.00</strong> out of 5</span>
                                </div>
                                <span className="price">
                                  <span className="woocommerce-Price-amount amount">
                                    {product.salePrice < product.price ? (
                                      <>
                                        <del aria-hidden="true"><span className="woocommerce-Price-amount amount">${product.price.toFixed(2)}</span></del>
                                        <ins><span className="woocommerce-Price-amount amount">${product.salePrice.toFixed(2)}</span></ins>
                                      </>
                                    ) : (
                                      <bdi>${product.price.toFixed(2)}<span className="woocommerce-Price-currencySymbol"></span></bdi>
                                    )}
                                  </span>
                                </span>
                              </Link>
                              <a href="#" aria-describedby={`woocommerce_loop_add_to_cart_link_describedby_${product.id}`} data-quantity="1" className="button product_type_simple add_to_cart_button ajax_add_to_cart" data-product_id={product.id} data-product_sku="5000" aria-label={`Add to cart: “${product.name}”`} rel="nofollow" role="button">Add to cart</a>
                              <span id={`woocommerce_loop_add_to_cart_link_describedby_${product.id}`} className="screen-reader-text"></span>
                              <div className="yith-wcwl-add-to-wishlist add-to-wishlist-{product.id} yith-wcwl-add-to-wishlist--link-style wishlist-fragment on-first-load">
                                <div className="yith-wcwl-add-button">
                                  <a href="#" className="add_to_wishlist single_add_to_wishlist" data-product-id={product.id} data-product-type="simple" rel="nofollow" onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}>
                                    <svg id="yith-wcwl-icon-heart-outline" className="yith-wcwl-icon-svg" fill={wishlist.includes(product.id) ? "currentColor" : "none"} strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"></path>
                                    </svg>
                                    <span>{wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}</span>
                                  </a>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}

                      {totalPages > 1 && (
                        <nav className="woocommerce-pagination" aria-label="Product Pagination">
                          <ul className="page-numbers">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                              <li key={p}>
                                {p === page ? (
                                  <span aria-label={`Page ${p}`} aria-current="page" className="page-numbers current">{p}</span>
                                ) : (
                                  <a className="page-numbers" href="#" onClick={(e) => { e.preventDefault(); setPage(p); }}>{p}</a>
                                )}
                              </li>
                            ))}
                            {page < totalPages && (
                              <li><a className="next page-numbers" href="#" onClick={(e) => { e.preventDefault(); setPage(page + 1); }}>→</a></li>
                            )}
                          </ul>
                        </nav>
                      )}
                    </>
                  )}
                </div>

                <div className="col-lg-3 col-md-12">
                  <div id="sidebar">
                    <aside id="block-2" className="widget widget_block widget_search">
                      <form role="search" className="wp-block-search__button-outside wp-block-search__text-button wp-block-search">
                        <label className="wp-block-search__label">Search</label>
                        <div className="wp-block-search__inside-wrapper">
                          <input className="wp-block-search__input" placeholder="" type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} name="s" required />
                          <button aria-label="Search" className="wp-block-search__button wp-element-button" type="submit">Search</button>
                        </div>
                      </form>
                    </aside>

                    <aside id="block-3" className="widget widget_block">
                      <div className="wp-block-group">
                        <div className="wp-block-group__inner-container">
                          <h2 className="wp-block-heading">Categories</h2>
                          <ul className="wp-block-categories-list wp-block-categories">
                            <li className="cat-item"><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory("all"); }}>All Products</a></li>
                            {categoriesList.map((cat) => (
                              <li key={cat.slug} className={`cat-item${selectedCategory === cat.slug ? " current-cat" : ""}`}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory(cat.slug); }}>{cat.name}</a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </aside>

                    <aside id="calendar-2" className="widget widget_calendar">
                      <h3 className="widget-title">Calendar</h3>
                      <div id="calendar_wrap" className="calendar_wrap">
                        <table id="wp-calendar" className="wp-calendar-table">
                          <caption>{months[currentMonth]} {currentYear}</caption>
                          <thead>
                            <tr>
                              <th scope="col" aria-label="Monday">M</th>
                              <th scope="col" aria-label="Tuesday">T</th>
                              <th scope="col" aria-label="Wednesday">W</th>
                              <th scope="col" aria-label="Thursday">T</th>
                              <th scope="col" aria-label="Friday">F</th>
                              <th scope="col" aria-label="Saturday">S</th>
                              <th scope="col" aria-label="Sunday">S</th>
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
                                          {c || <>&nbsp;</>}
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
                    </aside>

                    <aside id="media_gallery-2" className="widget widget_media_gallery">
                      <h3 className="widget-title">Instagram</h3>
                      <div id="gallery-1" className="gallery gallery-columns-3 gallery-size-thumbnail">
                        {instagramImages.map((img, i) => (
                          <dl key={i} className="gallery-item">
                            <dt className="gallery-icon landscape">
                              <a href="#"><img width="150" height="127" src={img} className="attachment-thumbnail size-thumbnail" alt="" decoding="async" loading="lazy" /></a>
                            </dt>
                          </dl>
                        ))}
                      </div>
                    </aside>

                    <aside id="block-9" className="widget widget_block">
                      <div className="wp-block-group">
                        <div className="wp-block-group__inner-container">
                          <h2 className="wp-block-heading">Archives</h2>
                          <ul className="wp-block-archives-list wp-block-archives">
                            <li><a href="#">May 2026</a></li>
                            <li><a href="#">April 2026</a></li>
                          </ul>
                        </div>
                      </div>
                    </aside>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
