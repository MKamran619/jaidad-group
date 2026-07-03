import { cn } from '@/lib/utils/cn'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('shimmer rounded-lg bg-[var(--color-surface)]', className)}
      {...props}
    />
  )
}

function PropertyCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface)]">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

function BlogCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface)]">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export { Skeleton, PropertyCardSkeleton, BlogCardSkeleton }
