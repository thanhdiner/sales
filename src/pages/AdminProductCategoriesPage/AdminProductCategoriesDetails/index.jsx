import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Skeleton } from 'antd'
import { ArrowLeftOutlined, EditOutlined, FolderOpenOutlined, HistoryOutlined, TagOutlined } from '@ant-design/icons'
import SEO from '@/components/SEO'
import { getProductCategoryById } from '@/services/adminProductCategoryService'
import { formatDate } from '@/helpers/formatDate'
import { capitalize } from '@/utils/capitalize'
import AdminProductCategoryThumbnail from './components/AdminProductCategoryThumbnail'
import './AdminProductCategoriesDetails.scss'

const DASH = '—'

const getStatusClassName = status =>
  status === 'active'
    ? 'admin-product-category-details__status-chip admin-product-category-details__status-chip--active'
    : 'admin-product-category-details__status-chip admin-product-category-details__status-chip--inactive'

const getOverviewCards = category => [
  {
    label: 'Trạng thái',
    value: capitalize(category.status || 'inactive'),
    icon: <TagOutlined />,
    tone: 'admin-product-category-details__overview-card--status'
  },
  {
    label: 'Vị trí hiển thị',
    value: category.position ?? DASH,
    icon: <FolderOpenOutlined />,
    tone: 'admin-product-category-details__overview-card--position'
  },
  {
    label: 'Ngày tạo',
    value: formatDate(category.createdAt),
    icon: <HistoryOutlined />,
    tone: 'admin-product-category-details__overview-card--created'
  },
  {
    label: 'Cập nhật gần nhất',
    value: category.updatedAt ? formatDate(category.updatedAt) : DASH,
    icon: <HistoryOutlined />,
    tone: 'admin-product-category-details__overview-card--updated'
  }
]

