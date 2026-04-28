import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Skeleton } from 'antd'
import { ArrowLeftOutlined, EditOutlined, FolderOpenOutlined, HistoryOutlined, TagOutlined } from '@ant-design/icons'
import SEO from '@/components/SEO'
import { getProductCategoryById } from '@/services/adminProductCategoryService'
import AdminProductCategoryThumbnail from './components/AdminProductCategoryThumbnail'
import { getLocalizedProductCategory } from '../utils/productCategoryLocalization'
import { useTranslation } from 'react-i18next'
import './AdminProductCategoriesDetails.scss'

const DASH = '-'

const getStatusClassName = status =>
  status === 'active'
    ? 'admin-product-category-details__status-chip admin-product-category-details__status-chip--active'
    : 'admin-product-category-details__status-chip admin-product-category-details__status-chip--inactive'

const getLocale = language => (String(language || '').startsWith('en') ? 'en-US' : 'vi-VN')

const formatDateTime = (value, locale) => {
  if (!value) return DASH

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? DASH : date.toLocaleString(locale)
}

const getUserLabel = (entry, fallback = DASH) => {
  if (typeof entry === 'string' && entry) return entry
  if (entry?.account_id) return entry.account_id
  if (entry?.by?.fullName) return entry.by.fullName
  if (entry?.by?.email) return entry.by.email
  return fallback
}

