import { cn } from '@/lib/utils'

interface MultiOwnerBadgeProps {
  count: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MultiOwnerBadge({ count, size = 'md', className }: MultiOwnerBadgeProps) {
  if (count < 2) return null

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0 h-4',
    md: 'text-xs px-2 py-0.5 h-5',
    lg: 'text-sm px-3 py-1 h-7',
  }

  const bgClass = count >= 5
    ? 'bg-red-600'
    : count >= 3
    ? 'bg-orange-500'
    : 'bg-yellow-500'

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-bold text-white',
        sizeClasses[size],
        bgClass,
        className
      )}
    >
      {count}채 보유
    </span>
  )
}
