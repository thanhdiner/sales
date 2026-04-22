import { Star } from 'lucide-react'

export const StarDisplay = ({ value, size = 16 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(star => (
      <Star
        key={star}
        size={size}
        className={star <= Math.round(value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
      />
    ))}
  </div>
)

export const Avatar = ({ user }) => {
  const name = user?.fullName || user?.username || '?'
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={name}
        className="h-10 w-10 rounded-full border border-gray-200 object-cover dark:border-gray-700"
      />
    )
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
      {initials}
    </div>
  )
}
