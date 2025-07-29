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

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getProducts({ isFeatured: true })
      setProducts(result)
    }
    fetchApi()
  }, [])

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
    afterChange: () => setIsDragging(false)
  }

  return (
    <Slider className="group product-slider-top-deal" {...settings}>
      {products?.map(product => (
        <ProductItem product={product} isDragging={isDragging} key={product._id} />
      ))}
    </Slider>
  )
}

export default FeaturedProducts
