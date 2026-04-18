import { CustomNextArrow, CustomPrevArrow } from '../CustomArrow'

export function getHeroBannerSliderSettings(isMulti) {
  return {
    dots: isMulti,
    infinite: isMulti,
    speed: 800,
    slidesToShow: 2,
    slidesToScroll: 1,
    swipe: true,
    draggable: true,
    swipeToSlide: true,
    autoplay: isMulti,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    pauseOnFocus: true,
    accessibility: true,
    lazyLoad: 'ondemand',
    cssEase: 'cubic-bezier(0.87, 0, 0.13, 1)',
    prevArrow: isMulti ? <CustomPrevArrow /> : undefined,
    nextArrow: isMulti ? <CustomNextArrow /> : undefined,
    dotsClass: 'slick-dots custom-dots',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          arrows: false,
          speed: 600
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          arrows: false,
          speed: 500,
          autoplaySpeed: 4500
        }
      }
    ]
  }
}
