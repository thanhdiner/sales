import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import './FlashSale.scss'
import ProductItem from '../../Products/ProductItem'
import Countdown from './CountDown'
import { useFlashSale } from './useFlashSale'
import FlashSaleSkeleton from './FlashSaleSkeleton'
import { mapFlashSaleProducts } from './flashSaleHelpers'

function FlashSale() {
  const { products, endAt, discountPercent, flashSaleId, loading } = useFlashSale()

  if (loading) return <FlashSaleSkeleton />
  if (products.length < 5) return null

  const productsWithDiscount = mapFlashSaleProducts(products, discountPercent, flashSaleId)

  return (
    <>
      <div className="home__flash-sale__countdown">
        <span>Kết thúc sau:</span>
        <Countdown endTime={endAt} />
      </div>
      <div className="product-slider-flash-sale swiper-custom-navigation">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={18}
          slidesPerView={5}
          navigation
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          speed={500}
          grabCursor
          touchRatio={1}
          touchReleaseOnEdges
          cssMode={false}
          breakpoints={{
            0:    { slidesPerView: 1, spaceBetween: 10 },
            480:  { slidesPerView: 2, spaceBetween: 12 },
            768:  { slidesPerView: 3, spaceBetween: 14 },
            992:  { slidesPerView: 4, spaceBetween: 16 },
            1200: { slidesPerView: 5, spaceBetween: 18 },
          }}
        >
          {productsWithDiscount.map(product => (
            <SwiperSlide key={product._id}>
              <ProductItem
                product={product}
                isFlashSale
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  )
}

export default FlashSale