function DetailBlock({ title, subtitle, children }) {
  return (
    <section className="admin-product-category-details__panel">
      <div className="admin-product-category-details__panel-head">
        <h2 className="admin-product-category-details__panel-title">{title}</h2>
        {subtitle ? <p className="admin-product-category-details__panel-subtitle">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  )
}

function MetaItem({ label, value }) {
  return (
    <div className="admin-product-category-details__meta-item">
      <p className="admin-product-category-details__meta-label">{label}</p>
      <p className="admin-product-category-details__meta-value">{value || DASH}</p>
    </div>
  )
}

function AdminProductCategoriesDetails() {
  const { id } = useParams()
  const [productCategory, setProductCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!id) return

    ;(async () => {
      setIsLoading(true)
      setHasError(false)

      try {
        const { productCategory } = await getProductCategoryById(id)
        setProductCategory(productCategory)
      } catch (err) {
        console.error('Failed to fetch product category:', err)
        setProductCategory(null)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [id])

  const updateHistory = useMemo(() => {
    if (!productCategory?.updateBy?.length) return []

    return productCategory.updateBy.map((item, index) => ({
      id: `${item.account_id || 'unknown'}-${item.updatedAt || index}`,
      accountId: item.account_id || DASH,
      updatedAt: item.updatedAt ? formatDate(item.updatedAt) : DASH
    }))
  }, [productCategory])

  return (
    <div className="admin-product-category-details-page">
      <SEO title="Admin - Chi tiết danh mục" noIndex />

      <div className="admin-product-category-details-page__inner">
        {isLoading ? (
          <>
            <div className="admin-product-category-details__skeleton-card">
              <Skeleton active paragraph={{ rows: 3 }} title={{ width: '36%' }} />
            </div>

            <div className="admin-product-category-details__skeleton-overview-grid">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton.Button key={index} active block style={{ height: 140, borderRadius: 24 }} />
              ))}
            </div>

            <div className="admin-product-category-details__skeleton-panel-grid">
              <Skeleton active paragraph={{ rows: 10 }} className="admin-product-category-details__skeleton-panel" />
              <Skeleton active paragraph={{ rows: 8 }} className="admin-product-category-details__skeleton-panel" />
            </div>
          </>
        ) : !productCategory ? (
          <div className="admin-product-category-details__empty-state">
            <p className="admin-product-category-details__empty-label">Danh mục sản phẩm</p>
            <h1 className="admin-product-category-details__empty-title">
              {hasError ? 'Không thể tải dữ liệu danh mục' : 'Không tìm thấy danh mục'}
            </h1>
            <p className="admin-product-category-details__empty-description">
              Kiểm tra lại đường dẫn hoặc quay về trang quản lý danh mục để chọn một bản ghi khác.
            </p>

            <div className="admin-product-category-details__empty-actions">
              <Link to="/admin/product-categories">
                <Button size="large" className="admin-product-category-details-btn admin-product-category-details-btn--default">
                  Quay lại danh sách
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <header className="admin-product-category-details__hero">
              <div className="admin-product-category-details__hero-head">
                <div className="admin-product-category-details__hero-main">
                  <Link to="/admin/product-categories" className="admin-product-category-details__back-link">
                    <ArrowLeftOutlined />
                    Quay lại danh sách danh mục
                  </Link>

                  <p className="admin-product-category-details__hero-eyebrow">Tổng quan danh mục sản phẩm</p>
                  <h1 className="admin-product-category-details__hero-title">{productCategory.title}</h1>

                  <div className="admin-product-category-details__chip-list">
                    <span className={getStatusClassName(productCategory.status)}>{capitalize(productCategory.status || 'inactive')}</span>
                    <span className="admin-product-category-details__meta-chip">Slug: {productCategory.slug || DASH}</span>
                    <span className="admin-product-category-details__meta-chip">
                      Danh mục cha: {productCategory?.parent_id?.title || 'Không có'}
                    </span>
                  </div>
                </div>

                <div className="admin-product-category-details__hero-actions">
                  <Link to="/admin/product-categories">
                    <Button size="large" className="admin-product-category-details-btn admin-product-category-details-btn--ghost">
                      Danh sách danh mục
                    </Button>
                  </Link>

                  <Link to={`/admin/product-categories/edit/${productCategory._id}`}>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      size="large"
                      className="admin-product-category-details-btn admin-product-category-details-btn--primary"
                    >
                      Chỉnh sửa danh mục
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="admin-product-category-details__overview-grid">
                {getOverviewCards(productCategory).map(card => (
                  <div key={card.label} className={`admin-product-category-details__overview-card ${card.tone}`}>
                    <div className="admin-product-category-details__overview-content">
                      <div>
                        <p className="admin-product-category-details__overview-label">{card.label}</p>
                        <p className="admin-product-category-details__overview-value">{card.value}</p>
                      </div>
                      <div className="admin-product-category-details__overview-icon">{card.icon}</div>
                    </div>
                  </div>
                ))}
              </div>
            </header>

            <div className="admin-product-category-details__content-grid">
              <div className="admin-product-category-details__main-column">
                <DetailBlock title="Tổng quan" subtitle="Các thông tin định danh và trạng thái hiển thị của danh mục.">
                  <div className="admin-product-category-details__meta-grid">
                    <MetaItem label="Tên danh mục" value={productCategory.title} />
                    <MetaItem label="Slug" value={productCategory.slug} />
                    <MetaItem label="Danh mục cha" value={productCategory?.parent_id?.title || 'Không có'} />
                    <MetaItem label="Vị trí" value={productCategory.position ?? DASH} />
                  </div>
                </DetailBlock>

                <DetailBlock title="Mô tả" subtitle="Nội dung giới thiệu hiển thị cho danh mục sản phẩm này.">
                  {productCategory.description ? (
                    <div className="admin-product-category-richtext">
                      <div dangerouslySetInnerHTML={{ __html: productCategory.description }} />
                    </div>
                  ) : (
                    <p className="admin-product-category-details__empty-text">Danh mục này chưa có mô tả ngắn.</p>
                  )}
                </DetailBlock>

                <DetailBlock title="Nội dung chi tiết" subtitle="Phần nội dung mở rộng nếu danh mục có cấu hình thêm.">
                  {productCategory.content ? (
                    <div className="admin-product-category-richtext">
                      <div dangerouslySetInnerHTML={{ __html: productCategory.content }} />
                    </div>
                  ) : (
                    <p className="admin-product-category-details__empty-text">Danh mục này chưa có nội dung chi tiết.</p>
                  )}
                </DetailBlock>

                <DetailBlock title="Lịch sử cập nhật" subtitle="Theo dõi các lần chỉnh sửa gần đây của danh mục.">
                  {updateHistory.length ? (
                    <div className="admin-product-category-details__history-list">
                      {updateHistory.map(item => (
                        <div key={item.id} className="admin-product-category-details__history-item">
                          <div>
                            <p className="admin-product-category-details__history-user">{item.accountId}</p>
                            <p className="admin-product-category-details__history-note">Tài khoản thực hiện cập nhật</p>
                          </div>
                          <p className="admin-product-category-details__history-time">{item.updatedAt}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="admin-product-category-details__empty-text">Chưa có lịch sử cập nhật được ghi nhận.</p>
                  )}
                </DetailBlock>
              </div>

              <aside className="admin-product-category-details__side-column">
                <AdminProductCategoryThumbnail thumbnail={productCategory.thumbnail} title={productCategory.title} />

                <DetailBlock title="Thông tin quản trị" subtitle="Metadata nội bộ để theo dõi bản ghi này.">
                  <div className="admin-product-category-details__meta-list">
                    <MetaItem label="Người tạo" value={productCategory.createdBy?.account_id || DASH} />
                    <MetaItem label="Ngày tạo" value={formatDate(productCategory.createdAt)} />
                    <MetaItem label="Cập nhật gần nhất" value={productCategory.updatedAt ? formatDate(productCategory.updatedAt) : DASH} />
                  </div>
                </DetailBlock>

                <DetailBlock title="Thao tác nhanh" subtitle="Điều hướng nhanh tới các trang quản trị liên quan.">
                  <div className="admin-product-category-details__quick-actions">
                    <Link to="/admin/product-categories" className="admin-product-category-details__quick-action-link">
                      <Button size="large" className="admin-product-category-details-btn admin-product-category-details-btn--default">
                        Quay lại danh sách
                      </Button>
                    </Link>

                    <Link to={`/admin/product-categories/edit/${productCategory._id}`} className="admin-product-category-details__quick-action-link">
                      <Button
                        type="primary"
                        size="large"
                        icon={<EditOutlined />}
                        className="admin-product-category-details-btn admin-product-category-details-btn--primary"
                      >
                        Chỉnh sửa ngay
                      </Button>
                    </Link>
                  </div>
                </DetailBlock>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminProductCategoriesDetails
