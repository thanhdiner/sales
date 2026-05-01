import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import './FlashSale.scss'
import ProductItem from '../../Products/ProductItem'
import FlashSaleSkeleton from './FlashSaleSkeleton'
import { mapFlashSaleProducts } from './flashSaleHelpers'

const HOME_SLIDER_PRODUCT_LIMIT = 12

function FlashSale({ products = [], discountPercent, flashSaleId, loading }) {
  if (loading) return <FlashSaleSkeleton />
  if (products.length === 0) return null

  const productsWithDiscount = mapFlashSaleProducts(
    products.slice(0, HOME_SLIDER_PRODUCT_LIMIT),
    discountPercent,
    flashSaleId
  )
  const hasMultipleProducts = productsWithDiscount.length > 1
  const canLoop = productsWithDiscount.length > 5

  return (
    <div className="product-slider-flash-sale swiper-custom-navigation">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={18}
        slidesPerView={5}
        navigation={hasMultipleProducts}
        loop={canLoop}
        autoplay={
          hasMultipleProducts
            ? {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }
            : false
        }
        speed={380}
        grabCursor
        touchRatio={1.45}
        threshold={3}
        longSwipesRatio={0.2}
        followFinger
        simulateTouch
        preventClicks
        preventClicksPropagation
        touchStartPreventDefault={false}
        touchReleaseOnEdges
        cssMode={false}
        watchSlidesProgress={false}
        observer={false}
        observeParents={false}
        breakpoints={{
          0: { slidesPerView: 2.15, spaceBetween: 8 },
          390: { slidesPerView: 2, spaceBetween: 8 },
          576: { slidesPerView: 3, spaceBetween: 12 },
          768: { slidesPerView: 3, spaceBetween: 14 },
          992: { slidesPerView: 4, spaceBetween: 16 },
          1200: { slidesPerView: 5, spaceBetween: 18 }
        }}
      >
        {productsWithDiscount.map(product => (
          <SwiperSlide key={product._id}>
            <ProductItem product={product} isFlashSale />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default FlashSale
