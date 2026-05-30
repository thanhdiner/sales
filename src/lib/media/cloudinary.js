const CLOUDINARY_UPLOAD_SEGMENT = '/image/upload/'
const CLOUDINARY_HOST = 'res.cloudinary.com'

export function buildCloudinaryImageUrl(src, transforms = 'f_auto,q_auto') {
  if (typeof src !== 'string' || !src.trim()) return ''

  const url = src.trim()

  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.hostname !== CLOUDINARY_HOST || !parsedUrl.pathname.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
      return url
    }

    const [prefix, suffix] = url.split(CLOUDINARY_UPLOAD_SEGMENT)
    if (!prefix || !suffix || suffix.startsWith(`${transforms}/`)) return url

    return `${prefix}${CLOUDINARY_UPLOAD_SEGMENT}${transforms}/${suffix}`
  } catch {
    return url
  }
}

export function buildCloudinaryThumbnailUrl(src, size = 64) {
  return buildCloudinaryImageUrl(src, `f_auto,q_auto,c_fill,w_${size},h_${size}`)
}
