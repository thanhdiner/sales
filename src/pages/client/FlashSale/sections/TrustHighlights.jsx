import { Clock, ShieldCheck, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { FLASH_SALE_CARD_VARIANTS, FLASH_SALE_STAGGER_VARIANTS, FLASH_SALE_VIEWPORT } from '../constants'

export default function TrustHighlights({ t }) {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: t('trust.official.title'),
      desc: t('trust.official.desc')
    },
    {
      icon: Zap,
      title: t('trust.fastDelivery.title'),
      desc: t('trust.fastDelivery.desc')
    },
    {
      icon: Clock,
      title: t('trust.support.title'),
      desc: t('trust.support.desc')
    }
  ]

  return (
    <motion.section
      className="flash-sale-trust"
      initial="hidden"
      whileInView="visible"
      variants={FLASH_SALE_STAGGER_VARIANTS}
      viewport={FLASH_SALE_VIEWPORT}
    >
      <motion.div className="flash-sale-trust__grid" variants={FLASH_SALE_STAGGER_VARIANTS}>
        {trustItems.map(item => {
          const Icon = item.icon

          return (
            <motion.div key={item.title} className="flash-sale-trust__item" variants={FLASH_SALE_CARD_VARIANTS}>
              <div className="flash-sale-trust__icon">
                <Icon className="flash-sale-trust__icon-svg" />
              </div>

              <div className="flash-sale-trust__copy">
                <h3 className="flash-sale-trust__title">{item.title}</h3>
                <p className="flash-sale-trust__desc">{item.desc}</p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.section>
  )
}
