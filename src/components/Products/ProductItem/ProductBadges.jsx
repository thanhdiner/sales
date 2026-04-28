import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faFire } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

const baseClass =
  'pointer-events-none inline-flex select-none items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium leading-4 shadow-sm backdrop-blur sm:px-2.5 sm:text-[11px]'

export default function ProductBadges({ product }) {
  const { t } = useTranslation('clientProducts')

  const badges = [
    product.isTopDeal && {
      key: 'hotdeal',
      text: t('productItem.hotDeal'),
      icon: faFire,
      iconClassName: 'text-orange-500',
      className: `border-orange-200/80 bg-orange-50/90 text-orange-700 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-200 ${baseClass}`
    },
    product.isFeatured && {
      key: 'featured',
      text: t('productItem.featured'),
      icon: faStar,
      iconClassName: 'text-slate-400 dark:text-slate-300',
      className: `border-slate-200/80 bg-white/90 text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 ${baseClass}`
    }
  ].filter(Boolean)

  if (!badges.length) return null

  return (
    <div className="absolute inset-x-2 bottom-2 z-20 flex flex-wrap items-center gap-1.5 sm:inset-x-3 sm:bottom-3">
      {badges.map(({ key, text, icon, iconClassName, className }) => (
        <div key={key} className={className}>
          {icon && <FontAwesomeIcon icon={icon} className={`h-3 w-3 ${iconClassName}`} />}
          {text}
        </div>
      ))}
    </div>
  )
}
