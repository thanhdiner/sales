import { Link } from 'react-router-dom'
import TopDeal from './TopDeal'
import './TopDealSession.scss'

function TopDealSession() {
  return (
    <section className="home__top-deal">
      <div className="home__top-deal__header">
        <img
          src="/images/top-deal-title.png"
          alt="TOP DEAL - SIÊU RẺ"
          className="home__top-deal__title-image"
        />

        <Link to="/products?type=isTopDeal" className="home__top-deal__view-all">
          Xem tất cả
        </Link>
      </div>

      <div className="home__top-deal__content">
        <TopDeal />
      </div>
    </section>
  )
}

export default TopDealSession