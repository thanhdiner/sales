import React from 'react'

const URL_REGEX = /(https?:\/\/[^\s]+)/g
const URL_TEST_REGEX = /^https?:\/\/\S+$/
const IMAGE_EXTENSION_REGEX = /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i
const QR_URL_REGEX = /(qr|qrcode|vietqr|quickchart|res\.cloudinary\.com)/i

function splitTrailingPunctuation(part) {
  const match = part.match(/([.,!?;)\]]+)$/)
  if (!match) {
    return { url: part, trailing: '' }
  }

  return {
    url: part.slice(0, -match[1].length),
    trailing: match[1]
  }
}

function isRenderableImageUrl(url) {
  try {
    const parsedUrl = new URL(url)
    return IMAGE_EXTENSION_REGEX.test(parsedUrl.pathname) || QR_URL_REGEX.test(url)
  } catch {
    return false
  }
}

export function renderTextWithLinks(text, linkClassName = '') {
  if (!text) return null

  return text.split(URL_REGEX).flatMap((part, index) => {
    if (!part) return []

    if (!URL_TEST_REGEX.test(part)) {
      return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>
    }

    const { url, trailing } = splitTrailingPunctuation(part)

    if (!url) {
      return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>
    }

    const nodes = [
      isRenderableImageUrl(url) ? (
        <a
          key={`link-${index}`}
          href={url}
          target="_blank"
          rel="noreferrer"
          className={linkClassName}
        >
          <img
            src={url}
            alt="QR thanh toán"
            loading="lazy"
            style={{ display: 'block', maxWidth: 220, width: '100%', borderRadius: 12, marginTop: 8 }}
          />
        </a>
      ) : (
        <a
          key={`link-${index}`}
          href={url}
          target="_blank"
          rel="noreferrer"
          className={linkClassName}
        >
          {url}
        </a>
      )
    ]

    if (trailing) {
      nodes.push(<React.Fragment key={`trailing-${index}`}>{trailing}</React.Fragment>)
    }

    return nodes
  })
}
