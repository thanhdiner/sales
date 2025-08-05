import React, { useState, useEffect } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './FlashSale.scss'
import { CustomPrevArrow, CustomNextArrow } from '../../CustomArrow'
import ProductItem from '../../Products/ProductItem'
import Countdown from './CountDown'
import { getClientFlashSales } from '@/services/flashSaleService'

function FlashSale() {
  const [products, setProducts] = useState([])
  const [endAt, setEndAt] = useState(null)
  const [discountPercent, setDiscountPercent] = useState(null)
  const [flashSaleId, setFlashSaleId] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true)
      const res = await getClientFlashSales({ status: 'active', limit: 1 })
      if (res.flashSales && res.flashSales[0]) {
        setEndAt(res.flashSales[0].endAt)
        setDiscountPercent(res.flashSales[0].discountPercent)
        setProducts(res.flashSales[0].products)
        setFlashSaleId(res.flashSales[0]._id)
      }
      setLoading(false)
    }
    fetchApi()
  }, [])

  const skeletonCards = Array(5).fill(0)

  if (loading)
    return (
      <>
        <div className="home__flash-sale__countdown">
          <span>Kết thúc sau:</span>
          <span className="countdown-timer skeleton-timer"></span>
        </div>
        <div className="product-slider-flash-sale-skeleton">
          {skeletonCards.map((_, idx) => (
            <div className="flash-sale-skeleton-card" key={idx}>
              <div className="skeleton-img" />
              <div className="skeleton-line short" />
              <div className="skeleton-line long" />
            </div>
          ))}
        </div>
      </>
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
    afterChange: () => setIsDragging(false)
  }

  // Thêm salePrice và savings cho từng product
  const productsWithDiscount = products.map(product => {
    const salePrice = product.price && discountPercent ? Math.round(product.price * (1 - discountPercent / 100)) : product.price
    const savings = product.price && discountPercent ? product.price - salePrice : 0
    return {
      ...product,
      salePrice,
      savings,
      discountPercent,
      isFlashSale: true,
      flashSaleId
    }
  })

  return (
    <>
      <div className="home__flash-sale__countdown">
        <span>Kết thúc sau:</span>
        <Countdown endTime={endAt} />
      </div>
      <Slider className="product-slider-flash-sale" {...settings}>
        {productsWithDiscount.map(product => (
          <ProductItem
            product={{
              ...product,
              salePrice: Math.round(product.price * (1 - discountPercent / 100)),
              discountPercent,
              isFlashSale: true,
              flashSaleId
            }}
            isDragging={isDragging}
            isFlashSale
            key={product._id}
          />
        ))}
      </Slider>
    </>
  )
}

export default FlashSale
