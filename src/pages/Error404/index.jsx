import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import './Error404.scss'

function Error404({ path }) {
  const navigate = useNavigate()

  const backHome = () => {
    navigate(path)
  }

  return (
    <>
      <section className="error-page">
        <div className="error-page__left">
          <h1 className="error-page__left__heading">404 - PAGE NOT FOUND</h1>
          <p className="error-page__left__desc">
            The page you are trying to access doesn't exist or has been moved. Try going back to our homepage.
          </p>
          <button className="error-page__left__back--btn" onClick={backHome}>
            <FontAwesomeIcon className="error-page__left__back--icon" icon={faHouse} />
            <span className="error-page__left__back--text">Go Home</span>
          </button>
        </div>
        <div className="error-page__right">
          <img className="error-page__right--img" src="/images/error404.webp" alt="Error404" />
        </div>
      </section>
    </>
  )
}

export default Error404
