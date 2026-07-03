import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils/format'
import type { Blog } from '@/types/database'
import { useSettings } from '@/hooks/useSettings'

function BlogSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] overflow-hidden">
      <div className="h-48 bg-[var(--color-surface)] shimmer" />
      <div className="p-6 space-y-3">
        <div className="h-3 w-24 rounded bg-[var(--color-surface)] shimmer" />
        <div className="h-5 w-full rounded bg-[var(--color-surface)] shimmer" />
        <div className="h-4 w-3/4 rounded bg-[var(--color-surface)] shimmer" />
      </div>
    </div>
  )
}

export function LatestBlogs() {
  const { data: settings } = useSettings()
  const authorName = String(settings?.['blog_author_name'] ?? 'Jaidad Team')
  const { data: blogs, isLoading } = useQuery<Blog[]>({
    queryKey: ['latest-blogs-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, slug, excerpt, cover_image, category, published_at, created_at, status, tags, is_featured, view_count, meta_title, meta_description, content')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3)
      if (error) throw error
      return (data ?? []) as Blog[]
    },
    staleTime: 1000 * 60 * 5,
  })

  if (!isLoading && (!blogs || blogs.length === 0)) return null

  return (
    <section className="section-padding bg-[var(--color-surface)]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <SectionHeader
            label="Knowledge Hub"
            title="Latest from"
            highlightedWord="Our Blog"
            description="Market insights, investment guides, and real estate tips"
            align="left"
            className="mb-0"
          />
          <Link to="/blog" className={buttonVariants({ variant: 'outline', size: 'md' }) + ' flex-shrink-0'}>
            All Articles <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <BlogSkeleton key={i} />)
            : blogs!.map((blog, i) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <Link to={`/blog/${blog.slug}`} className="block relative overflow-hidden h-48">
                    {blog.cover_image ? (
                      <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-[var(--color-surface)] flex items-center justify-center">
                        <span className="text-[var(--color-text-muted)] text-sm">No image</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge variant="default">{blog.category}</Badge>
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)] mb-3">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="h-3 w-3" />
                        {formatDate(blog.published_at ?? blog.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiUser className="h-3 w-3" />
                        {authorName}
                      </span>
                    </div>

                    <Link
                      to={`/blog/${blog.slug}`}
                      className="font-display font-bold text-[var(--color-text)] text-base hover:text-[var(--color-brand-gold)] transition-colors line-clamp-2 leading-snug mb-3 block"
                    >
                      {blog.title}
                    </Link>

                    <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-4">{blog.excerpt}</p>

                    <Link
                      to={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand-gold)] hover:gap-2.5 transition-all"
                    >
                      Read More <FiArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.article>
              ))
          }
        </div>
      </div>
    </section>
  )
}
