import { useEffect, useRef } from 'react'
import { motion, useAnimationControls, useInView, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import ClientBreadcrumb from '@/components/client/Breadcrumb'
import ProductsList from '@/components/client/Products'
import SEO from '@/components/shared/SEO'

const productsSectionMotion = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.99
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

function ReplayProductsSection({ children }) {
  const ref = useRef(null)
  const controls = useAnimationControls()
  const reduceMotion = useReducedMotion()
  const isInView = useInView(ref, {
    amount: 0.08,
    margin: '-70px 0px -70px 0px'
  })

  useEffect(() => {
    if (reduceMotion) {
      controls.set('visible')
      return
    }

    controls.start(isInView ? 'visible' : 'hidden')
  }, [controls, isInView, reduceMotion])

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? 'visible' : 'hidden'}
      animate={controls}
      variants={productsSectionMotion}
      style={{ transformOrigin: 'center top', willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

function Products() {
  const { t } = useTranslation('clientProducts')

  return (
    <div className="rounded-tl-[8px] rounded-tr-[8px] bg-white pt-5 shadow dark:bg-gray-800">
      <SEO title={t('productsPage.seo.title')} description={t('productsPage.seo.description')} />

      <ReplayProductsSection>
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
      </ReplayProductsSection>
    </div>
  )
}

export default Products
