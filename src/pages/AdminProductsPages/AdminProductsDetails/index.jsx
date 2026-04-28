import { useEffect, useMemo, useState } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Collapse, Empty, message, Modal, Spin, Tag } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteProduct, getProductById } from '@/services/adminProductService'
import { formatVND } from '@/helpers/formatCurrency'
import { formatDate } from '@/helpers/formatDate'
import { extractFileName } from '@/utils/extractFileName'
import useAdminPermissions from '@/hooks/useAdminPermissions'
import SEO from '@/components/SEO'
import {
  getLocalizedProduct,
  getLocalizedProductCategoryTitle
} from '../utils/productLocalization'
import { useTranslation } from 'react-i18next'
import './AdminProductsDetails.scss'

const ADMIN_PRODUCT_DETAILS_CONFIRM_MASK_STYLE = {
  background: 'rgba(8, 10, 14, 0.72)',
  backdropFilter: 'blur(2px)'
}

const getProductLocale = language => (String(language || '').startsWith('en') ? 'en-US' : 'vi-VN')

const getUserLabel = (entry, t) => {
  if (typeof entry === 'string' && entry) return entry
  if (typeof entry?.account_id === 'string' && entry.account_id) return entry.account_id
  if (entry?.account_id?.fullName) return entry.account_id.fullName
  if (entry?.account_id?.email) return entry.account_id.email
  if (entry?.by?.fullName) return entry.by.fullName
  if (entry?.by?.email) return entry.by.email
  return t('common.notAvailable')
}

const getEntryDate = entry => entry?.at || entry?.updatedAt || entry?.createdAt

const getCategoryLabel = (productCategory, t, language) => {
  if (!productCategory) return t('table.uncategorized')
  if (typeof productCategory === 'string') return productCategory
  return getLocalizedProductCategoryTitle(
    { productCategory },
    language,
    productCategory.name || productCategory._id || t('table.uncategorized')
  )
}

const formatPercent = (value, locale) => {
  if (value === undefined || value === null || value === '') return '0%'
  if (typeof value === 'string' && value.includes('%')) return value

  const numericValue = Number(value)
  return Number.isNaN(numericValue) ? `${value}%` : `${numericValue.toLocaleString(locale)}%`
}

const formatPrice = (value, t) => {
  if (value === undefined || value === null || value === '') return t('common.notAvailable')
  return formatVND(value, { withSuffix: true })
}

const getDiscountedPrice = product => {
  const price = Number(product?.price)
  const discount = Number(product?.discountPercentage)

  if (!Number.isFinite(price) || !Number.isFinite(discount) || discount <= 0) return null
  return price * (1 - discount / 100)
}

function DetailValue({ children, fallback }) {
  return <div className="admin-product__value">{children ?? fallback}</div>
}

