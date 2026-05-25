import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import FlashSale from './FlashSale'
import Countdown from './FlashSale/CountDown'
import { useFlashSale } from './FlashSale/useFlashSale'
import './FlashSaleSection.scss'

function FlashSaleSection() {
  const { t } = useTranslation('clientHome')
  const { products, endAt, discountPercent, flashSaleId, loading } = useFlashSale()

  if (!loading && products.length === 0) return null

  return (
    <section className="home__flash-sale">
      <div className="home__flash-sale__header">
        <div className="home__flash-sale__title-wrap">
          <h2 className="home__flash-sale__title">
            <svg width="140" height="58" viewBox="0 0 140 58" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <text x="4" y="36" fontFamily="Comic Sans MS, Segoe Print, cursive" fontSize="25" fontWeight="800" fill="#071B4D">
                Flash Sale
              </text>
              <path d="M5 43C34 46 71 43 118 44" stroke="#FFD38A" strokeWidth="7" strokeLinecap="round" opacity="0.45" />
              <path d="M6 44C38 46 78 44 126 45" stroke="#071B4D" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
            </svg>
            <span>{t('flashSaleSection.title')}</span>
          </h2>
          {endAt && <Countdown endTime={endAt} />}
        </div>

        <Link to="/flash-sale" className="home__flash-sale__view-all">
          {t('flashSaleSection.viewAll')}
        </Link>
      </div>

      <div className="home__flash-sale__content">
        <FlashSale
          products={products}
          discountPercent={discountPercent}
          flashSaleId={flashSaleId}
          loading={loading}
        />
      </div>
    </section>
  )
}

export default FlashSaleSection
