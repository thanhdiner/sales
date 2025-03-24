import { useEffect, useState } from 'react'
import { getProductDetail } from '../../../services/productService'
import { useNavigate, useParams } from 'react-router-dom'
import './ProductsDetail.scss'
import Error404 from '../../Error404'
import { Spin } from 'antd'

const contentStyle = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
  height: '100vh'
}
const content = <div style={contentStyle} />

function ProductsDetail() {
  const params = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const productData = await getProductDetail(params.slug)
        if (!productData) {
          setNotFound(true)
          return
        }
        setProduct(productData)
      } catch (err) {
        setError('Có lỗi xảy ra khi tải sản phẩm.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.slug, navigate])
  if (loading) return <Spin tip="Đang tải sản phẩm..."> {content}</Spin>

  if (notFound) return <Error404 />

  if (error) return <p className="product-detail__error">{error}</p>

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
      {product && (
        <div className="product-detail">
          <div className="product-detail__container">
            <div className="product-detail__image">
              <img src={product.thumbnail} alt={product.title} className="product-detail__image-main" />
            </div>

            <div className="product-detail__info">
              <h1 className="product-detail__title">{product.title}</h1>
              <p className="product-detail__rating">⭐ {product.rate} / 5</p>
              <p className="product-detail__price">
                {priceNew}đ<span className="product-detail__price--old">{price}đ</span>
              </p>
              <p className="product-detail__stock">Còn {product.stock} sản phẩm</p>
              <button className="product-detail__button product-detail__button--buy">Mua ngay</button>
              <button className="product-detail__button product-detail__button--cart">Thêm vào giỏ</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductsDetail
