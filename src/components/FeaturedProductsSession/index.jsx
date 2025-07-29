import { Link } from 'react-router-dom'
import FeaturedProducts from './FeaturedProducts'
import './FeaturedProductsSession.scss'

function FeaturedProductsSession() {
  return (
    <section className="home__featured-products">
      <div className="home__featured-products__header">
        <div className="home__featured-products__title-group">
          <div className="home__featured-products__badge">🌟 NỔI BẬT</div>
          <h2 className="home__heading2">
            <span className="home__heading2__gradient">Sản phẩm</span>
            <span className="home__heading2__accent">nổi bật</span>
          </h2>
          <p className="home__featured-products__subtitle">Lựa chọn tốt nhất trong tháng</p>
        </div>
        <Link to="/products?type=isFeatured" className="home__featured-products__view-all">
          <span>Xem tất cả</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
          </svg>
        </Link>
      </div>

      <div className="home__featured-products__content">
        <div className="home__featured-products__decoration">
          <div className="floating-elements">
            <div className="floating-circle circle-1"></div>
            <div className="floating-circle circle-2"></div>
            <div className="floating-circle circle-3"></div>
          </div>
        </div>
        <FeaturedProducts />
      </div>
    </section>
  )
}

export default FeaturedProductsSession
