import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import './FeaturedProducts.scss'
import { useQuery } from '@tanstack/react-query'
import ProductItem from '../../Products/ProductItem'
import SliderSkeleton from '../../../shared/LazyLoad/SliderSkeleton'
import { getProducts } from '@/services/client/commerce/product'
import useCurrentLanguage from '@/hooks/shared/useCurrentLanguage'

const HOME_SLIDER_PRODUCT_LIMIT = 12

function FeaturedProducts() {
  const language = useCurrentLanguage()
  const { data: products = [], isPending } = useQuery({
    queryKey: ['products', language, { isFeatured: true }],
    queryFn: async () => {
      const result = await getProducts({ isFeatured: true })
      return result.data
    },
    placeholderData: previousData => previousData,
    staleTime: 5 * 60 * 1000 // Cache 5 phút
  })
  const visibleProducts = products.slice(0, HOME_SLIDER_PRODUCT_LIMIT)
  const loading = isPending && visibleProducts.length === 0
  const canLoop = visibleProducts.length > 5

  if (loading) return <SliderSkeleton />
  if (visibleProducts.length < 5) return null

  return (
    <div className="product-slider-featured swiper-custom-navigation">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={18}
        slidesPerView={5}
        navigation={canLoop}
        loop={canLoop}
        autoplay={canLoop ? { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
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
          0:    { slidesPerView: 2.15, spaceBetween: 8 },
          390:  { slidesPerView: 2, spaceBetween: 8 },
          576:  { slidesPerView: 3, spaceBetween: 12 },
          768:  { slidesPerView: 3, spaceBetween: 14 },
          992:  { slidesPerView: 4, spaceBetween: 16 },
          1200: { slidesPerView: 5, spaceBetween: 18 },
        }}
      >
        {visibleProducts.map(product => (
          <SwiperSlide key={product._id}>
            <ProductItem product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default FeaturedProducts
