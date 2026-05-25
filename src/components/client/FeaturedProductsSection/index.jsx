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
          <h2 className="home__featured-products__title">
            <svg width="350" height="82" viewBox="0 0 350 82" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M61 50C101 46 156 52 216 48C254 45.5 286 48 316 50"
                stroke="#FFD166"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.42"
              />
              <path
                d="M41 16L44 27L55 30L44 33L41 44L38 33L27 30L38 27L41 16Z"
                fill="#1677FF"
              />
              <path
                d="M56 14L57.5 18.5L62 20L57.5 21.5L56 26L54.5 21.5L50 20L54.5 18.5L56 14Z"
                fill="#8EC5FF"
              />
              <text
                x="68"
                y="45"
                fontFamily="Comic Sans MS, Segoe Print, cursive"
                fontSize="26"
                fontWeight="800"
                fill="#071B4D"
                transform="rotate(-1 68 45)"
              >
                Featured products
              </text>
              <path
                d="M70 55C118 58 178 54 236 55.5C262 56.2 288 55 312 54"
                stroke="#1677FF"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.45"
              />
            </svg>
            <span>{t('featuredProductsSection.title')}</span>
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