import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './TopDeal.scss'
import { CustomPrevArrow, CustomNextArrow } from '../CustomArrow'
import { useState, useEffect } from 'react'
import ProductItem from '../Products/ProductItem'
import { getProducts } from '../../services/productService'

function TopDeal() {
  const [products, setProducts] = useState([])
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getProducts()
      setProducts(result.reverse())
    }
    fetchApi()
  }, [])

  const settings = {
    cssEase: 'linear',
    infinite: false,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true,
    initialSlide: 0,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    beforeChange: () => setIsDragging(true),
    afterChange: () => setIsDragging(false)
  }

  return (
    <>
      <Slider {...settings}>
        {products?.map(product => (
          <ProductItem product={product} isDragging={isDragging} key={product.id} />
        ))}
      </Slider>
    </>
  )
}

export default TopDeal
