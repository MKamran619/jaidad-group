import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[var(--color-brand-gold)] text-white',
        secondary: 'border-transparent bg-[var(--color-surface)] text-[var(--color-text)]',
        outline: 'border-[var(--color-border)] text-[var(--color-text)]',
        success: 'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        warning: 'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        danger: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        info: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        gold: 'border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] bg-transparent',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
