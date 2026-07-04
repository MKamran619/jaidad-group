import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        primary:
          'btn-shine bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-[0_10px_40px_var(--shadow-color)] hover:shadow-[0_20px_50px_var(--shadow-color)] hover:-translate-y-0.5 active:translate-y-0',
        secondary:
          'btn-shine bg-[var(--color-brand-black)] text-white hover:bg-[var(--color-brand-charcoal)] shadow-lg hover:shadow-xl hover:-translate-y-0.5',
        outline:
          'btn-shine border-2 border-[var(--primary)] text-[var(--primary)] bg-transparent backdrop-blur-sm hover:bg-[var(--surface)] hover:border-[var(--primary-light)] hover:text-[var(--primary-light)] hover:-translate-y-0.5',
        ghost:
          'text-[var(--text)] hover:bg-[var(--surface)] hover:text-[var(--text)]',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 shadow-lg',
        link:
          'text-[var(--primary)] underline-offset-4 hover:underline p-0 h-auto',
        glass:
          'glass text-white hover:bg-white/20 border-white/20',
      },
      size: {
        xs: 'h-7 px-3 text-xs rounded-lg',
        sm: 'h-8 px-4 text-xs',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
        'icon-lg': 'h-12 w-12 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

// Convenience component for link-styled buttons
export { Button, buttonVariants }
export type { ButtonProps }
