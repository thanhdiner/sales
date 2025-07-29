import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './HeroBanner.scss'
import { CustomNextArrow, CustomPrevArrow } from '../CustomArrow'
import { Link } from 'react-router-dom'

const banners = [
  {
    img: 'https://images.pexels.com/photos/847371/pexels-photo-847371.jpeg',
    title: 'Tech Sale Up to 50%',
    link: '/promotion/tech-sale'
  },
  {
    img: 'https://images.pexels.com/photos/440320/pexels-photo-440320.jpeg',
    title: 'Beauty Festival',
    link: '/promotion/beauty'
  },
  {
    img: 'https://images.pexels.com/photos/601168/pexels-photo-601168.jpeg',
    title: 'Fashion Week',
    link: '/promotion/fashion'
  }
]

export default function HeroBanner() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'cubic-bezier(0.87, 0, 0.13, 1)',
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    dotsClass: 'slick-dots custom-dots'
  }

  return (
    <div className="HeroBanner-root group">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div key={index} className="HeroBanner-banner">
            <Link to={banner.link} className="block">
              <img src={banner.img} alt={banner.title} className="HeroBanner-img" />
              <div className="HeroBanner-overlay" />
              <div className="HeroBanner-title-wrap">
                <h3 className="HeroBanner-title">{banner.title}</h3>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  )
}
