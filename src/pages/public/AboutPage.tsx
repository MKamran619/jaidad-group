import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { FiTarget, FiEye } from 'react-icons/fi'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatsSection } from '@/features/home/StatsSection'
import { TestimonialsSection } from '@/features/home/TestimonialsSection'
import { CTASection } from '@/features/home/CTASection'
import { useSettings } from '@/hooks/useSettings'

interface TeamMember {
  name: string
  role: string
  image: string
  bio?: string
}

interface Milestone {
  year: string
  event: string
}

export function AboutPage() {
  const { data: settings, isLoading } = useSettings()

  const heroImage   = settings?.['about_hero_image']   as string | undefined
  const officeImage = settings?.['about_office_image'] as string | undefined
  const mission     = settings?.['about_mission']      as string | undefined
  const vision      = settings?.['about_vision']       as string | undefined
  const story1      = settings?.['about_story_1']      as string | undefined
  const story2      = settings?.['about_story_2']      as string | undefined

  const team:       TeamMember[] = (settings?.['team_members'] as TeamMember[] | undefined) ?? []
  const milestones: Milestone[]  = (settings?.['milestones']   as Milestone[]  | undefined) ?? []

  return (
    <>
      <Helmet>
        <title>About Us – J+ Jaidad Group</title>
        <meta name="description" content="Learn about J+ Jaidad Group's legacy in Pakistan's real estate market." />
      </Helmet>

      {/* Hero */}
      <div className="relative bg-[var(--color-brand-black)] py-24 overflow-hidden">
        {heroImage && (
          <div className="absolute inset-0 opacity-30">
            <img src={heroImage} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}
        <div className="container relative mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">Our Story</p>
            <h1 className="font-display text-4xl md:text-6xl font-black text-white mb-5">
              About <span className="gradient-text">J+ Jaidad Group</span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Years of excellence, trust, and innovation in Pakistan's real estate landscape
            </p>
          </motion.div>
        </div>
      </div>

      {/* Story */}
      {(officeImage || story1 || story2 || mission || vision) && (
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                {officeImage ? (
                  <img
                    src={officeImage}
                    alt="Our Office"
                    className="rounded-2xl shadow-2xl w-full object-cover h-96"
                  />
                ) : (
                  <div className="rounded-2xl w-full h-96 bg-[var(--surface)] border border-[var(--border)]" />
                )}
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
                  <span className="h-px w-8 bg-[var(--primary)]" />
                  Our Journey
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text)]">
                  Building Pakistan's Most Trusted Real Estate Group
                </h2>
                {story1 && <p className="text-[var(--text-muted)] leading-relaxed">{story1}</p>}
                {story2 && <p className="text-[var(--text-muted)] leading-relaxed">{story2}</p>}
                {(mission || vision) && (
                  <div className="grid grid-cols-2 gap-4">
                    {mission && (
                      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                        <FiTarget className="h-5 w-5 text-[var(--primary)] mb-2" />
                        <p className="font-semibold text-[var(--text)] text-sm mb-1">Our Mission</p>
                        <p className="text-xs text-[var(--text-muted)]">{mission}</p>
                      </div>
                    )}
                    {vision && (
                      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                        <FiEye className="h-5 w-5 text-[var(--primary)] mb-2" />
                        <p className="font-semibold text-[var(--text)] text-sm mb-1">Our Vision</p>
                        <p className="text-xs text-[var(--text-muted)]">{vision}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      <StatsSection />

      {/* Timeline */}
      {milestones.length > 0 && (
        <section className="section-padding bg-[var(--surface)]">
          <div className="container mx-auto px-4">
            <SectionHeader label="Our History" title="Company" highlightedWord="Milestones" />
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-[var(--border)]" />
              <div className="space-y-8">
                {milestones.map((m, i) => (
                  <motion.div
                    key={m.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative flex gap-6 pl-14"
                  >
                    <div className="absolute left-3 top-1.5 h-6 w-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    <div>
                      <span className="font-display text-lg font-black text-[var(--primary)]">{m.year}</span>
                      <p className="text-[var(--text)] font-medium mt-0.5">{m.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {(isLoading || team.length > 0) && (
        <section className="section-padding">
          <div className="container mx-auto px-4">
            <SectionHeader label="Leadership" title="Meet Our" highlightedWord="Expert Team" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-2xl aspect-square shimmer bg-[var(--surface)]" />
                  ))
                : team.map((member, i) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="text-center group"
                    >
                      <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square bg-[var(--surface)]">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full bg-[var(--primary)] flex items-center justify-center text-white text-3xl font-black">
                            {member.name[0]}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="font-display font-bold text-[var(--text)]">{member.name}</h3>
                      <p className="text-sm text-[var(--primary)]">{member.role}</p>
                    </motion.div>
                  ))}
            </div>
          </div>
        </section>
      )}

      <TestimonialsSection />
      <CTASection />
    </>
  )
}
