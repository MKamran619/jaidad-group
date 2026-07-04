import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiMapPin, FiCalendar, FiDownload, FiArrowLeft, FiArrowRight, FiCheckCircle, FiHome, FiUsers } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/Badge'
import { buttonVariants } from '@/components/ui/Button'
import { CTASection } from '@/features/home/CTASection'
import { formatPrice } from '@/lib/utils/format'
import { supabase } from '@/lib/supabase/client'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils/cn'
import type { Project } from '@/types/database'

const STATUS_VARIANTS: Record<string, 'gold' | 'info' | 'success'> = {
  ongoing: 'gold',
  upcoming: 'info',
  completed: 'success',
}

const STATUS_LABELS: Record<string, string> = {
  ongoing: 'Ongoing',
  upcoming: 'Upcoming',
  completed: 'Completed',
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: settings } = useSettings()

  const { data: project, isLoading } = useQuery<Project | null>({
    queryKey: ['project', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug!)
        .eq('is_active', true)
        .single()
      if (error) return null
      return data as Project
    },
    enabled: !!slug,
  })

  const { data: others } = useQuery<Project[]>({
    queryKey: ['project-others', project?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, slug, location, images, project_status')
        .eq('is_active', true)
        .neq('id', project!.id)
        .limit(2)
      if (error) return []
      return (data ?? []) as Project[]
    },
    enabled: !!project,
  })

  const whatsappNumber = String(settings?.['whatsapp'] ?? '923000000000').replace(/\D/g, '')

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 space-y-6">
        <div className="h-[60vh] rounded-2xl shimmer bg-[var(--surface)]" />
        <div className="h-8 w-2/3 rounded shimmer bg-[var(--surface)]" />
        <div className="h-4 w-1/2 rounded shimmer bg-[var(--surface)]" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <p className="text-4xl font-black text-[var(--text)] mb-4">Project Not Found</p>
        <p className="text-[var(--text-muted)] mb-8">This project may have been removed or the link is incorrect.</p>
        <Link to="/projects" className={buttonVariants({ variant: 'primary', size: 'md' })}>View All Projects</Link>
      </div>
    )
  }

  const whatsappMsg = encodeURIComponent(`Hi J+ Jaidad Group, I'm interested in the project: ${project.title}. Please share more details.`)

  return (
    <>
      <Helmet>
        <title>{project.title} – J+ Jaidad Group</title>
        <meta name="description" content={project.description} />
      </Helmet>

      {/* Hero */}
      <div className="relative min-h-[65vh] flex items-end overflow-hidden">
        {project.images[0] ? (
          <img
            src={project.images[0]}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--surface)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

        <div className="relative container mx-auto px-4 pb-14 pt-32">
          <Link to="/projects" className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
            <FiArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant={STATUS_VARIANTS[project.project_status]} className="mb-4">
              {STATUS_LABELS[project.project_status]}
            </Badge>
            <h1 className="font-display text-3xl md:text-5xl font-black text-white mb-4 max-w-3xl">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-white/70 text-sm">
              <span className="flex items-center gap-1.5">
                <FiMapPin className="h-4 w-4 text-[var(--primary)]" />
                {project.location}
              </span>
              {project.completion_date && (
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="h-4 w-4 text-[var(--primary)]" />
                  Est. Completion: {new Date(project.completion_date).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })}
                </span>
              )}
              {project.starting_price && (
                <span className="text-[var(--primary)] font-semibold">
                  Starting from {formatPrice(project.starting_price, 'PKR')}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-[var(--primary)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-amber-500/40">
            {[
              { label: 'Total Units', value: project.total_units ? `${project.total_units}` : '–', icon: FiHome },
              { label: 'Available Units', value: project.available_units != null ? `${project.available_units}` : '–', icon: FiUsers },
              {
                label: 'Completion',
                value: project.project_status === 'completed' ? '100%' : `${project.completion_percentage ?? 0}%`,
                icon: FiCheckCircle,
              },
              {
                label: 'Status',
                value: STATUS_LABELS[project.project_status],
                icon: FiCalendar,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center py-5 px-4 text-center">
                <Icon className="h-5 w-5 text-white/70 mb-1" />
                <p className="text-xl font-black text-white">{value}</p>
                <p className="text-xs text-white/70 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">

            {/* Description */}
            <section>
              <h2 className="font-display text-2xl font-bold text-[var(--text)] mb-4">About This Project</h2>
              <p className="text-[var(--text-muted)] leading-relaxed text-base">{project.description}</p>
              {project.investment_details && (
                <div className="mt-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 p-5">
                  <h3 className="font-semibold text-[var(--primary)] mb-2">Investment Details</h3>
                  <p className="text-sm text-[var(--text-muted)]">{project.investment_details}</p>
                </div>
              )}
            </section>

            {/* Progress Bar */}
            {project.project_status !== 'upcoming' && (
              <section>
                <h2 className="font-display text-2xl font-bold text-[var(--text)] mb-4">Construction Progress</h2>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--text)]">Overall Completion</span>
                    <span className="text-sm font-bold text-[var(--primary)]">
                      {project.project_status === 'completed' ? '100%' : `${project.completion_percentage ?? 0}%`}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-[var(--border)] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-[var(--primary)]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${project.project_status === 'completed' ? 100 : (project.completion_percentage ?? 0)}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      viewport={{ once: true }}
                    />
                  </div>
                  {project.completion_date && (
                    <p className="mt-3 text-xs text-[var(--text-muted)]">
                      Expected completion: {new Date(project.completion_date).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Timeline */}
            {project.timeline && project.timeline.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-bold text-[var(--text)] mb-6">Project Timeline</h2>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border)]" />
                  <div className="space-y-6">
                    {project.timeline.map((item, i) => (
                      <motion.div
                        key={i}
                        className="relative pl-12"
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="absolute left-0 top-1 h-8 w-8 rounded-full border-2 border-[var(--primary)] bg-[var(--background)] flex items-center justify-center">
                          <FiCheckCircle className="h-4 w-4 text-[var(--primary)]" />
                        </div>
                        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                          <p className="text-xs font-bold text-[var(--primary)] mb-0.5 uppercase tracking-wide">{item.date}</p>
                          <p className="font-semibold text-[var(--text)]">{item.title}</p>
                          {item.description && (
                            <p className="mt-1 text-sm text-[var(--text-muted)]">{item.description}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Image Gallery */}
            {project.images.length > 1 && (
              <section>
                <h2 className="font-display text-2xl font-bold text-[var(--text)] mb-4">Gallery</h2>
                <div className="grid grid-cols-2 gap-3">
                  {project.images.slice(1).map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden aspect-video border border-[var(--border)]">
                      <img src={img} alt={`${project.title} ${i + 2}`} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enquiry Card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sticky top-24">
              <h3 className="font-display text-xl font-bold text-[var(--text)] mb-1">Interested in this project?</h3>
              <p className="text-sm text-[var(--text-muted)] mb-5">Get in touch with our sales team for pricing, availability, and site visits.</p>

              {project.starting_price && (
                <div className="rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 p-4 mb-5 text-center">
                  <p className="text-xs text-[var(--text-muted)] font-medium mb-0.5">Starting From</p>
                  <p className="text-2xl font-black text-[var(--primary)]">{formatPrice(project.starting_price, 'PKR')}</p>
                </div>
              )}

              <div className="space-y-3">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: 'primary', size: 'md' }), 'w-full justify-center')}
                >
                  WhatsApp Enquiry
                </a>
                <Link
                  to="/contact"
                  className={cn(buttonVariants({ variant: 'outline', size: 'md' }), 'w-full justify-center')}
                >
                  Contact Us
                </Link>
              </div>

              {(project.total_units || project.available_units != null) && (
                <div className="mt-5 pt-5 border-t border-[var(--border)] grid grid-cols-2 gap-4 text-center">
                  {project.total_units && (
                    <div>
                      <p className="text-lg font-bold text-[var(--text)]">{project.total_units}</p>
                      <p className="text-xs text-[var(--text-muted)]">Total Units</p>
                    </div>
                  )}
                  {project.available_units != null && (
                    <div>
                      <p className="text-lg font-bold text-[var(--primary)]">{project.available_units}</p>
                      <p className="text-xs text-[var(--text-muted)]">Available</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Downloads */}
            {project.downloads && project.downloads.length > 0 && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="font-semibold text-[var(--text)] mb-3">Downloads</h3>
                <div className="space-y-2">
                  {project.downloads.map((dl, i) => (
                    <a
                      key={i}
                      href={dl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl p-3 border border-[var(--border)] hover:border-[var(--primary)] hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors text-sm font-medium text-[var(--text)] group"
                    >
                      <FiDownload className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors flex-shrink-0" />
                      {dl.title}
                      <span className="ml-auto text-xs uppercase text-[var(--text-muted)]">{dl.type}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Other Projects */}
        {others && others.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold text-[var(--text)] mb-6">Other Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {others.map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.slug}`}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden hover:border-[var(--primary)] transition-all hover:shadow-md"
                >
                  <div className="aspect-video overflow-hidden bg-[var(--surface)]">
                    {p.images[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="text-[var(--text-muted)] text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <Badge variant={STATUS_VARIANTS[p.project_status]} className="mb-2">{STATUS_LABELS[p.project_status]}</Badge>
                    <h3 className="font-display font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">{p.title}</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1 flex items-center gap-1">
                      <FiMapPin className="h-3.5 w-3.5" /> {p.location}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-[var(--primary)]">
                      View Project <FiArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <CTASection />
    </>
  )
}
