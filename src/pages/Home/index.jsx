import './Home.scss'
import SEO from '@/components/SEO'
import Widgets from '@/components/Widgets'
import HeroBanner from '@/components/HeroBanner'
import TopDealSession from '@/components/TopDealSession'
import FeaturedProductsSession from '@/components/FeaturedProductsSession'
import FlashSaleSession from '@/components/FlashSaleSession'
import WhyChooseUs from '@/components/WhyChooseUs'

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
      <FlashSaleSession />
      <TopDealSession />
      <FeaturedProductsSession />
      <WhyChooseUs />
    </div>
  )
}

export default Home

