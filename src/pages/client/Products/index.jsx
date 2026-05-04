import { useTranslation } from 'react-i18next'
import ClientBreadcrumb from '@/components/client/Breadcrumb'
import ProductsList from '@/components/client/Products'
import SEO from '@/components/shared/SEO'

function Products() {
  const { t } = useTranslation('clientProducts')

  return (
    <div className="rounded-tl-[8px] rounded-tr-[8px] bg-white pt-5 shadow dark:bg-gray-800">
      <SEO title={t('productsPage.seo.title')} description={t('productsPage.seo.description')} />

      <div className="px-4 pb-10 dark:bg-gray-800 md:px-6">
        <ClientBreadcrumb
          className="mb-4"
          label={t('productsPage.breadcrumb.label')}
          items={[
            { label: t('productsPage.breadcrumb.home'), to: '/' },
            { label: t('productsPage.breadcrumb.products') }
          ]}
        />

        <ProductsList />
      </div>
    </div>
  )
}

export default Products
