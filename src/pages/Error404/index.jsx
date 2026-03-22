import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import './Error404.scss'
import SEO from '@/components/SEO'

function Error404({ path }) {
  const navigate = useNavigate()

  const backHome = () => {
    navigate(path)
  }

  return (
    <>
      <SEO title="404 – Trang không tồn tại" noIndex />
      <section className="error-page dark:bg-gray-800">
        <div className="error-page__left">
          <h1 className="error-page__left__heading dark:text-gray-200">404 - PAGE NOT FOUND</h1>
          <p className="error-page__left__desc dark:text-gray-300">
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
