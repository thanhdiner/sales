import React from 'react'

const URL_REGEX = /(https?:\/\/[^\s]+)/g
const URL_TEST_REGEX = /^https?:\/\/\S+$/

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
      <a
        key={`link-${index}`}
        href={url}
        target="_blank"
        rel="noreferrer"
        className={linkClassName}
      >
        {url}
      </a>
    ]

    if (trailing) {
      nodes.push(<React.Fragment key={`trailing-${index}`}>{trailing}</React.Fragment>)
    }

    return nodes
  })
}
