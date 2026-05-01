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

      <Lazy placeholder={<FlashSaleSkeleton />} rootMargin="600px">
        <FlashSale />
      </Lazy>

      <Lazy placeholder={<SliderSkeleton />} rootMargin="300px">
        <TopDeal />
      </Lazy>

      <Lazy placeholder={<SliderSkeleton />} rootMargin="300px">
        <FeaturedProducts />
      </Lazy>

      <Lazy placeholder={<GridSkeleton />} rootMargin="300px">
        <DailySuggestions />
      </Lazy>

      <Lazy placeholder={<WhyChooseUsSkeleton />} rootMargin="200px">
        <WhyChooseUs />
      </Lazy>
    </div>
  )
}

export default Home
