import React from 'react'
import './ProductList.scss'
import { Link } from 'react-router-dom'
import { Rate } from 'antd'

function ProductList(props) {
  const { products } = props
  return (
    <>
      <div className="products">
        {products?.map(product => (
          <div key={product.id}>
            <Link>
              <div className="product__cart">
                <figure className="product__thumbnail">
                  <img src={product.thumbnail} alt={product.title} />
                </figure>
                <div className="product__info">
                  <h3 className="product__title">{product.title}</h3>
                  <span className="product__price-wrap">
                    <p className="product__price">
                      {((product.price * (100 - product.discountPercentage)) / 100).toFixed(3)}
                      <sup>₫</sup>
                    </p>
                    <p className="product__price--old">
                      {product.price.toFixed(3)}
                      <sup>₫</sup>
                    </p>
                  </span>
                  <div className="product__footer">
                    <Rate className="product__footer__rate" disabled allowHalf value={product.rate} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}

export default ProductList
