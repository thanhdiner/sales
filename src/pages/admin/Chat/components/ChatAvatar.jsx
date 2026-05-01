import { useEffect, useState } from 'react'

export function getAvatarSrc(...values) {
  for (const value of values.flat()) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return ''
}

export function getInitials(name, fallback = '?') {
  const initials = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()

  return initials || fallback
}

export default function ChatAvatar({
  src,
  alt = '',
  className = '',
  imageClassName = 'h-full w-full object-cover',
  children
}) {
  const avatarSrc = getAvatarSrc(src)
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [avatarSrc])

  return (
    <div className={`flex shrink-0 items-center justify-center overflow-hidden ${className}`}>
      {avatarSrc && !imageFailed ? (
        <img
          src={avatarSrc}
          alt={alt}
          loading="lazy"
          className={imageClassName}
          onError={() => setImageFailed(true)}
        />
      ) : children}
    </div>
  )
}
