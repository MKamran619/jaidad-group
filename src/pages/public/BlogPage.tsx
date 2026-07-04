import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCalendar, FiUser, FiArrowRight, FiSearch } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils/format'
import type { Blog } from '@/types/database'
import { useSettings } from '@/hooks/useSettings'

function BlogCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <div className="h-48 shimmer bg-[var(--background)]" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-20 rounded shimmer bg-[var(--background)]" />
        <div className="h-5 w-full rounded shimmer bg-[var(--background)]" />
        <div className="h-4 w-3/4 rounded shimmer bg-[var(--background)]" />
      </div>
    </div>
  )
}

export function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const { data: settings } = useSettings()
  const authorName = String(settings?.['blog_author_name'] ?? 'Jaidad Team')

  const { data: blogs, isLoading } = useQuery<Blog[]>({
    queryKey: ['blogs-page'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as Blog[]
    },
    staleTime: 1000 * 60 * 5,
  })

  const categories = ['All', ...Array.from(new Set((blogs ?? []).map((b) => b.category).filter(Boolean)))]

  const filtered = (blogs ?? []).filter((b) => {
    const matchesCategory = activeCategory === 'All' || b.category === activeCategory
    const matchesSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <>
      <Helmet>
        <title>Real Estate Blog & Market Insights – J+ Jaidad Group</title>
        <meta name="description" content="Stay informed with the latest real estate news, market analysis, investment guides, and property tips from J+ Jaidad Group." />
      </Helmet>

      <div className="bg-[var(--surface)] py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">Knowledge Hub</p>
            <h1 className="font-display text-4xl md:text-5xl font-black text-[var(--text)] mb-4">
              Our <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-[var(--text-muted)] max-w-xl mx-auto">Market insights, investment guides, and real estate expertise</p>
          </motion.div>
        </div>
      </div>

      <section className="section-padding">
        <div className="container mx-auto px-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex flex-wrap gap-2 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
                    activeCategory === cat
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <Input
              placeholder="Search articles..."
              leftIcon={<FiSearch className="h-4 w-4" />}
              className="sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="space-y-6">
              <div className="h-72 rounded-2xl shimmer bg-[var(--surface)]" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => <BlogCardSkeleton key={i} />)}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[var(--text-muted)] text-lg">No articles found.</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featured && (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group mb-10 grid md:grid-cols-2 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] hover:shadow-xl transition-all"
                >
                  <div className="relative overflow-hidden h-64 md:h-auto">
                    {featured.cover_image ? (
                      <img src={featured.cover_image} alt={featured.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full bg-[var(--surface-alt)] flex items-center justify-center">
                        <span className="text-[var(--text-muted)] text-sm">No image</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4"><Badge>Featured</Badge></div>
                  </div>
                  <div className="p-8 flex flex-col justify-center gap-4">
                    <Badge variant="secondary">{featured.category}</Badge>
                    <Link to={`/blog/${featured.slug}`} className="font-display text-2xl font-bold text-[var(--text)] hover:text-[var(--primary)] transition-colors leading-tight">
                      {featured.title}
                    </Link>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1"><FiCalendar className="h-3 w-3" />{formatDate(featured.published_at ?? featured.created_at)}</span>
                      <span className="flex items-center gap-1"><FiUser className="h-3 w-3" />{authorName}</span>
                    </div>
                    <Link to={`/blog/${featured.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] hover:gap-3 transition-all">
                      Read Article <FiArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.article>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((blog, i) => (
                  <motion.article
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden hover:shadow-lg transition-all"
                  >
                    <Link to={`/blog/${blog.slug}`} className="block relative overflow-hidden h-48">
                      {blog.cover_image ? (
                        <img src={blog.cover_image} alt={blog.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="h-full w-full bg-[var(--surface)] flex items-center justify-center">
                          <span className="text-white/30 text-sm">No image</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3"><Badge variant="secondary">{blog.category}</Badge></div>
                    </Link>
                    <div className="p-6">
                      <div className="flex gap-4 text-xs text-[var(--text-muted)] mb-3">
                        <span className="flex items-center gap-1"><FiCalendar className="h-3 w-3" />{formatDate(blog.published_at ?? blog.created_at)}</span>
                      </div>
                      <Link to={`/blog/${blog.slug}`} className="font-display font-bold text-[var(--text)] hover:text-[var(--primary)] transition-colors line-clamp-2 leading-snug mb-2 block">
                        {blog.title}
                      </Link>
                      <p className="text-sm text-[var(--text-muted)] line-clamp-3 mb-4">{blog.excerpt}</p>
                      <Link to={`/blog/${blog.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)]">
                        Read More <FiArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
