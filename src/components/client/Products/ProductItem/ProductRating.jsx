import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons'

export default function ProductRating({ rate, reviewCount }) {
  const rating = Number(rate) || 0
  const hasRating = rating > 0
  const parsedReviewCount = Number(reviewCount)
  const hasReviewCount = Number.isFinite(parsedReviewCount)
  const displayRating = Number.isInteger(rating) ? rating : rating.toFixed(1)
  const displayCount = hasReviewCount
    ? parsedReviewCount
    : hasRating
      ? displayRating
      : 0

  return (
    <div className="flex min-h-[22px] items-center gap-2">
      <div className={`flex items-center ${hasRating ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}>
        {[...Array(5)].map((_, i) => {
          if (i < Math.floor(rating)) {
            return <FontAwesomeIcon key={i} icon={faStar} className="h-3 w-3" />
          } else if (i === Math.floor(rating) && rating % 1 !== 0) {
            return <FontAwesomeIcon key={i} icon={faStarHalfAlt} className="h-3 w-3" />
          } else {
            return <FontAwesomeIcon key={i} icon={faStar} className="h-3 w-3 text-slate-300 dark:text-slate-600" />
          }
        })}
      </div>
      <span className={`text-xs ${hasRating ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'}`}>
        ({displayCount})
      </span>
    </div>
  )
}
