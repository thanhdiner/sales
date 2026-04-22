import { Link } from 'react-router-dom'
import FlashSale from './FlashSale'
import Countdown from './FlashSale/CountDown'
import { useFlashSale } from './FlashSale/useFlashSale'
import './FlashSaleSession.scss'

function FlashSaleSession() {
  const { products, endAt, discountPercent, flashSaleId, loading } = useFlashSale()

  if (!loading && products.length < 5) return null

  return (
    <section className="home__flash-sale">
      <div className="home__flash-sale__header">
        <div className="home__flash-sale__title-wrap">
          <h2 className="home__flash-sale__title">Flash Sale</h2>
          {endAt && <Countdown endTime={endAt} />}
        </div>

        <Link to="/flash-sale" className="home__flash-sale__view-all">
          Xem tất cả
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

export default FlashSaleSession