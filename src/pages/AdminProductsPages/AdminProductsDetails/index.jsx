import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '../../../services/productService'
import { Spin } from 'antd'
import renderRow from '../../../utils/renderRow'
import { adminProductRows } from '../../../helpers/adminProductRows'
import AdminProductThumbnail from '../../../components/AdminProductThumbnail'
import './AdminProductsDetails.scss'

function AdminProductsDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      setIsLoading(true)
      try {
        const { product } = await getProductById(id)
        setProduct(product)
      } catch (err) {
        console.error('Failed to fetch product:', err)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [id])

  return (
    <div className="admin-product">
      <h1 className="admin-product__title">Product Details</h1>

      <Spin spinning={isLoading} tip="Loading product...">
        {!isLoading && product ? (
          <div className="admin-product__layout">
            <div className="admin-product__info">
              <table className="admin-product__table">
                <tbody>
                  {adminProductRows(product).map(([label, value]) => renderRow(label, value))}
                  {renderRow('Description', <div dangerouslySetInnerHTML={{ __html: product.description || '—' }} />)}

                  {renderRow('Content', <div dangerouslySetInnerHTML={{ __html: product.content || '—' }} />)}
                </tbody>
              </table>
            </div>

            <div className="admin-product__thumb">
              {product.thumbnail && <AdminProductThumbnail thumbnail={product.thumbnail} title={product.title} />}
            </div>
          </div>
        ) : (
          !isLoading && <p className="admin-product__empty">Không tìm thấy sản phẩm</p>
        )}
      </Spin>
    </div>
  )
}

export default AdminProductsDetails
