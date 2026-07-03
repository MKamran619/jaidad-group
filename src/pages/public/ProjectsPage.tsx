import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMapPin, FiArrowRight, FiDownload, FiCalendar } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/Button'
import { CTASection } from '@/features/home/CTASection'
import { formatPrice } from '@/lib/utils/format'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'
import type { Project } from '@/types/database'

const STATUS_TABS = [
  { value: 'all', label: 'All Projects' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
]

const STATUS_VARIANTS: Record<string, 'gold' | 'info' | 'success'> = {
  ongoing: 'gold',
  upcoming: 'info',
  completed: 'success',
}

function ProjectCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="h-72 bg-[var(--color-background)] shimmer" />
      <div className="p-6 space-y-3">
        <div className="h-5 w-3/4 rounded bg-[var(--color-background)] shimmer" />
        <div className="h-4 w-1/2 rounded bg-[var(--color-background)] shimmer" />
        <div className="h-4 w-full rounded bg-[var(--color-background)] shimmer" />
        <div className="h-4 w-5/6 rounded bg-[var(--color-background)] shimmer" />
      </div>
    </div>
  )
}

export function ProjectsPage() {
  const [activeTab, setActiveTab] = useState('all')

  const { data: allProjects, isLoading } = useQuery<Project[]>({
    queryKey: ['projects-page'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as Project[]
    },
    staleTime: 1000 * 60 * 5,
  })

  const projects = activeTab === 'all'
    ? (allProjects ?? [])
    : (allProjects ?? []).filter((p) => p.project_status === activeTab)

  return (
    <>
      <Helmet>
        <title>Our Projects – J+ Jaidad Group</title>
        <meta name="description" content="Explore J+ Jaidad Group's premium residential and commercial development projects across Pakistan." />
      </Helmet>

      {/* Hero */}
      <div className="relative bg-[var(--color-brand-black)] py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[var(--color-brand-gold)] text-xs font-bold uppercase tracking-widest mb-4">Our Developments</p>
            <h1 className="font-display text-4xl md:text-6xl font-black text-white mb-6">
              Premium <span className="text-[var(--color-brand-gold)]">Projects</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              World-class residential and commercial developments reshaping Pakistan's urban landscape.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-[73px] z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 py-3 overflow-x-auto scrollbar-none">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  'px-5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
                  activeTab === tab.value
                    ? 'bg-[var(--color-brand-gold)] text-white'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-background)]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="section-padding bg-[var(--color-background)]">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {projects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="relative h-72 overflow-hidden">
                      {project.images[0] ? (
                        <img
                          src={project.images[0]}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full bg-[var(--color-brand-black)] flex items-center justify-center">
                          <span className="text-white/30 text-sm">No image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge variant={STATUS_VARIANTS[project.project_status] ?? 'secondary'} className="capitalize">
                          {project.project_status}
                        </Badge>
                      </div>
                      {(project.completion_percentage ?? 0) > 0 && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex justify-between text-white text-xs mb-1.5">
                            <span>Construction Progress</span>
                            <span className="font-bold">{project.completion_percentage}%</span>
                          </div>
                          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-[var(--color-brand-gold)] rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${project.completion_percentage}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, delay: 0.3 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-brand-gold)] transition-colors mb-2">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] mb-3">
                        <FiMapPin className="h-4 w-4 text-[var(--color-brand-gold)] flex-shrink-0" />
                        {project.location}
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-5">{project.description}</p>

                      <div className="grid grid-cols-3 gap-3 mb-5">
                        {project.total_units != null && (
                          <div className="text-center p-3 rounded-xl bg-[var(--color-background)]">
                            <p className="font-bold text-[var(--color-text)] text-sm">{project.total_units}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Total Units</p>
                          </div>
                        )}
                        {project.available_units != null && (
                          <div className="text-center p-3 rounded-xl bg-[var(--color-background)]">
                            <p className="font-bold text-[var(--color-brand-gold)] text-sm">{project.available_units}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Available</p>
                          </div>
                        )}
                        {project.completion_date && (
                          <div className="text-center p-3 rounded-xl bg-[var(--color-background)]">
                            <p className="font-bold text-[var(--color-text)] text-sm flex items-center justify-center gap-1">
                              <FiCalendar className="h-3 w-3" />
                              {new Date(project.completion_date).getFullYear()}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">Delivery</p>
                          </div>
                        )}
                      </div>

                      {project.starting_price != null && (
                        <p className="font-display text-lg font-black text-[var(--color-brand-gold)] mb-4">
                          Starting from {formatPrice(project.starting_price, 'PKR')}
                        </p>
                      )}

                      <div className="flex gap-3">
                        <Link
                          to={`/projects/${project.slug}`}
                          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex-1 justify-center')}
                        >
                          View Details
                        </Link>
                        <Link
                          to="/contact"
                          className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'flex-1 justify-center')}
                        >
                          Enquire <FiArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        {(project.downloads?.length ?? 0) > 0 && (
                          <a href={project.downloads[0].url} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                            <FiDownload className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!isLoading && projects.length === 0 && (
            <div className="text-center py-24">
              <p className="text-[var(--color-text-muted)] text-lg">No projects found for this category.</p>
            </div>
          )}
        </div>
      </div>

      <CTASection />
    </>
  )
}
