import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiCalendar, FiTag, FiArrowLeft, FiShare2, FiEye, FiClock } from 'react-icons/fi'
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/Button'
import { CTASection } from '@/features/home/CTASection'
import { supabase } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { Blog } from '@/types/database'

function getReadingTime(content: string) {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data: blog, isLoading } = useQuery<Blog | null>({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug!)
        .eq('status', 'published')
        .single()
      if (error) return null
      return data as Blog
    },
    enabled: !!slug,
  })

  const { data: related } = useQuery<Blog[]>({
    queryKey: ['blog-related', blog?.id, blog?.category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, slug, cover_image, category, published_at, created_at')
        .eq('status', 'published')
        .eq('category', blog!.category)
        .neq('id', blog!.id)
        .limit(2)
      if (error) return []
      return (data ?? []) as Blog[]
    },
    enabled: !!blog,
  })

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-10 w-3/4 rounded shimmer bg-[var(--surface)]" />
          <div className="h-72 rounded-2xl shimmer bg-[var(--surface)]" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 rounded shimmer bg-[var(--surface)]" style={{ width: `${85 + (i % 3) * 5}%` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <p className="text-4xl font-black text-[var(--text)] mb-4">Article Not Found</p>
        <p className="text-[var(--text-muted)] mb-8">This article may have been removed or the link is incorrect.</p>
        <Link to="/blog" className={buttonVariants({ variant: 'primary', size: 'md' })}>Back to Blog</Link>
      </div>
    )
  }

  const readingTime = getReadingTime(blog.content)
  const shareText = encodeURIComponent(blog.title)

  return (
    <>
      <Helmet>
        <title>{blog.title} – J+ Jaidad Group Blog</title>
        <meta name="description" content={blog.excerpt} />
      </Helmet>

      {/* Hero */}
      <div className="relative min-h-[420px] flex items-end bg-[var(--color-brand-black)] overflow-hidden">
        {blog.cover_image && (
          <img
            src={blog.cover_image}
            alt={blog.title}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="relative container mx-auto px-4 pb-12 pt-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="default" className="mb-4">{blog.category}</Badge>
            <h1 className="font-display text-3xl md:text-5xl font-black text-white max-w-4xl leading-tight mb-4">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-sm text-white/70">
              <span className="flex items-center gap-1.5">
                <FiCalendar className="h-4 w-4" />
                {formatDate(blog.published_at ?? blog.created_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <FiClock className="h-4 w-4" />
                {readingTime} min read
              </span>
              <span className="flex items-center gap-1.5">
                <FiEye className="h-4 w-4" />
                {blog.view_count.toLocaleString()} views
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[var(--background)] section-padding">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mb-8 inline-flex')}>
              <FiArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>

            {/* Article */}
            <article className="mb-12">
              <p className="text-xl text-[var(--text-muted)] leading-relaxed mb-8 font-medium border-l-4 border-[var(--primary)] pl-5">
                {blog.excerpt}
              </p>
              <div
                className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </article>

            {/* Tags */}
            {blog.tags?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-8">
                <FiTag className="h-4 w-4 text-[var(--text-muted)]" />
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">#{tag}</Badge>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="border-t border-b border-[var(--border)] py-6 mb-12">
              <p className="text-sm font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                <FiShare2 className="h-4 w-4" /> Share this article
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <FaFacebook className="h-4 w-4" /> Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 transition-colors"
                >
                  <FaTwitter className="h-4 w-4" /> Twitter
                </a>
                <a
                  href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <FaWhatsapp className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>

            {/* Related */}
            {related && related.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-[var(--text)] mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {related.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group block rounded-2xl overflow-hidden border border-[var(--border)] hover:shadow-md transition-all"
                    >
                      <div className="h-40 overflow-hidden bg-[var(--surface)]">
                        {post.cover_image ? (
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <span className="text-[var(--text-muted)] text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <Badge variant="default" className="mb-2">{post.category}</Badge>
                        <h3 className="font-display font-bold text-[var(--text)] text-sm line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                          {post.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CTASection />
    </>
  )
}
