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
          <h2 className="home__flash-sale__title">{t('flashSaleSection.title')}</h2>
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
