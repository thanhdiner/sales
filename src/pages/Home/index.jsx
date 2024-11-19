import './Home.scss'
import titles from '../../utils/titles'
import Widgets from '../../components/Widgets'
import TopDeal from '../../components/TopDeal'

function Home() {
  titles('Home')

  return (
    <>
      <div className="home">
        <h1 className="home__heading">Trang chủ</h1>
        <Widgets />
        <section className="home__top-deal">
          <div className="home__top-deal__heading-wrap">
            <h2 className="home__heading2">Top Deal</h2>
            <a href="#!">Xem tất cả</a>
          </div>
          <div style={{ marginTop: '30px' }}>
            <TopDeal />
          </div>
        </section>
      </div>
    </>
  )
}

export default Home
