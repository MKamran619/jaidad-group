import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface SectionHeaderProps {
  label?: string
  title: string
  highlightedWord?: string
  description?: string
  align?: 'left' | 'center' | 'right'
  className?: string
}

export function SectionHeader({
  label,
  title,
  highlightedWord,
  description,
  align = 'center',
  className,
}: SectionHeaderProps) {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align]

  const renderTitle = () => {
    if (!highlightedWord) return title
    const parts = title.split(highlightedWord)
    return (
      <>
        {parts[0]}
        <span className="gradient-text">{highlightedWord}</span>
        {parts[1]}
      </>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn('flex flex-col gap-3 mb-12', alignClass, className)}
    >
      {label && (
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
          <span className="h-px w-8 bg-[var(--primary)]" />
          {label}
          <span className="h-px w-8 bg-[var(--primary)]" />
        </span>
      )}
      <h2 className="font-display text-3xl font-bold leading-tight md:text-4xl lg:text-5xl text-[var(--text)]">
        {renderTitle()}
      </h2>
      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-[var(--text-muted)]">
          {description}
        </p>
      )}
    </motion.div>
  )
}
