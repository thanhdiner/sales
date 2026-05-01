import { Clock, KeyRound, RotateCcw, Shield, ShieldCheck, Truck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatPromotionDate, inferDigitalProductInfo } from '../helpers'

const supportCards = [
  {
    icon: Shield,
    titleKey: 'productDetail.infoSections.supportCards.warranty.title',
    descriptionKey: 'productDetail.infoSections.supportCards.warranty.description'
  },
  {
    icon: Truck,
    titleKey: 'productDetail.infoSections.supportCards.delivery.title',
    descriptionKey: 'productDetail.infoSections.supportCards.delivery.description'
  },
  {
    icon: RotateCcw,
    titleKey: 'productDetail.infoSections.supportCards.support.title',
    descriptionKey: 'productDetail.infoSections.supportCards.support.description'
  }
]

function ProductInfo({ product, features }) {
  const { t, i18n } = useTranslation('clientProducts')
  const digitalInfo = inferDigitalProductInfo(product, t)
  const compactFeatures = features.slice(0, 4)

  return (
    <section className="product-detail-card product-detail-digital-info">
      <div className="product-detail-card__heading">
        <div className="product-detail-card__icon">
          <KeyRound size={18} />
        </div>

        <div>
          <p className="product-detail-section-eyebrow">{t('productDetail.digitalInfo.eyebrow')}</p>
          <h2 className="product-detail-card__title">{t('productDetail.digitalInfo.title')}</h2>
        </div>
      </div>

      <div className="product-detail-digital-info__grid">
        {digitalInfo.map(item => (
          <div className="product-detail-digital-info__item" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      {product.timeStart && product.timeFinish && (
        <div className="product-detail-promotion-window">
          <Clock size={17} />
          <div>
            <strong>{t('productDetail.infoSections.promotionTime')}</strong>
            <span>
              {t('productDetail.infoSections.promotionRange', {
                start: formatPromotionDate(product.timeStart, i18n.language),
                end: formatPromotionDate(product.timeFinish, i18n.language)
              })}
            </span>
          </div>
        </div>
      )}

      {compactFeatures.length > 0 && (
        <div className="product-detail-compact-features">
          <h3>{t('productDetail.infoSections.featuresTitle')}</h3>

          <ul>
            {compactFeatures.map((feature, index) => (
              <li key={`${feature}-${index}`}>
                <ShieldCheck size={15} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="product-detail-trust-grid">
        {supportCards.map(({ icon: Icon, titleKey, descriptionKey }) => (
          <div key={titleKey} className="product-detail-trust-item">
            <Icon size={19} />
            <div>
              <p>{t(titleKey)}</p>
              <span>{t(descriptionKey)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProductInfo
