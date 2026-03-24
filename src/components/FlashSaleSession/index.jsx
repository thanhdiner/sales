import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import FlashSale from './FlashSale'
import './FlashSaleSession.scss'

function FlashSaleSession() {
  const viewport = { once: true, amount: 0.2 }

  return (
    <motion.section
      className="home__flash-sale"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      viewport={viewport}
    >
      <motion.div
        className="home__flash-sale__header dark:bg-gray-800"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        viewport={viewport}
      >
        <motion.div
          className="home__flash-sale__title-group"
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          viewport={viewport}
        >
          <div className="home__flash-sale__badge">⚡ FLASH SALE</div>
          <h2 className="home__heading2">
            <span className="home__heading2__gradient">Flash Sale</span>
            <span className="home__heading2__accent dark:text-gray-400">hàng ngày</span>
          </h2>
          <p className="home__flash-sale__subtitle">Deal chớp nhoáng, giá sốc mỗi ngày!</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 14 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.06, ease: 'easeOut' }}
          viewport={viewport}
        >
          <Link to="/flash-sale" className="home__flash-sale__view-all">
            <span>Xem tất cả</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="home__flash-sale__content dark:bg-gray-800"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
        viewport={viewport}
      >
        <div className="home__flash-sale__decoration">
          <div className="floating-elements">
            <div className="floating-circle circle-1"></div>
            <div className="floating-circle circle-2"></div>
            <div className="floating-circle circle-3"></div>
          </div>
        </div>
        <FlashSale />
      </motion.div>
    </motion.section>
  )
}

export default FlashSaleSession
