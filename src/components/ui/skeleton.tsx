import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-md)] bg-gradient-to-r from-[var(--color-neutral-100)] via-[var(--color-neutral-200)] to-[var(--color-neutral-100)]',
        'bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