const getOverviewCards = (category, t, locale) => [
  {
    label: t('details.overview.status'),
    value: t(`status.${category.status || 'inactive'}`),
    icon: <TagOutlined />,
    tone: 'admin-product-category-details__overview-card--status'
  },
  {
    label: t('details.overview.position'),
    value: category.position ?? DASH,
    icon: <FolderOpenOutlined />,
    tone: 'admin-product-category-details__overview-card--position'
  },
  {
    label: t('details.overview.createdAt'),
    value: formatDateTime(category.createdAt, locale),
    icon: <HistoryOutlined />,
    tone: 'admin-product-category-details__overview-card--created'
  },
  {
    label: t('details.overview.updatedAt'),
    value: formatDateTime(category.updatedAt, locale),
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
  const { t, i18n } = useTranslation('adminProductCategories')
  const { id } = useParams()
  const [productCategory, setProductCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const language = i18n.resolvedLanguage || i18n.language
  const locale = getLocale(language)

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

  const displayCategory = useMemo(() => getLocalizedProductCategory(productCategory, language), [language, productCategory])

  const updateHistory = useMemo(() => {
    if (!productCategory?.updateBy?.length) return []

    return productCategory.updateBy.map((item, index) => ({
      id: `${getUserLabel(item, 'unknown')}-${item.at || item.updatedAt || index}`,
      accountId: getUserLabel(item),
      updatedAt: formatDateTime(item.at || item.updatedAt, locale)
    }))
  }, [locale, productCategory])

  return (
    <div className="admin-product-category-details-page">
      <SEO title={t('seo.detailsTitle')} noIndex />

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
            <p className="admin-product-category-details__empty-label">{t('details.emptyLabel')}</p>
            <h1 className="admin-product-category-details__empty-title">{hasError ? t('details.loadError') : t('details.notFound')}</h1>
            <p className="admin-product-category-details__empty-description">{t('details.emptyDescription')}</p>

            <div className="admin-product-category-details__empty-actions">
              <Link to="/admin/product-categories">
                <Button size="large" className="admin-product-category-details-btn admin-product-category-details-btn--default">
                  {t('details.backToList')}
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
                    {t('details.backToCategoryList')}
                  </Link>

                  <p className="admin-product-category-details__hero-eyebrow">{t('details.overviewEyebrow')}</p>
                  <h1 className="admin-product-category-details__hero-title">{displayCategory.title}</h1>

                  <div className="admin-product-category-details__chip-list">
                    <span className={getStatusClassName(displayCategory.status)}>
                      {t(`status.${displayCategory.status || 'inactive'}`)}
                    </span>
                    <span className="admin-product-category-details__meta-chip">
                      {t('details.meta.slug')}: {displayCategory.slug || DASH}
                    </span>
                    <span className="admin-product-category-details__meta-chip">
                      {t('details.parentLabel')}: {displayCategory?.parent_id?.title || t('details.noneParent')}
                    </span>
                  </div>
                </div>

                <div className="admin-product-category-details__hero-actions">
                  <Link to="/admin/product-categories">
                    <Button size="large" className="admin-product-category-details-btn admin-product-category-details-btn--ghost">
                      {t('details.categoryList')}
                    </Button>
                  </Link>

                  <Link to={`/admin/product-categories/edit/${productCategory._id}`}>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      size="large"
                      className="admin-product-category-details-btn admin-product-category-details-btn--primary"
                    >
                      {t('details.editCategory')}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="admin-product-category-details__overview-grid">
                {getOverviewCards(displayCategory, t, locale).map(card => (
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
                <DetailBlock title={t('details.blocks.overviewTitle')} subtitle={t('details.blocks.overviewSubtitle')}>
                  <div className="admin-product-category-details__meta-grid">
                    <MetaItem label={t('details.meta.categoryName')} value={displayCategory.title} />
                    <MetaItem label={t('details.meta.slug')} value={displayCategory.slug} />
                    <MetaItem label={t('details.meta.parent')} value={displayCategory?.parent_id?.title || t('details.noneParent')} />
                    <MetaItem label={t('details.meta.position')} value={displayCategory.position ?? DASH} />
                  </div>
                </DetailBlock>

                <DetailBlock title={t('details.blocks.descriptionTitle')} subtitle={t('details.blocks.descriptionSubtitle')}>
                  {displayCategory.description ? (
                    <div className="admin-product-category-richtext">
                      <div dangerouslySetInnerHTML={{ __html: displayCategory.description }} />
                    </div>
                  ) : (
                    <p className="admin-product-category-details__empty-text">{t('details.emptyDescriptionText')}</p>
                  )}
                </DetailBlock>

                <DetailBlock title={t('details.blocks.contentTitle')} subtitle={t('details.blocks.contentSubtitle')}>
                  {displayCategory.content ? (
                    <div className="admin-product-category-richtext">
                      <div dangerouslySetInnerHTML={{ __html: displayCategory.content }} />
                    </div>
                  ) : (
                    <p className="admin-product-category-details__empty-text">{t('details.emptyContentText')}</p>
                  )}
                </DetailBlock>

                <DetailBlock title={t('details.blocks.historyTitle')} subtitle={t('details.blocks.historySubtitle')}>
                  {updateHistory.length ? (
                    <div className="admin-product-category-details__history-list">
                      {updateHistory.map(item => (
                        <div key={item.id} className="admin-product-category-details__history-item">
                          <div>
                            <p className="admin-product-category-details__history-user">{item.accountId}</p>
                            <p className="admin-product-category-details__history-note">{t('details.historyUserNote')}</p>
                          </div>
                          <p className="admin-product-category-details__history-time">{item.updatedAt}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="admin-product-category-details__empty-text">{t('details.emptyHistoryText')}</p>
                  )}
                </DetailBlock>
              </div>

              <aside className="admin-product-category-details__side-column">
                <AdminProductCategoryThumbnail thumbnail={displayCategory.thumbnail} title={displayCategory.title} />

                <DetailBlock title={t('details.blocks.adminTitle')} subtitle={t('details.blocks.adminSubtitle')}>
                  <div className="admin-product-category-details__meta-list">
                    <MetaItem label={t('details.meta.createdBy')} value={getUserLabel(productCategory.createdBy)} />
                    <MetaItem label={t('details.meta.createdAt')} value={formatDateTime(productCategory.createdAt, locale)} />
                    <MetaItem label={t('details.meta.updatedAt')} value={formatDateTime(productCategory.updatedAt, locale)} />
                  </div>
                </DetailBlock>

                <DetailBlock title={t('details.blocks.quickTitle')} subtitle={t('details.blocks.quickSubtitle')}>
                  <div className="admin-product-category-details__quick-actions">
                    <Link to="/admin/product-categories" className="admin-product-category-details__quick-action-link">
                      <Button size="large" className="admin-product-category-details-btn admin-product-category-details-btn--default">
                        {t('details.backToList')}
                      </Button>
                    </Link>

                    <Link to={`/admin/product-categories/edit/${productCategory._id}`} className="admin-product-category-details__quick-action-link">
                      <Button
                        type="primary"
                        size="large"
                        icon={<EditOutlined />}
                        className="admin-product-category-details-btn admin-product-category-details-btn--primary"
                      >
                        {t('details.editNow')}
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
