import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProductCategoryById } from '../../../services/productCategoryService'
import { Spin } from 'antd'
import renderRow from '../../../utils/renderRow'
import { adminProductCategoryRows } from '../../../helpers/adminProductCategoryRows'
import AdminProductCategoryThumbnail from '../../../components/AdminProductCategoriesTable/AdminProductCategoryThumbnail'
import './AdminProductCategoriesDetails.scss'

function AdminProductCategoriesDetails() {
  const { id } = useParams()
  const [productCategory, setProductCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      setIsLoading(true)
      try {
        const { productCategory } = await getProductCategoryById(id)
        setProductCategory(productCategory)
      } catch (err) {
        console.error('Failed to fetch product category:', err)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [id])

  return (
    <div className="admin-product-category">
      <h1 className="admin-product-category__title dark:text-gray-200">Product Category Details</h1>

      <Spin spinning={isLoading} tip="Loading product category...">
        {!isLoading && productCategory ? (
          <div className="admin-product-category__layout">
            <div className="admin-product-category__info">
              <table className="admin-product-category__table">
                <tbody>
                  {adminProductCategoryRows(productCategory).map(([label, value]) => renderRow(label, value))}
                  {renderRow('Description', <div dangerouslySetInnerHTML={{ __html: productCategory.description || '—' }} />)}

                  {renderRow('Content', <div dangerouslySetInnerHTML={{ __html: productCategory.content || '—' }} />)}
                </tbody>
              </table>
            </div>

            <div className="admin-product-category__thumb">
              {productCategory.thumbnail && (
                <AdminProductCategoryThumbnail thumbnail={productCategory.thumbnail} title={productCategory.title} />
              )}
            </div>
          </div>
        ) : (
          !isLoading && <p className="admin-product-category__empty">Không tìm thấy danh mục sản phẩm</p>
        )}
      </Spin>
    </div>
  )
}

export default AdminProductCategoriesDetails
