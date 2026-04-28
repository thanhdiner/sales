import './Home.scss'
import { useTranslation } from 'react-i18next'
import SEO from '@/components/SEO'
import Widgets from '@/components/Widgets'
import HeroBanner from '@/components/HeroBanner'
import TopDealSection from '@/components/TopDealSection'
import FeaturedProductsSection from '@/components/FeaturedProductsSection'
import FlashSaleSection from '@/components/FlashSaleSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import DailySuggestionsSection from '@/components/DailySuggestionsSection'

import LazySection from '@/components/LazyLoad/LazySection'
import SliderSkeleton from '@/components/LazyLoad/SliderSkeleton'
import GridSkeleton from '@/components/LazyLoad/GridSkeleton'
import FlashSaleSkeleton from '@/components/FlashSaleSection/FlashSale/FlashSaleSkeleton'
import WhyChooseUsSkeleton from '@/components/WhyChooseUs/WhyChooseUsSkeleton'

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
      <Widgets />

      <LazySection placeholder={<FlashSaleSkeleton />} rootMargin="600px">
        <FlashSaleSection />
      </LazySection>

      <LazySection placeholder={<SliderSkeleton />} rootMargin="300px">
        <TopDealSection />
      </LazySection>

      <LazySection placeholder={<SliderSkeleton />} rootMargin="300px">
        <FeaturedProductsSection />
      </LazySection>

      <LazySection placeholder={<GridSkeleton />} rootMargin="300px">
        <DailySuggestionsSection />
      </LazySection>

      <LazySection placeholder={<WhyChooseUsSkeleton />} rootMargin="200px">
        <WhyChooseUs />
      </LazySection>
    </div>
  )
}

export default Home
