import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function ClientBreadcrumb({ items, label = 'Breadcrumb', className = '' }) {
  const visibleItems = (items || []).filter(Boolean)

  return (
    <nav className={`flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 ${className}`.trim()} aria-label={label}>
      {visibleItems.map((item, index) => {
        const isLast = index === visibleItems.length - 1
        const Icon = item.icon || (index === 0 ? Home : null)
        const content = (
          <>
            {Icon ? <Icon size={15} /> : null}
            <span>{item.label}</span>
          </>
        )

        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
            {item.to && !isLast ? (
              <Link to={item.to} className="inline-flex items-center gap-1.5 transition-colors hover:text-gray-900 dark:hover:text-gray-100">
                {content}
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-medium text-gray-900 dark:text-gray-100">{content}</span>
            )}

            {!isLast ? <ChevronRight size={15} className="text-gray-400 dark:text-gray-500" /> : null}
          </span>
        )
      })}
    </nav>
  )
}
