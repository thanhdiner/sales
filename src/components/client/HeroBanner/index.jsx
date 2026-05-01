import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './HeroBanner.scss'
import HeroBannerItem from './HeroBannerItem'
import BannerSkeleton from './BannerSkeleton'
import { useHeroBanners } from './useHeroBanners'

export default function HeroBanner() {
  const { t } = useTranslation('clientHome')
  const { banners, loading } = useHeroBanners()

  if (loading) {
    return <BannerSkeleton />
  }

  if (!banners.length) {
    return <div className="HeroBanner-root">{t('heroBanner.empty')}</div>
  }

  const isMulti = banners.length > 1
  const viewport = { once: true, amount: 0.2 }

  return (
    <motion.div
      className="HeroBanner-root group swiper-custom-navigation"
      role="region"
      aria-label={t('heroBanner.ariaLabel')}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="HeroBanner-swiper">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          navigation={isMulti}
          pagination={isMulti ? { clickable: true, el: '.swiper-pagination-custom' } : false}
          loop={isMulti}
          autoplay={isMulti ? { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
          speed={800}
          grabCursor
          touchRatio={1}
          touchReleaseOnEdges
          cssMode={false}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10, speed: 500, autoplay: { delay: 4500 } },
            576: { slidesPerView: 2, spaceBetween: 12, speed: 600 },
            992: { slidesPerView: 2, spaceBetween: 16 }
          }}
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={banner._id || index}>
              <HeroBannerItem banner={banner} viewport={viewport} priority={index < 2} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-pagination-custom"></div>
      </div>

      <div className="HeroBanner-mobile-stack">
        {banners.slice(0, 1).map((banner, index) => (
          <HeroBannerItem key={banner._id || index} banner={banner} viewport={viewport} priority />
        ))}
      </div>
    </motion.div>
  )
}
