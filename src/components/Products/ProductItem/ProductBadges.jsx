import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faFire } from '@fortawesome/free-solid-svg-icons'

const baseClass = 'text-white text-xs px-3 py-1 rounded-full shadow pointer-events-none select-none ml-2 mb-1'

export default function ProductBadges({ product }) {
  const badges = [
    product.stock === 0 && {
      key: 'soldout',
      text: 'Hết hàng',
      className: `bg-red-500 font-medium ${baseClass}`
    },
    product.stock > 0 &&
      product.stock <= 5 && {
        key: 'stock',
        text: `Chỉ còn ${product.stock}`,
        className: `bg-orange-500 font-medium ${baseClass}`
      },
    product.isTopDeal && {
      key: 'hotdeal',
      text: 'Hot Deal',
      icon: faFire,
      iconClassName: 'text-yellow-200',
      className: `bg-gradient-to-r from-orange-500 to-pink-500 font-semibold flex items-center ${baseClass}`
    },
    product.isFeatured && {
      key: 'featured',
      text: 'Nổi bật',
      icon: faStar,
      iconClassName: 'text-yellow-300',
      className: `bg-gradient-to-r from-pink-500 to-red-400 font-semibold flex items-center ${baseClass}`
    }
  ].filter(Boolean)

  if (!badges.length) return null

  return (
    <div className="absolute top-2 right-2 flex flex-col items-end z-30">
      {badges.map(({ key, text, icon, iconClassName, className }) => (
        <div key={key} className={className}>
          {icon && <FontAwesomeIcon icon={icon} className={`mr-1 ${iconClassName}`} />}
          {text}
        </div>
      ))}
    </div>
  )
}
