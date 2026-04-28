import { useTranslation } from 'react-i18next'
import Products from '@/components/Products'
import SEO from '@/components/SEO'

function ProductsPages() {
  const { t } = useTranslation('clientProducts')

  return (
    <div className="rounded-tl-[8px] rounded-tr-[8px] bg-white pt-5 shadow dark:bg-gray-800">
      <SEO title={t('productsPage.seo.title')} description={t('productsPage.seo.description')} />

      <div className="pb-10 dark:bg-gray-800">
        <Products />
      </div>
    </div>
  )
}

export default ProductsPages
