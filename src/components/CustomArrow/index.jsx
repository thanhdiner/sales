import './CustomArrow.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

export function CustomPrevArrow(props) {
  const { className, onClick } = props

  return (
    <>
      <div className={className} onClick={onClick}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
    </>
  )
}

export function CustomNextArrow(props) {
  const { className, onClick } = props

  return (
    <>
      <div className={className} onClick={onClick}>
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    </>
  )
}
