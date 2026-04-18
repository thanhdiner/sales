import { CustomPrevArrow, CustomNextArrow } from '../../CustomArrow'

export function getSliderSettings(isDraggingRef, sliderWrapRef) {
  return {
    cssEase: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    swipeToSlide: true,
    touchThreshold: 8,
    useTransform: true,
    initialSlide: 0,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    beforeChange: () => {
      isDraggingRef.current = true
      sliderWrapRef.current?.classList.add('is-dragging')
    },
    afterChange: () => {
      isDraggingRef.current = false
      sliderWrapRef.current?.classList.remove('is-dragging')
    },
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  }
}
