import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function ProductBreadcrumbSection({ product }) {
  const { t } = useTranslation('clientProducts')
  const category = product?.productCategory

  const items = [
    { label: t('productDetail.breadcrumb.home'), to: '/', icon: Home },
    { label: t('productDetail.breadcrumb.products'), to: '/products' },
    category?.title && {
      label: category.title,
      to: category.slug ? `/product-categories/${category.slug}` : undefined
    },
    { label: product?.title }
  ].filter(Boolean)

  return (
    <nav className="product-detail-breadcrumb" aria-label={t('productDetail.breadcrumb.label')}>
      {items.map((item, index) => {
        const Icon = item.icon
        const isLast = index === items.length - 1
        const content = (
          <>
            {Icon && <Icon size={15} />}
            <span>{item.label}</span>
          </>
        )

        return (
          <span className="product-detail-breadcrumb__item-wrap" key={`${item.label}-${index}`}>
            {item.to && !isLast ? (
              <Link className="product-detail-breadcrumb__link" to={item.to}>
                {content}
              </Link>
            ) : (
              <span className="product-detail-breadcrumb__current">{content}</span>
            )}

            {!isLast && <ChevronRight className="product-detail-breadcrumb__separator" size={15} />}
          </span>
        )
      })}
    </nav>
  )
}

export default ProductBreadcrumbSection
