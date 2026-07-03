import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { FiChevronDown } from 'react-icons/fi'

interface SelectOption { label: string; value: string }

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'flex h-11 w-full appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 pr-10 text-sm text-[var(--color-text)] transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
