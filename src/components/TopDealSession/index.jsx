import { Link } from 'react-router-dom'
import TopDeal from './TopDeal'
import './TopDealSession.scss'

function TopDealSession() {
  return (
    <>
      <section className="home__top-deal">
        <div className="home__top-deal__header">
          <div className="home__top-deal__title-group">
            <div className="home__top-deal__badge">🔥 HOT DEALS</div>
            <h2 className="home__heading2">
              <span className="home__heading2__gradient">Top Deal</span>
              <span className="home__heading2__accent">của tuần</span>
            </h2>
            <p className="home__top-deal__subtitle">Những ưu đãi không thể bỏ lỡ</p>
          </div>
          <Link to="/products?type=isTopDeal" className="home__top-deal__view-all">
            <span>Xem tất cả</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
            </svg>
          </Link>
        </div>

        <div className="home__top-deal__content">
          <div className="home__top-deal__decoration">
            <div className="floating-elements">
              <div className="floating-circle circle-1"></div>
              <div className="floating-circle circle-2"></div>
              <div className="floating-circle circle-3"></div>
            </div>
          </div>
          <TopDeal />
        </div>
      </section>
    </>
  )
}

export default TopDealSession
