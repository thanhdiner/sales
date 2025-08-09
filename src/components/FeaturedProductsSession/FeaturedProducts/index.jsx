import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './FeaturedProducts.scss'
import { CustomPrevArrow, CustomNextArrow } from '../../CustomArrow'
import { useState, useEffect } from 'react'
import ProductItem from '../../Products/ProductItem'
import { getProducts } from '@/services/productService'

function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true)
      const result = await getProducts({ isFeatured: true })
      setProducts(result.data)
      setLoading(false)
    }
    fetchApi()
  }, [])

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

  const settings = {
    cssEase: 'linear',
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    swipeToSlide: true,
    initialSlide: 0,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    beforeChange: () => setIsDragging(true),
    afterChange: () => setIsDragging(false),
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  }

  return (
    <Slider className="product-slider-featured" {...settings}>
      {products?.map(product => (
        <ProductItem product={product} isDragging={isDragging} key={product._id} />
      ))}
    </Slider>
  )
}

export default FeaturedProducts
