import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import './TopDeal.scss'
import { useQuery } from '@tanstack/react-query'
import ProductItem from '../../Products/ProductItem'
import { getProducts } from '@/services/productService'

function TopDeal() {
  const { data: products = [], isLoading: loading } = useQuery({
    queryKey: ['products', { isTopDeal: true }],
    queryFn: async () => {
      const result = await getProducts({ isTopDeal: true })
      return result.data
    },
    staleTime: 5 * 60 * 1000 // Cache 5 phút
  })

  const skeletonCards = Array(5).fill(0)
  if (loading)
    return (
      <div className="product-slider-flash-sale-skeleton">
        {skeletonCards.map((_, idx) => (
          <div className="flash-sale-skeleton-card" key={idx}>
            <div className="skeleton-img" />
            <div className="skeleton-line short" />
            <div className="skeleton-line long" />
          </div>
        ))}
      </div>
    )
  if (products.length < 5) return null

  return (
    <div className="product-slider-top-deal swiper-custom-navigation">
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
        {products?.map(product => (
          <SwiperSlide key={product._id}>
            <ProductItem product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default TopDeal
