import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons'

export default function ProductRating({ rate }) {
  const rating = rate || 0

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center text-yellow-400">
        {[...Array(5)].map((_, i) => {
          if (i < Math.floor(rating)) {
            return <FontAwesomeIcon key={i} icon={faStar} className="w-3 h-3" />
          } else if (i === Math.floor(rating) && rating % 1 !== 0) {
            return <FontAwesomeIcon key={i} icon={faStarHalfAlt} className="w-3 h-3" />
          } else {
            return <FontAwesomeIcon key={i} icon={faStar} className="w-3 h-3 text-gray-300" />
          }
        })}
      </div>
      <span className="text-xs text-gray-500">({rate || 0})</span>
    </div>
  )
}
