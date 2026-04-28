import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import './FeaturedProducts.scss'
import { useQuery } from '@tanstack/react-query'
import ProductItem from '../../Products/ProductItem'
import SliderSkeleton from '../../LazyLoad/SliderSkeleton'
import { getProducts } from '@/services/clientProductService'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'

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
  const loading = isPending && products.length === 0

  if (loading) return <SliderSkeleton />
  if (products.length < 5) return null

  return (
    <div className="product-slider-featured swiper-custom-navigation">
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
          0:    { slidesPerView: 2.15, spaceBetween: 8 },
          390:  { slidesPerView: 2, spaceBetween: 8 },
          576:  { slidesPerView: 3, spaceBetween: 12 },
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

export default FeaturedProducts
