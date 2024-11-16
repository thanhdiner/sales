import './Home.scss'
import titles from '../../utils/titles'

function Home() {
  titles('Home')

  return (
    <>
      <div className=" home">
        <h1 className="home__heading">List Products</h1>
      </div>
    </>
  )
}

export default Home
