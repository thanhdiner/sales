import { useTranslation } from 'react-i18next'
import ProductsList from '@/components/client/Products'
import SEO from '@/components/shared/SEO'

function Products() {
  const { t } = useTranslation('clientProducts')

  return (
    <div className="rounded-tl-[8px] rounded-tr-[8px] bg-white pt-5 shadow dark:bg-gray-800">
      <SEO title={t('productsPage.seo.title')} description={t('productsPage.seo.description')} />

      <div className="pb-10 dark:bg-gray-800">
        <ProductsList />
      </div>
    </div>
  )
}

export default Products
