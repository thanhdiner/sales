import './Home.scss'
import titles from '../../utils/titles'
import Widgets from '../../components/Widgets'

function Home() {
  titles('Home')

  return (
    <>
      <div className="home">
        <h1 className="home__heading">Trang chủ</h1>
        <Widgets />
      </div>
    </>
  )
}

export default Home
