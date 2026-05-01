import './index.scss'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/shared/SEO'
import Widgets from '@/components/client/Widgets'
import HeroBanner from '@/components/client/HeroBanner'
import TopDeal from '@/components/client/TopDealSection'
import FeaturedProducts from '@/components/client/FeaturedProductsSection'
import FlashSale from '@/components/client/FlashSaleSection'
import WhyChooseUs from '@/components/client/WhyChooseUs'
import DailySuggestions from '@/components/client/DailySuggestionsSection'

import Lazy from '@/components/shared/LazyLoad/LazySection'
import SliderSkeleton from '@/components/shared/LazyLoad/SliderSkeleton'
import GridSkeleton from '@/components/shared/LazyLoad/GridSkeleton'
import FlashSaleSkeleton from '@/components/client/FlashSaleSection/FlashSale/FlashSaleSkeleton'
import WhyChooseUsSkeleton from '@/components/client/WhyChooseUs/WhyChooseUsSkeleton'

const SectionDivider = () => (
  <div className="home__section-divider" aria-hidden="true">
    <svg viewBox="0 0 1920 64" preserveAspectRatio="none">
      <path className="home__section-divider-line" d="M0 32H198L222 16H267L290 32H313L336 16H427L449 32H496L519 48H586L631 16H677L700 32H746L769 16H790L813 32H1064L1087 48H1247L1270 32H1518L1541 16H1634L1656 32H1680L1703 16H1747L1793 48H1854L1876 16H1920" />
      <path className="home__section-divider-runner" d="M0 32H198L222 16H267L290 32H313L336 16H427L449 32H496L519 48H586L631 16H677L700 32H746L769 16H790L813 32H1064L1087 48H1247L1270 32H1518L1541 16H1634L1656 32H1680L1703 16H1747L1793 48H1854L1876 16H1920" />
    </svg>
  </div>
)

function Home() {
  const { t } = useTranslation('clientHome')

  return (
    <div className="home">
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        url="https://smartmall.site"
      />

      <HeroBanner />
      <SectionDivider />
      <Widgets />
      <SectionDivider />

      <Lazy placeholder={<FlashSaleSkeleton />} rootMargin="600px">
        <FlashSale />
      </Lazy>
      <SectionDivider />

      <Lazy placeholder={<SliderSkeleton />} rootMargin="300px">
        <TopDeal />
      </Lazy>
      <SectionDivider />

      <Lazy placeholder={<SliderSkeleton />} rootMargin="300px">
        <FeaturedProducts />
      </Lazy>
      <SectionDivider />

      <Lazy placeholder={<GridSkeleton />} rootMargin="300px">
        <DailySuggestions />
      </Lazy>
      <SectionDivider />

      <Lazy placeholder={<WhyChooseUsSkeleton />} rootMargin="200px">
        <WhyChooseUs />
      </Lazy>
    </div>
  )
}

export default Home
