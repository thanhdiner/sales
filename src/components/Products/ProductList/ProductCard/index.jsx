import React from 'react'
import { Link } from 'react-router-dom'
import { Rate } from 'antd'

function ProductCard(props) {
  const { product } = props

  const priceNew = ((product.price * (100 - product.discountPercentage)) / 100).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
  const price = product.price.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  })
  return (
    <>
      <Link to={`/products/${product.slug}`}>
        <div className="product__cart">
          <figure className="product__thumbnail">
            <img src={product.thumbnail} alt={product.title} />
          </figure>
          <div className="product__info">
            <h3 className="product__title">{product.title}</h3>
            <span className="product__price-wrap">
              <p className="product__price">
                {priceNew}
                <sup>₫</sup>
              </p>
              <p className="product__price--old">
                {price}
                <sup>₫</sup>
              </p>
            </span>
            <div className="product__footer">
              <Rate className="product__footer__rate" disabled allowHalf value={product.rate} />
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

export default ProductCard
