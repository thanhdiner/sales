import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import FeaturedProducts from './FeaturedProducts'
import './FeaturedProductsSession.scss'

function FeaturedProductsSession() {
  const viewport = { once: true, amount: 0.2 }

  return (
    <motion.section
      className="home__featured-products dark:bg-gray-800 dark:border-gray-600 dark:border-2"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      viewport={viewport}
    >
      <motion.div
        className="home__featured-products__header"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        viewport={viewport}
      >
        <motion.div
          className="home__featured-products__title-group"
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          viewport={viewport}
        >
          <div className="home__featured-products__badge">🌟 NỔI BẬT</div>
          <h2 className="home__heading2">
            <span className="home__heading2__gradient">Sản phẩm</span>
            <span className="home__heading2__accent dark:text-gray-400">nổi bật</span>
          </h2>
          <p className="home__featured-products__subtitle dark:text-gray-400">Lựa chọn tốt nhất trong tháng</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 14 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.06, ease: 'easeOut' }}
          viewport={viewport}
        >
          <Link to="/products?type=isFeatured" className="home__featured-products__view-all">
            <span className="whitespace-nowrap">Xem tất cả</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="home__featured-products__content"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
        viewport={viewport}
      >
        <div className="home__featured-products__decoration">
          <div className="floating-elements">
            <div className="floating-circle circle-1"></div>
            <div className="floating-circle circle-2"></div>
            <div className="floating-circle circle-3"></div>
          </div>
        </div>
        <FeaturedProducts />
      </motion.div>
    </motion.section>
  )
}

export default FeaturedProductsSession
