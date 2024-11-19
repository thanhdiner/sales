import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './TopDeal.scss'
import { Badge, Rate } from 'antd'
import { CustomPrevArrow, CustomNextArrow } from '../CustomArrow'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus } from '@fortawesome/free-solid-svg-icons'

function TopDeal() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchApi = async () => {
      fetch('http://localhost:3002/products')
        .then(res => res.json())
        .then(data => {
          setProducts(data)
        })
    }
    fetchApi()
  }, [])

  const settings = {
    cssEase: 'linear',
    infinite: false,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 1,
    swipeToSlide: true,
    initialSlide: 0,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  }

  return (
    <>
      <Slider {...settings}>
        {products.map(product => (
          <Badge.Ribbon placement="start" color="#E01020" text={'Giảm ' + product.discountPercentage + '%'}>
            <div className="products__item" key={product.id}>
              <figure className="products__thumbnail">
                <img src={product.thumbnail} alt={product.title} />
              </figure>
              <div className="products__info">
                <h3 className="products__title">{product.title}</h3>
                <span className="products__price-wrap">
                  <p className="products__price">
                    {((product.price * (100 - product.discountPercentage)) / 100).toFixed(3)}
                    <sup>₫</sup>
                  </p>
                  <p className="products__price--old">
                    {product.price.toFixed(3)}
                    <sup>₫</sup>
                  </p>
                </span>
                <div className="products__footer">
                  <Rate disabled allowHalf value={product.rate} />
                  <FontAwesomeIcon className="products__footer__cart" icon={faCartPlus} />
                </div>
              </div>
            </div>
          </Badge.Ribbon>
        ))}
      </Slider>
    </>
  )
}

export default TopDeal
