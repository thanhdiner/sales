import { motion } from 'framer-motion'

const skeletonItems = Array.from({ length: 3 }, (_, index) => index)

const loadingContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const loadingItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: 'easeOut' }
  }
}

const CouponsLoadingState = () => (
  <motion.section
    className="coupon-list coupon-list--loading"
    aria-label="Loading coupons"
    initial="hidden"
    animate="visible"
    variants={loadingContainerVariants}
  >
    {skeletonItems.map(item => (
      <motion.article className="coupon-ticket coupon-ticket--skeleton" key={item} variants={loadingItemVariants}>
        <section className="coupon-ticket__discount coupon-ticket__discount--skeleton">
          <span className="coupon-skeleton coupon-skeleton--icon" />
          <span className="coupon-skeleton coupon-skeleton--value" />
          <span className="coupon-skeleton coupon-skeleton--short" />
        </section>

        <section className="coupon-ticket__body">
          <div className="coupon-ticket__main">
            <div className="coupon-ticket__title-row">
              <span className="coupon-skeleton coupon-skeleton--label" />
              <span className="coupon-skeleton coupon-skeleton--title" />
              <span className="coupon-skeleton coupon-skeleton--pill" />
            </div>

            <span className="coupon-skeleton coupon-skeleton--line" />
            <span className="coupon-skeleton coupon-skeleton--line coupon-skeleton--line-short" />

            <div className="coupon-ticket__code-box coupon-ticket__code-box--skeleton">
              <span className="coupon-skeleton coupon-skeleton--label" />
              <span className="coupon-skeleton coupon-skeleton--code" />
              <span className="coupon-skeleton coupon-skeleton--button" />
            </div>
          </div>

          <div className="coupon-ticket__meta">
            <span className="coupon-skeleton coupon-skeleton--meta" />
            <span className="coupon-skeleton coupon-skeleton--meta coupon-skeleton--meta-short" />
          </div>

          <div className="coupon-ticket__actions">
            <span className="coupon-skeleton coupon-skeleton--time" />
            <span className="coupon-skeleton coupon-skeleton--cta" />
          </div>
        </section>
      </motion.article>
    ))}
  </motion.section>
)

export default CouponsLoadingState
