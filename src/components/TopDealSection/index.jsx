import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import TopDeal from './TopDeal'
import './TopDealSection.scss'

function TopDealSection() {
  const { t } = useTranslation('clientHome')

  return (
    <section className="home__top-deal">
      <div className="home__top-deal__header">
        <img src="/images/top-deal-title.png" alt={t('topDealSection.titleAlt')} className="home__top-deal__title-image" />

        <Link to="/products?type=isTopDeal" className="home__top-deal__view-all">
          {t('topDealSection.viewAll')}
        </Link>
      </div>

      <div className="home__top-deal__content">
        <TopDeal />
      </div>
    </section>
  )
}

export default TopDealSection
