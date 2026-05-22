"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface BlogPost {
  id: number;
  title: string;
  image: string;
  date: string;
  author: string;
  comments: number;
  excerpt: string;
  category: string;
}

interface CategoryCount {
  name: string;
  count: number;
}

export default function BlogPage() {
  const { t } = useLanguage();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [catCounts, setCatCounts] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch("/api/blog-posts")
      .then((res) => res.json())
      .then((data) => {
        const posts = (Array.isArray(data) ? data : data.posts || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          image: p.image || "/images/Image.png",
          date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Sep 18, 2024",
          author: p.author || "Admin",
          comments: 0,
          excerpt: p.excerpt || "",
          category: "Blog",
        }));
        setBlogPosts(posts);
        const counts: Record<string, number> = {};
        posts.forEach((p: BlogPost) => {
          counts[p.category] = (counts[p.category] || 0) + 1;
        });
        setCatCounts(Object.entries(counts).map(([name, count]) => ({ name, count })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const recentPosts = blogPosts.slice(0, 3);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <style>{`
        .blog-hero {
          background: linear-gradient(135deg, #FF5894 0%, #e83e8c 100%);
          padding: 60px 0;
          margin-top: 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .blog-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        .blog-hero h1 {
          font-family: 'Elsie', serif;
          font-size: 42px;
          font-weight: 400;
          color: #fff;
          margin: 0 0 8px;
          position: relative;
        }
        .blog-hero p {
          color: rgba(255,255,255,0.8);
          font-size: 15px;
          margin: 0;
          position: relative;
        }
        .blog-post-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .blog-post-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        }
        .blog-post-card .thumb {
          height: 220px;
          overflow: hidden;
          position: relative;
        }
        .blog-post-card .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .blog-post-card:hover .thumb img {
          transform: scale(1.05);
        }
        .blog-post-card .thumb .cat-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: #FF5894;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .blog-post-card .body {
          padding: 20px 24px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .blog-post-card .body .meta {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #999;
          margin-bottom: 10px;
        }
        .blog-post-card .body .meta span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .blog-post-card .body h3 {
          font-size: 18px;
          font-weight: 700;
          color: #222;
          margin: 0 0 10px;
          line-height: 1.4;
        }
        .blog-post-card .body h3 a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s;
        }
        .blog-post-card .body h3 a:hover {
          color: #FF5894;
        }
        .blog-post-card .body p {
          font-size: 14px;
          color: #777;
          line-height: 1.7;
          margin: 0 0 16px;
          flex: 1;
        }
        .blog-post-card .body .read-more {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #FF5894;
          text-decoration: none;
          transition: gap 0.2s;
        }
        .blog-post-card .body .read-more:hover {
          gap: 10px;
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
          font-size: 14px;
        }
        .recent-item {
          display: flex;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #f5f5f5;
          text-decoration: none;
        }
        .recent-item:last-child { border-bottom: none; }
        .recent-item .thumb {
          width: 64px;
          height: 64px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .recent-item .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .recent-item .info h4 {
          font-size: 13px;
          font-weight: 600;
          color: #333;
          margin: 0 0 4px;
          line-height: 1.4;
          transition: color 0.2s;
        }
        .recent-item:hover .info h4 { color: #FF5894; }
        .recent-item .info span {
          font-size: 11px;
          color: #aaa;
        }
        .cat-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 4px;
          background: transparent;
          color: #666;
        }
        .cat-btn:hover { background: #fff5f8; color: #FF5894; }
        .cat-btn.active { background: #FF5894; color: #fff; }
        .cat-btn .count {
          font-size: 11px;
          background: rgba(0,0,0,0.06);
          padding: 1px 8px;
          border-radius: 10px;
        }
        .cat-btn.active .count { background: rgba(255,255,255,0.2); color: #fff; }
      `}</style>

      <section className="blog-hero">
        <div className="container">
          <h1>Our Blog</h1>
          <p>Discover beauty tips, trends, and stories from our experts</p>
        </div>
      </section>

      <div className="container" style={{ padding: "40px 0 80px" }}>
        {loading ? (
          <div className="text-center py-20">
            <p style={{ color: "#999" }}>Loading posts...</p>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-20">
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: "#333", marginBottom: 8 }}>{t("blog.no_posts")}</h3>
                  <p style={{ color: "#999", fontSize: 14 }}>{t("blog.no_posts_hint")}</p>
                </div>
              ) : (
                <div className="row">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="col-lg-6 mb-6">
                      <article className="blog-post-card">
                        <div className="thumb">
                          <img src={post.image} alt={post.title} />
                          <span className="cat-badge">{post.category}</span>
                        </div>
                        <div className="body">
                          <div className="meta">
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                              {post.date}
                            </span>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                              {post.author}
                            </span>
                          </div>
                          <h3><Link href={`/blog/${post.id}`}>{post.title}</Link></h3>
                          <p>{post.excerpt}</p>
                          <Link href={`/blog/${post.id}`} className="read-more">
                            {t("blog.read_more")}
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                          </Link>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="col-lg-4">
              <div className="sidebar-widget">
                <h3>{t("blog.search")}</h3>
                <div className="search-box">
                  <input
                    placeholder={t("blog.search_placeholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </button>
                </div>
              </div>

              <div className="sidebar-widget">
                <h3>{t("blog.recent_posts")}</h3>
                {recentPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`} className="recent-item">
                    <div className="thumb">
                      <img src={post.image} alt="" />
                    </div>
                    <div className="info">
                      <h4>{post.title}</h4>
                      <span>{post.date}</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="sidebar-widget">
                <h3>{t("blog.categories")}</h3>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`cat-btn ${selectedCategory === "all" ? "active" : ""}`}
                >
                  <span>{t("blog.all_posts")}</span>
                  <span className="count">{blogPosts.length}</span>
                </button>
                {catCounts.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name.toLowerCase())}
                    className={`cat-btn ${selectedCategory === cat.name.toLowerCase() ? "active" : ""}`}
                  >
                    <span>{cat.name}</span>
                    <span className="count">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