function DetailRows({ rows }) {
  return (
    <dl className="admin-product__rows">
      {rows.map(([label, value]) => (
        <div key={label} className="admin-product__row">
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function DetailSection({ title, rows, action, className = '' }) {
  return (
    <section className={`admin-product__section ${className}`.trim()}>
      <div className="admin-product__section-header">
        <h2>{title}</h2>
        {action}
      </div>
      <DetailRows rows={rows} />
    </section>
  )
}

function RichTextBlock({ value, t }) {
  if (!value) return <DetailValue>{t('common.notAvailable')}</DetailValue>
  return <div className="admin-product__rich-text" dangerouslySetInnerHTML={{ __html: value }} />
}

function UpdateHistory({ history, t }) {
  if (!history.length) return <DetailValue>{t('common.notAvailable')}</DetailValue>

  return (
    <div className="admin-product__history">
      {history.map((entry, index) => {
        const userLabel = getUserLabel(entry, t)
        const updatedAt = getEntryDate(entry)

        return (
          <div key={`${userLabel}-${updatedAt || index}`} className="admin-product__history-item">
            <span className="admin-product__history-dot" />
            <div className="admin-product__history-content">
              <div className="admin-product__history-user">{userLabel}</div>
              <div className="admin-product__history-time">{updatedAt ? formatDate(updatedAt) : t('common.notAvailable')}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ProductStatusTag({ status, t }) {
  const statusValue = status || 'inactive'
  const statusClassName =
    statusValue === 'active'
      ? 'admin-product__status-tag admin-product__status-tag--active'
      : 'admin-product__status-tag admin-product__status-tag--inactive'

  return <Tag className={statusClassName}>{t(`status.${statusValue}`, { defaultValue: statusValue })}</Tag>
}

function ProductPrice({ product, t }) {
  const discountedPrice = getDiscountedPrice(product)

  if (!discountedPrice) return <DetailValue>{formatPrice(product.price, t)}</DetailValue>

  return (
    <DetailValue>
      <span className="admin-product__price-original">{formatPrice(product.price, t)}</span>
      <strong className="admin-product__price-discounted">{formatPrice(discountedPrice, t)}</strong>
    </DetailValue>
  )
}

function ProductSummary({ product, rows, t }) {
  return (
    <section className="admin-product__summary-card">
      <div className="admin-product__summary-image">
        {product.thumbnail ? <img src={product.thumbnail} alt={product.title} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />}
      </div>

      <div className="admin-product__summary-copy">
        <div className="admin-product__summary-heading">
          <h2>{product.title || t('details.untitledProduct')}</h2>
          <ProductStatusTag status={product.status} t={t} />
        </div>
        {product.thumbnail && <p className="admin-product__summary-file">{extractFileName(product.thumbnail)}</p>}
        <DetailRows rows={rows} />
      </div>
    </section>
  )
}

function ProductActions({ product, onDelete, t }) {
  const permissions = useAdminPermissions()
  const hasEdit = permissions.includes('edit_product')
  const hasDelete = permissions.includes('delete_product')

  if (!hasEdit && !hasDelete) return null

  return (
    <section className="admin-product__actions-card">
      <h2>{t('details.quickActions')}</h2>
      <div className="admin-product__actions">
        {hasEdit && (
          <Link to={`/admin/products/edit/${product._id}`}>
            <Button type="primary" className="admin-product__action-btn admin-product__action-btn--primary" icon={<EditOutlined />}>
              {t('common.edit')}
            </Button>
          </Link>
        )}
        {hasDelete && (
          <Button danger className="admin-product__action-btn admin-product__action-btn--danger" icon={<DeleteOutlined />} onClick={onDelete}>
            {t('common.delete')}
          </Button>
        )}
      </div>
    </section>
  )
}

function MobileProductDetails({ product, rows, history, onDelete, t, language }) {
  const categoryLabel = getCategoryLabel(product.productCategory, t, language)

  const collapseItems = [
    {
      key: 'history',
      label: (
        <span className="admin-product__collapse-label">
          {t('details.updateHistory')} <span>{history.length}</span>
        </span>
      ),
      children: <UpdateHistory history={history} t={t} />
    },
    {
      key: 'content',
      label: t('details.descriptionContent'),
      children: (
        <div className="admin-product__mobile-rich">
          <RichTextBlock value={product.description} t={t} />
          <RichTextBlock value={product.content} t={t} />
        </div>
      )
    },
    {
      key: 'metadata',
      label: t('details.metadata'),
      children: <DetailRows rows={rows.metadata} />
    }
  ]

  return (
    <div className="admin-product__mobile-layout">
      <section className="admin-product__mobile-hero">
        <div className="admin-product__mobile-image">
          {product.thumbnail ? <img src={product.thumbnail} alt={product.title} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />}
        </div>
        <div className="admin-product__mobile-title">
          <h1>{product.title || t('details.untitledProduct')}</h1>
          <ProductStatusTag status={product.status} t={t} />
        </div>
        <div className="admin-product__mobile-stats">
          <div>
            <span>{t('details.price')}</span>
            <strong>{formatPrice(product.price, t)}</strong>
          </div>
          <div>
            <span>{t('details.stock')}</span>
            <strong>{product.stock ?? 0}</strong>
          </div>
          <div>
            <span>{t('details.category')}</span>
            <strong>{categoryLabel}</strong>
          </div>
        </div>
      </section>

      <DetailSection title={t('details.mainInfo')} rows={rows.mobileMain} />

      <Collapse className="admin-product__collapse" items={collapseItems} bordered={false} expandIconPosition="end" />

      <ProductActions product={product} onDelete={onDelete} t={t} />
    </div>
  )
}

function AdminProductsDetails() {
  const { t, i18n } = useTranslation('adminProducts')
  const language = i18n.resolvedLanguage || i18n.language
  const locale = getProductLocale(language)
  const { id } = useParams()
  const navigate = useNavigate()
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

  const displayProduct = useMemo(() => getLocalizedProduct(product, language), [language, product])

  const detailData = useMemo(() => {
    if (!displayProduct) return null

    const history = Array.isArray(displayProduct.updateBy) ? displayProduct.updateBy : []
    const notAvailable = t('common.notAvailable')
    const categoryLabel = getCategoryLabel(displayProduct.productCategory, t, language)
    const basicRows = [
      [t('details.product'), <DetailValue>{displayProduct.title || notAvailable}</DetailValue>],
      [t('details.slug'), <DetailValue>{displayProduct.slug || notAvailable}</DetailValue>],
      [t('details.category'), <DetailValue>{categoryLabel}</DetailValue>],
      [t('details.status'), <ProductStatusTag status={displayProduct.status} t={t} />],
      [t('details.rate'), <DetailValue>{displayProduct.rate ? `${displayProduct.rate} *` : notAvailable}</DetailValue>]
    ]
    const pricingRows = [
      [t('details.price'), <ProductPrice product={displayProduct} t={t} />],
      [t('details.discount'), <DetailValue>{formatPercent(displayProduct.discountPercentage, locale)}</DetailValue>],
      [t('details.stock'), <DetailValue>{displayProduct.stock ?? 0}</DetailValue>],
      [t('details.position'), <DetailValue>{displayProduct.position ?? notAvailable}</DetailValue>]
    ]
    const metadataRows = [
      [t('details.createdAt'), <DetailValue>{formatDate(displayProduct.createdAt)}</DetailValue>],
      [t('details.lastUpdated'), <DetailValue>{displayProduct.updatedAt ? formatDate(displayProduct.updatedAt) : notAvailable}</DetailValue>],
      [t('details.createdBy'), <DetailValue>{getUserLabel(displayProduct.createdBy, t)}</DetailValue>],
      [t('details.timeStart'), <DetailValue>{formatDate(displayProduct.timeStart)}</DetailValue>],
      [t('details.timeFinish'), <DetailValue>{formatDate(displayProduct.timeFinish)}</DetailValue>]
    ]

    return {
      history,
      rows: {
        basic: basicRows,
        pricing: pricingRows,
        metadata: metadataRows,
        summary: [
          [t('details.price'), <ProductPrice product={product} t={t} />],
          [t('details.stock'), <DetailValue>{product.stock ?? 0}</DetailValue>],
          [t('details.category'), <DetailValue>{categoryLabel}</DetailValue>],
          [t('details.position'), <DetailValue>{product.position ?? notAvailable}</DetailValue>]
        ],
        mobileMain: [
          [t('details.slug'), <DetailValue>{displayProduct.slug || notAvailable}</DetailValue>],
          [t('details.position'), <DetailValue>{displayProduct.position ?? notAvailable}</DetailValue>],
          [t('details.rate'), <DetailValue>{displayProduct.rate ? `${displayProduct.rate} *` : notAvailable}</DetailValue>],
          [t('details.createdAt'), <DetailValue>{formatDate(displayProduct.createdAt)}</DetailValue>],
          [t('details.lastUpdated'), <DetailValue>{displayProduct.updatedAt ? formatDate(displayProduct.updatedAt) : notAvailable}</DetailValue>]
        ]
      }
    }
  }, [displayProduct, language, locale, t])

  const handleDelete = () => {
    if (!product?._id) return

    Modal.confirm({
      className: 'admin-product__confirm-modal',
      maskStyle: ADMIN_PRODUCT_DETAILS_CONFIRM_MASK_STYLE,
      title: <span>{t('details.deleteTitle')}</span>,
      content: <span>{t('details.deleteContent', { title: displayProduct?.title || product.title })}</span>,
      okText: t('common.yes'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await deleteProduct(product._id)
          message.success(t('details.deleteSuccess'))
          navigate('/admin/products')
        } catch (error) {
          message.error(t('details.deleteError'))
        }
      }
    })
  }

  return (
    <section className="admin-product">
      <SEO title={t('seo.detailsTitle')} noIndex />

      <Spin spinning={isLoading} tip={t('details.loading')} className="admin-product__spin">
        {!isLoading && displayProduct && detailData ? (
          <>
            <h1 className="admin-product__title">{t('details.title')}</h1>

            <div className="admin-product__layout">
              <main className="admin-product__main">
                <DetailSection title={t('details.basicInfo')} rows={detailData.rows.basic} />
                <DetailSection title={t('details.pricingInventory')} rows={detailData.rows.pricing} />
                <DetailSection title={t('details.metadata')} rows={detailData.rows.metadata} />

                <div className="admin-product__two-up">
                  <section className="admin-product__section">
                    <div className="admin-product__section-header">
                      <h2>{t('details.descriptionContent')}</h2>
                    </div>
                    <DetailRows
                      rows={[
                        [t('details.description'), <RichTextBlock value={displayProduct.description} t={t} />],
                        [t('details.content'), <RichTextBlock value={displayProduct.content} t={t} />]
                      ]}
                    />
                  </section>

                  <section className="admin-product__section">
                    <div className="admin-product__section-header">
                      <h2>{t('details.updateHistory')}</h2>
                      <span>{detailData.history.length}</span>
                    </div>
                    <UpdateHistory history={detailData.history} t={t} />
                  </section>
                </div>
              </main>

              <aside className="admin-product__sidebar">
                <ProductSummary product={displayProduct} rows={detailData.rows.summary} t={t} />
                <ProductActions product={displayProduct} onDelete={handleDelete} t={t} />
              </aside>
            </div>

            <MobileProductDetails
              product={displayProduct}
              rows={detailData.rows}
              history={detailData.history}
              onDelete={handleDelete}
              t={t}
              language={language}
            />
          </>
        ) : (
          !isLoading && <p className="admin-product__empty">{t('details.notFound')}</p>
        )}
      </Spin>
    </section>
  )
}

export default AdminProductsDetails
