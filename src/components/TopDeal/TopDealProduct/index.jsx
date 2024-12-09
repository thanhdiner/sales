import { Badge, Rate } from 'antd'
import { Link } from 'react-router-dom'

function TopDealProduct(props) {
  const { product, isDragging } = props

  return (
    <>
      <div className="product" key={product.id}>
        <Link
          to={`/${product.slug}`}
          draggable={false}
          onClick={e => {
            if (isDragging) e.preventDefault()
          }}
        >
          <Badge.Ribbon placement="start" color="#E01020" text={'Giảm ' + product.discountPercentage + '%'}>
            <div className="products__item">
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
                  <Rate className="products__footer__rate" disabled allowHalf value={product.rate} />
                </div>
              </div>
            </div>
          </Badge.Ribbon>
        </Link>
      </div>
    </>
  )
}

export default TopDealProduct
