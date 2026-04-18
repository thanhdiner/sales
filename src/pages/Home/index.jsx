import './Home.scss'
import SEO from '@/components/SEO'
import Widgets from '@/components/Widgets'
import HeroBanner from '@/components/HeroBanner'
import TopDealSession from '@/components/TopDealSession'
import FeaturedProductsSession from '@/components/FeaturedProductsSession'
import FlashSaleSession from '@/components/FlashSaleSession'
import WhyChooseUs from '@/components/WhyChooseUs'
import DailySuggestionsSession from '@/components/DailySuggestionsSession'

import LazySection from '@/components/LazyLoad/LazySection'
import SliderSkeleton from '@/components/LazyLoad/SliderSkeleton'
import GridSkeleton from '@/components/LazyLoad/GridSkeleton'
import FlashSaleSkeleton from '@/components/FlashSaleSession/FlashSale/FlashSaleSkeleton'

function Home() {
  return (
    <div className="home">
      <SEO
        title="Trang chủ"
        description="SmartMall – Mua tài khoản game, phần mềm bản quyền chính hãng, giá cực tốt. Flash sale hàng ngày, giao hàng nhanh, hỗ trợ 24/7."
        url="https://smartmall.site"
      />
      <HeroBanner />
      <Widgets />
      
      <LazySection placeholder={<FlashSaleSkeleton />} rootMargin="600px">
        <FlashSaleSession />
      </LazySection>

      <LazySection placeholder={<SliderSkeleton />} rootMargin="300px">
        <TopDealSession />
      </LazySection>

      <LazySection placeholder={<SliderSkeleton />} rootMargin="300px">
        <FeaturedProductsSession />
      </LazySection>

      <LazySection placeholder={<GridSkeleton />} rootMargin="300px">
        <DailySuggestionsSession />
      </LazySection>

      <LazySection placeholder={<div style={{ height: '300px' }} />} rootMargin="200px">
        <WhyChooseUs />
      </LazySection>
    </div>
  )
}

export default Home
