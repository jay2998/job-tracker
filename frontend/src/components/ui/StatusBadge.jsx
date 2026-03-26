import { cn, STATUS_CONFIG } from '@/lib/utils'

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Applied

  return (
    <span className={cn(
      'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-[0.01em]',
      config.className
    )}>
      <span className={cn('h-2 w-2 rounded-full', config.dotClassName)} />
      {config.label}
    </span>
  )
}
