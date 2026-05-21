"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ChevronRight, Calendar, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
    <div style={{ paddingTop: 80, paddingBottom: 80 }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{t("blog.no_posts")}</h3>
                <p className="text-gray-500 text-sm">{t("blog.no_posts_hint")}</p>
              </div>
            ) : (
              filteredPosts.map((post, index) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-2/5">
                      <img src={post.image} alt={post.title} className="w-full h-48 md:h-full object-cover" />
                    </div>
                    <div className="md:w-3/5 p-6 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-medium text-[#FF5894] uppercase tracking-wider">{post.category}</span>
                        <Link href={`/blog/${post.id}`}>
                          <h2 className="text-lg font-bold text-gray-900 mt-1 hover:text-[#FF5894] transition-colors line-clamp-2">{post.title}</h2>
                        </Link>
                        <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-3">{post.excerpt}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3.5 w-3.5" />
                            {post.comments}
                          </span>
                        </div>
                        <Link href={`/blog/${post.id}`}>
                          <Button variant="ghost" size="sm" className="text-[#FF5894]">
                            {t("blog.read_more")} <ChevronRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <aside className="space-y-6">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-gray-900 mb-3">{t("blog.search")}</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t("blog.search_placeholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-gray-900 mb-3">{t("blog.recent_posts")}</h3>
                <div className="space-y-3">
                  {recentPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`} className="flex gap-3 group">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img src={post.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#FF5894] transition-colors">{post.title}</h4>
                        <span className="text-xs text-gray-400">{post.date}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-gray-900 mb-3">{t("blog.categories")}</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedCategory === "all" ? "bg-[#FF5894] text-white" : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <span>{t("blog.all_posts")}</span>
                    <span className="text-xs">{blogPosts.length}</span>
                  </button>
                  {catCounts.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name.toLowerCase())}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedCategory === cat.name.toLowerCase() ? "bg-[#FF5894] text-white" : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
