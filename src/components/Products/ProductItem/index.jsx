import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, Rate } from 'antd'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart } from '../../../stores/cart'
import { formatVND } from '../../../helpers/formatCurrency'

function ProductItem(props) {
  const carts = useSelector(store => store.cart.items)
// console.log(carts)
  const { product, isDragging } = props

  const priceNew = formatVND((product.price * (100 - product.discountPercentage)) / 100)
  const price = formatVND(product.price)

  const dispatch = useDispatch()
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product.id,
        quantity: 1
      })
    )
  }

  const productContent = (
    <>
      <div className="products__item">
        <Link
          to={`products/${product.slug}`}
          draggable={false}
          onClick={e => {
            if (isDragging) e.preventDefault()
          }}
        >
          <figure className="products__thumbnail">
            <img src={product.thumbnail} alt={product.title} />
          </figure>
          <div className="products__info">
            <h3 className="products__title">{product.title}</h3>
            <span className="products__price-wrap">
              <p className="products__price">
                {priceNew}
                <sup>₫</sup>
              </p>
              {product.discountPercentage > 0 ? (
                <p className="products__price--old">
                  {price}
                  <span className="currency">đ</span>
                </p>
              ) : (
                <p className="products__price--old placeholder">&nbsp;</p>
              )}
            </span>
          </div>
        </Link>
        <div className="products__footer">
          <Rate className="products__footer__rate" disabled allowHalf value={product.rate} />
          <button className="products__footer__cart" onClick={handleAddToCart}>
            <FontAwesomeIcon icon={faCartPlus} className="products__footer__cart--add" />
          </button>
        </div>
      </div>
    </>
  )
  return (
    <>
      <div className="product" key={product.id}>
        {product.discountPercentage ? (
          <Badge.Ribbon placement="start" color="#E01020" text={'Giảm ' + product.discountPercentage + '%'}>
            {productContent}
          </Badge.Ribbon>
        ) : (
          productContent
        )}
      </div>
    </>
  )
}

export default ProductItem
