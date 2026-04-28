import { Skeleton } from 'antd'

export default function AdminNotificationSkeleton() {
  return (
    <div className="space-y-1">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="border-b border-[var(--admin-border)] px-4 py-3 last:border-b-0">
          <Skeleton active avatar paragraph={{ rows: 2 }} title={{ width: '70%' }} />
        </div>
      ))}
    </div>
  )
}
