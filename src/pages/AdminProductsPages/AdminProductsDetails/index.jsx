import { useEffect, useState } from 'react'
import { Spin } from 'antd'
import { useParams } from 'react-router-dom'
import { getProductById } from '@/services/adminProductService'
import { adminProductRows } from '@/helpers/adminProductRows'
import AdminProductThumbnail from './components/AdminProductCategoryThumbnail'
import SEO from '@/components/SEO'
import './AdminProductsDetails.scss'

function renderProductRow(label, value) {
  return (
    <tr key={label} className="admin-product__row">
      <td className="admin-product__cell admin-product__cell--label">{label}</td>
      <td className="admin-product__cell admin-product__cell--value">{value}</td>
    </tr>
  )
}

function AdminProductsDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!id) return

    ;(async () => {
      setIsLoading(true)
      try {
        const response = await getProductById(id)
        setProduct(response?.product || null)
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [id])

  return (
    <section className="admin-product">
      <SEO title="Admin - Product Details" noIndex />
      <h1 className="admin-product__title">Product Details</h1>

      <Spin spinning={isLoading} tip="Loading product..." className="admin-product__spin">
        {!isLoading && product ? (
          <div className="admin-product__layout">
            <div className="admin-product__info">
              <table className="admin-product__table">
                <tbody>
                  {adminProductRows(product).map(([label, value]) => renderProductRow(label, value))}
                  {renderProductRow('Description', <div className="admin-product__rich-text" dangerouslySetInnerHTML={{ __html: product.description || 'N/A' }} />)}
                  {renderProductRow('Content', <div className="admin-product__rich-text" dangerouslySetInnerHTML={{ __html: product.content || 'N/A' }} />)}
                </tbody>
              </table>
            </div>

            <div className="admin-product__thumb">
              {product.thumbnail && <AdminProductThumbnail thumbnail={product.thumbnail} title={product.title} />}
            </div>
          </div>
        ) : (
          !isLoading && <p className="admin-product__empty">Product not found</p>
        )}
      </Spin>
    </section>
  )
}

export default AdminProductsDetails
