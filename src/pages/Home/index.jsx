import './Home.scss'
import titles from '@/utils/titles'
import Widgets from '@/components/Widgets'
import HeroBanner from '@/components/HeroBanner'
import TopDealSession from '@/components/TopDealSession'
import FeaturedProductsSession from '@/components/FeaturedProductsSession'
import FlashSaleSession from '@/components/FlashSaleSession'

function Home() {
  titles('Home')

  return (
    <div className="home">
      <HeroBanner />
      <Widgets />
      <FlashSaleSession />
      <TopDealSession />
      <FeaturedProductsSession />
    </div>
  )
}

export default Home
