import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
          {label}
          {props.required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[100px] w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)] transition-all duration-200 resize-y',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'

export { Textarea }
