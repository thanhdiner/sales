import { BookOpen, CheckCircle2, ClipboardList, FileText, MessageSquare, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ReviewSection from './ReviewSection'
import { getPlainText, inferDigitalProductInfo } from '../helpers'

function ProductTabsSection({ product, productId, features = [], activeTab, onTabChange }) {
  const { t } = useTranslation('clientProducts')
  const digitalInfo = inferDigitalProductInfo(product, t)
  const categoryTitle = product?.productCategory?.title

  const tabs = [
    { key: 'description', label: t('productDetail.tabs.description'), icon: BookOpen },
    { key: 'specifications', label: t('productDetail.tabs.specifications'), icon: ClipboardList },
    { key: 'reviews', label: t('productDetail.tabs.reviews'), icon: MessageSquare },
    { key: 'policy', label: t('productDetail.tabs.policy'), icon: ShieldCheck }
  ]

  const hasDescription = Boolean(getPlainText(product?.description) || getPlainText(product?.content) || features.length)

  return (
    <section id="product-detail-tabs" className="product-detail-card product-detail-tabs">
      <div className="product-detail-tabs__header">
        <div>
          <p className="product-detail-section-eyebrow">{t('productDetail.tabs.eyebrow')}</p>
          <h2 className="product-detail-section-title">{t('productDetail.tabs.title')}</h2>
        </div>

        <div className="product-detail-tabs__nav" role="tablist" aria-label={t('productDetail.tabs.title')}>
          {tabs.map(tab => {
            const Icon = tab.icon
            const selected = activeTab === tab.key

            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`product-detail-tabs__button ${selected ? 'product-detail-tabs__button--active' : ''}`}
                onClick={() => onTabChange(tab.key)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="product-detail-tabs__body">
        {activeTab === 'description' && (
          <div className="product-detail-tab-panel">
            {hasDescription ? (
              <>
                {product?.description && (
                  <div>
                    <h3>{t('productDetail.infoSections.descriptionTitle')}</h3>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
                  </div>
                )}

                {product?.content && (
                  <div>
                    <h3>{t('productDetail.infoSections.contentTitle')}</h3>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.content }} />
                  </div>
                )}

                {features.length > 0 && (
                  <div>
                    <h3>{t('productDetail.infoSections.featuresTitle')}</h3>
                    <ul className="product-detail-feature-list">
                      {features.map((feature, index) => (
                        <li key={`${feature}-${index}`}>
                          <CheckCircle2 size={17} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="product-detail-empty-text">{t('productDetail.tabs.emptyDescription')}</p>
            )}
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="product-detail-tab-panel">
            <div className="product-detail-spec-grid">
              {categoryTitle && (
                <div className="product-detail-spec-row">
                  <span>{t('productDetail.tabs.category')}</span>
                  <strong>{categoryTitle}</strong>
                </div>
              )}

              {digitalInfo.map(item => (
                <div className="product-detail-spec-row" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}

              <div className="product-detail-spec-row">
                <span>{t('productDetail.tabs.stock')}</span>
                <strong>{Number(product?.stock) > 0 ? t('productDetail.summaryPanel.inStockWithCount', { count: product.stock }) : t('productDetail.summaryPanel.outOfStock')}</strong>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="product-detail-tab-panel product-detail-tab-panel--reviews">
            <ReviewSection productId={productId} />
          </div>
        )}

        {activeTab === 'policy' && (
          <div className="product-detail-tab-panel">
            <div className="product-detail-policy-grid">
              {['delivery', 'warranty', 'usage', 'support', 'security'].map(key => (
                <article className="product-detail-policy-item" key={key}>
                  <FileText size={18} />
                  <div>
                    <h3>{t(`productDetail.policy.${key}.title`)}</h3>
                    <p>{t(`productDetail.policy.${key}.description`)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductTabsSection
