import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import FeaturedProducts from './FeaturedProducts'
import './FeaturedProductsSession.scss'

function FeaturedProductsSession() {
  const { t } = useTranslation('clientHome')

  return (
    <section className="home__featured-products">
      <div className="home__featured-products__header">
        <div className="home__featured-products__title-wrap">
          <span className="home__featured-products__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17l-6 3.4 1.3-6.7-5-4.7 6.8-.8L12 2z" />
            </svg>
          </span>

          <h2 className="home__featured-products__title">
            {t('featuredProductsSection.title')}
          </h2>
      </div>

        <Link to="/products?type=isFeatured" className="home__featured-products__view-all">
          {t('featuredProductsSection.viewAll')}
        </Link>
      </div>

      <div className="home__featured-products__content">
        <FeaturedProducts />
      </div>
    </section>
  )
}

export default FeaturedProductsSession