import React, { useEffect, useState, useRef } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './HeroBanner.scss'
import { CustomNextArrow, CustomPrevArrow } from '../CustomArrow'
import { getActiveBanners } from '@/services/bannersService'

function BannerSkeleton() {
  return (
    <div className="HeroBanner-root skeleton-root">
      <div className="skeleton-banner" />
    </div>
  )
}

export default function HeroBanner() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState(false)
  const dragStartX = useRef(0)
  const dragThreshold = 10

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await getActiveBanners()
        setBanners(res.data || [])
      } catch (err) {
        console.error('Failed to fetch banners', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true,
    draggable: true,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'cubic-bezier(0.87, 0, 0.13, 1)',
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    dotsClass: 'slick-dots custom-dots'
  }

  if (loading) {
    return <BannerSkeleton />
  }

  if (!banners.length) {
    return <div className="HeroBanner-root">Chưa có banner nào</div>
  }

  return (
    <div className="HeroBanner-root group">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div
            key={banner._id || index}
            className="HeroBanner-banner cursor-pointer"
            style={{ cursor: 'pointer' }}
            onMouseDown={e => {
              setDragging(false)
              dragStartX.current = e.clientX
            }}
            onMouseMove={e => {
              if (Math.abs(e.clientX - dragStartX.current) > dragThreshold) {
                setDragging(true)
              }
            }}
            onMouseUp={e => {}}
            onClick={e => {
              if (dragging) {
                e.preventDefault()
                e.stopPropagation()
                return
              }
              if (banner.link) window.open(banner.link, '_blank')
            }}
          >
            <img
              src={banner.img}
              alt={banner.title}
              className="HeroBanner-img"
              draggable={false}
              style={{ userSelect: 'none', WebkitUserDrag: 'none' }}
            />
            <div className="HeroBanner-overlay" />
            <div className="HeroBanner-title-wrap">
              <h3 className="HeroBanner-title">{banner.title}</h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}
