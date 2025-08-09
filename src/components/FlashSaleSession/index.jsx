import { Link } from 'react-router-dom'
import FlashSale from './FlashSale'
import './FlashSaleSession.scss'

function FlashSaleSession() {
  return (
    <section className="home__flash-sale">
      <div className="home__flash-sale__header dark:bg-gray-800">
        <div className="home__flash-sale__title-group">
          <div className="home__flash-sale__badge">⚡ FLASH SALE</div>
          <h2 className="home__heading2">
            <span className="home__heading2__gradient">Flash Sale</span>
            <span className="home__heading2__accent dark:text-gray-400">hàng ngày</span>
          </h2>
          <p className="home__flash-sale__subtitle">Deal chớp nhoáng, giá sốc mỗi ngày!</p>
        </div>
        <Link to="/flash-sale" className="home__flash-sale__view-all">
          <span>Xem tất cả</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
          </svg>
        </Link>
      </div>

      <div className="home__flash-sale__content dark:bg-gray-800">
        <div className="home__flash-sale__decoration">
          <div className="floating-elements">
            <div className="floating-circle circle-1"></div>
            <div className="floating-circle circle-2"></div>
            <div className="floating-circle circle-3"></div>
          </div>
        </div>
        <FlashSale />
      </div>
    </section>
  )
}

export default FlashSaleSession
